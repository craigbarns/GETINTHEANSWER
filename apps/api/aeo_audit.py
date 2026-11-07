"""On-site AEO audit — measures how citation-worthy a website is for AI engines.

Methodology inspired by published AEO research (answer-first content earns
4.8x more citations, comparison tables 2.8x, FAQ blocks +156%, in-text
citations +115% visibility). Two halves:

- Foundational (50%): 16 deterministic checks across up to 5 pages.
- Intelligence (50%): heuristic content-quality prior on the most
  representative page (an LLM evaluation can refine this later).

Final score maps to an A-F grade, with prioritized fixes.
"""

import asyncio
import json
import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlsplit

import httpx

from site_audit import BROWSER_USER_AGENT, UnsafeWebsiteUrl, fetch_via_http, strip_html

MAX_PAGES = 5
CRAWL_TIMEOUT = 25

AI_CRAWLERS = [
    "gptbot", "claudebot", "perplexitybot", "oai-searchbot",
    "google-extended", "ccbot", "applebot-extended", "meta-externalagent",
]


@dataclass
class AeoCheck:
    key: str
    label: str
    passed: bool
    weight: int
    detail: str = ""
    failed_pages: int = 0


@dataclass
class DimensionScore:
    key: str
    label: str
    score: float  # 0-5
    rationale: str


@dataclass
class AeoFix:
    title: str
    impact: str  # high | medium | low
    why: str


@dataclass
class AeoReport:
    url: str
    fetched: bool
    pages_crawled: int = 0
    foundational_score: int = 0
    intelligence_score: int = 0
    final_score: int = 0
    grade: str = "F"
    intelligence_source: str = "none"  # "llm" | "heuristic" | "none"
    checks: List[AeoCheck] = field(default_factory=list)
    dimensions: List[DimensionScore] = field(default_factory=list)
    fixes: List[AeoFix] = field(default_factory=list)


LLM_DIMENSIONS_PROMPT = """You are an AI search engine evaluating whether this website deserves to be cited in your answers. Score each dimension 0-5 (one decimal allowed).

Dimensions:
- answer_readiness: does the content directly answer buyer questions, early in paragraphs? (answers in first paragraphs earn far more citations)
- quotability: are there self-contained 40-60 word passages, comparison tables, FAQ blocks an engine could quote verbatim?
- evidence_density: concrete figures, named sources, study citations a fact-checker could verify?
- entity_clarity: is it unmistakable who/what the site is about (name, location, schema, about section)?
- freshness: visible or structured dates, evergreen accuracy?
- structure: heading hierarchy, lists, tables — easy to parse?

Return STRICT JSON only: {{"answer_readiness": {{"score": 0.0, "rationale": "one sentence"}}, ...}} for all six keys.

Page excerpts:
{excerpts}"""


async def score_with_llm(client, model: str, pages: List[Dict[str, str]]) -> Optional[List[DimensionScore]]:
    """Score the 6 dimensions with a real model; None on any failure."""
    excerpts = "\n\n---\n\n".join(
        f"URL: {p['url']}\n{strip_html(p['html'])[:2200]}" for p in pages[:3]
    )
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": LLM_DIMENSIONS_PROMPT.format(excerpts=excerpts)}],
            temperature=0.1,
            max_tokens=700,
        )
        raw = response.choices[0].message.content or ""
        match = re.search(r"\{.*\}", raw, re.S)
        if not match:
            return None
        data = json.loads(match.group(0))
        dims = []
        for key, label in (
            ("answer_readiness", "Answer Readiness"),
            ("quotability", "Quotability"),
            ("evidence_density", "Evidence Density"),
            ("entity_clarity", "Entity Clarity"),
            ("freshness", "Freshness"),
            ("structure", "Structure / Parseability"),
        ):
            entry = data.get(key) or {}
            score = float(entry.get("score", 0))
            if not 0 <= score <= 5:
                return None
            dims.append(DimensionScore(key, label, score, str(entry.get("rationale", ""))[:200]))
        return dims if len(dims) == 6 else None
    except Exception:
        return None


def _meta(html: str, name_pattern: str) -> Optional[str]:
    match = re.search(
        rf'<meta[^>]+(?:name|property)=["\']{name_pattern}["\'][^>]+content=["\']([^"\']+)["\']',
        html, re.I,
    ) or re.search(
        rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:name|property)=["\']{name_pattern}["\']',
        html, re.I,
    )
    return match.group(1).strip() if match else None


def _extract_links(html: str, base_url: str) -> List[str]:
    origin = f"{urlsplit(base_url).scheme}://{urlsplit(base_url).netloc}"
    links = []
    for match in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\']', html, re.I):
        href = match.group(1)
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        absolute = urljoin(origin, href)
        if absolute.startswith(origin):
            links.append(absolute.split("#")[0])
    return links


async def _fetch_text_resource(client: httpx.AsyncClient, url: str) -> Optional[str]:
    try:
        response = await client.get(url, follow_redirects=True)
        if response.status_code < 400:
            return response.text
    except httpx.HTTPError:
        pass
    return None


def _pick_pages(home_html: str, home_url: str, links: List[str]) -> List[str]:
    """Home + the richest internal pages (services/faq/about style)."""
    scored: Dict[str, int] = {}
    for link in links:
        lowered = link.lower().rstrip("/")
        if lowered.rstrip("/") == home_url.lower().rstrip("/"):
            continue
        score = 0
        for token in ("service", "faq", "about", "guide", "price", "contact", "blog", "offre", "a-propos", "tarif"):
            if token in lowered:
                score += 2
        scored[link] = scored.get(link, 0) + score
    ranked = sorted(scored, key=lambda l: -scored[l])
    return [home_url] + ranked[: MAX_PAGES - 1]


def _ai_crawlers_blocked(robots_txt: str) -> bool:
    """True if any robots.txt group targeting all users (*) or a known AI
    crawler carries a full 'Disallow: /' rule. Empty Disallow = allow."""
    blocked = False
    current_agents: List[str] = []
    for raw_line in robots_txt.splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        ua_match = re.match(r"user-agent\s*:\s*(.+)", line, re.I)
        if ua_match:
            current_agents = [agent.strip().lower() for agent in ua_match.group(1).split(",")]
            continue
        disallow_match = re.match(r"disallow\s*:\s*(.*)", line, re.I)
        if disallow_match and current_agents:
            path = disallow_match.group(1).strip()
            if path in ("/", "/*") and any(agent == "*" or agent in AI_CRAWLERS for agent in current_agents):
                blocked = True
    return blocked


def _foundational_checks(pages: List[Dict[str, str]], home_url: str) -> List[AeoCheck]:
    """16 deterministic checks, site-wide across crawled pages."""
    n = len(pages) or 1
    robots_txt = pages[0].get("robots_txt") or ""
    llms = pages[0].get("llms_txt") or ""
    home = pages[0]["html"]

    def make(key, label, weight, fails, detail_fail):
        return AeoCheck(
            key=key, label=label, weight=weight,
            passed=len(fails) == 0, failed_pages=len(fails),
            detail=detail_fail if fails else f"Passed on {n - len(fails)}/{n} pages.",
        )

    def pages_failing(predicate):
        return [p["url"] for p in pages if not predicate(p["html"])]

    checks = [
        make("title", "Clear page title", 10,
             pages_failing(lambda h: bool(re.search(r"<title[^>]*>[^<]{10,}</title>", h, re.I))),
             "Page title missing or too short (<10 chars) on some pages."),
        make("meta_description", "Meta description", 10,
             pages_failing(lambda h: bool(_meta(h, "description"))),
             "Meta description missing on some pages — engines use it for answer snippets."),
        make("canonical", "Canonical URL", 8,
             pages_failing(lambda h: bool(re.search(r'<link[^>]+rel=["\']canonical["\']', h, re.I))),
             "Missing canonical tags — duplicate-page signals confuse crawlers."),
        make("single_h1", "Single H1 heading", 8,
             pages_failing(lambda h: len(re.findall(r"<h1[\s>]", h, re.I)) == 1),
             "Pages without exactly one H1 — the main topic is ambiguous to parsers."),
        make("structured_data", "Structured data present (JSON-LD)", 8,
             pages_failing(lambda h: 'application/ld+json' in h.lower()),
             "No JSON-LD on some pages — engines lack machine-readable facts."),
        make("schema_types", "Recognized schema types", 8,
             pages_failing(lambda h: bool(re.search(r'"@type"\s*:', h, re.I))),
             "JSON-LD blocks without recognizable @type annotations."),
        make("open_graph", "Open Graph basics", 8,
             pages_failing(lambda h: bool(_meta(h, "og:title")) and bool(_meta(h, "og:description"))),
             "Open Graph title/description missing — shared previews and some engines rely on them."),
        make("internal_links", "Internal linking", 10,
             pages_failing(lambda h: len(_extract_links(h, home_url)) >= 5),
             "Fewer than 5 internal links on some pages — crawlers can't discover depth."),
        make("headings_hierarchy", "Heading hierarchy (H2+)", 6,
             pages_failing(lambda h: bool(re.search(r"<h2[\s>]", h, re.I))),
             "No H2 subsections — long pages are hard for engines to segment."),
        make("text_density", "Real text content", 6,
             pages_failing(lambda h: len(strip_html(h)) >= 600),
             "JS-shell or near-empty pages — nothing for an engine to quote."),
        make("https", "HTTPS", 4, [] if home_url.startswith("https") else [home_url],
             "Site not served over HTTPS."),
        make("viewport", "Mobile viewport", 4,
             pages_failing(lambda h: bool(re.search(r'name=["\']viewport["\']', h, re.I))),
             "Viewport meta missing — mobile rendering unknown to crawlers."),
        make("robots_ai", "robots.txt permits AI crawlers", 10,
             [home_url] if _ai_crawlers_blocked(robots_txt) else [],
             "robots.txt explicitly blocks a major AI crawler (GPTBot/ClaudeBot/PerplexityBot…) — engines may not cite what they never crawled."),
        make("llms_txt", "llms.txt served", 4,
             [] if llms else [home_url],
             "No llms.txt — an optional but growing convention for AI discovery."),
        make("rss_feed", "RSS/Atom feed", 6,
             [] if re.search(r'application/(rss|atom)\+xml', home, re.I) else [home_url],
             "No RSS/Atom feed discovered — engines track fresh content through feeds."),
        make("dates", "Published/modified dates", 6,
             pages_failing(lambda h: bool(re.search(r'datePublished|dateModified|<time[\s>]', h, re.I))),
             "No visible or structured dates — freshness cannot be verified."),
    ]
    return checks


def _intelligence_prior(home: Dict[str, str]) -> List[DimensionScore]:
    """Deterministic content-quality prior (0-5 each) on the home page."""
    html = home["html"]
    text = strip_html(html)
    lowered = text.lower()
    h2s = re.findall(r"<h2[^>]*>(.*?)</h2>", html, re.I | re.S)
    h2_texts = [strip_html(h) for h in h2s]
    question_headings = sum(1 for h in h2_texts if re.search(r"\?|\bhow\b|\bwhat\b|\bwhy\b|\bwho\b|comment|pourquoi|qu'est", h, re.I))
    n_h2 = len(h2_texts) or 1

    has_table = "<table" in html.lower()
    has_faq = bool(re.search(r'\bfaq\b|questions? fr', lowered)) or '"faqpage"' in html.lower()
    has_lists = len(re.findall(r"<(ul|ol)[\s>]", html, re.I)) >= 2
    numbers = len(re.findall(r"\b\d[\d,.]*\s?(%|k|€|\$|ans|years|days|clients|projets)\b", lowered))
    citations = len(re.findall(r"\b(selon|source[s]?[: ]|étude|study|rapport|report|recherche)\b", lowered))

    def clamp(v):
        return max(0.0, min(5.0, v))

    dimensions = [
        DimensionScore(
            "answer_readiness", "Answer Readiness",
            clamp(1.5 + 2.5 * (question_headings / n_h2) + (1 if has_faq else 0)),
            f"{question_headings}/{len(h2_texts)} section headings are question-shaped"
            + (" and a FAQ block exists" if has_faq else "")
            + ". Answers in first paragraphs earn 4.8x more citations.",
        ),
        DimensionScore(
            "quotability", "Quotability",
            clamp(1 + (2 if has_table else 0) + (1.5 if has_faq else 0) + (0.5 if has_lists else 0)),
            ("Comparison table found (2.8x citations). " if has_table else "")
            + ("FAQ block (+156%). " if has_faq else "")
            + ("Multiple structured lists. " if has_lists else "")
            + "Engines quote self-contained 40-60 word passages.",
        ),
        DimensionScore(
            "evidence_density", "Evidence Density",
            clamp(1 + numbers * 0.4 + citations * 0.7),
            f"{numbers} concrete figures and {citations} named sources/studies detected. "
            "In-text citations add +115% visibility; statistics add +40% citation rate.",
        ),
        DimensionScore(
            "entity_clarity", "Entity Clarity",
            clamp(2 + (2 if '"@type"' in html else 0) + (1 if re.search(r"à propos|about|qui sommes", lowered) else 0)),
            "Named schema entities and an about section make WHO the site is about unambiguous.",
        ),
        DimensionScore(
            "freshness", "Freshness",
            clamp(2.5 + (2 if re.search(r'datePublished|dateModified', html, re.I) else 0) + (0.5 if "<time" in html.lower() else 0)),
            "Visible/structured dates let engines verify the content is current.",
        ),
        DimensionScore(
            "structure", "Structure / Parseability",
            clamp(1.5 + (1.5 if n_h2 >= 3 else 0) + (1 if has_lists else 0) + (1 if has_table else 0)),
            f"{len(h2_texts)} H2 sections, {'lists' if has_lists else 'no lists'}, {'tables' if has_table else 'no tables'}.",
        ),
    ]
    return dimensions


def _grade(score: int) -> str:
    return "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D" if score >= 60 else "F"


def _fixes(checks: List[AeoCheck], dims: List[DimensionScore]) -> List[AeoFix]:
    fixes: List[AeoFix] = []
    failed = {c.key for c in checks if not c.passed}
    if "structured_data" in failed or "schema_types" in failed:
        fixes.append(AeoFix("Add structured data (JSON-LD) on key templates", "high",
                            "Agents rely on machine-readable facts to verify and cite a business."))
    if "faq" in {d.key for d in dims if d.score < 2.5}:
        fixes.append(AeoFix("Add FAQ / answer-first content", "high",
                            "Answer-shaped content earns 4.8x more citations and +156% for FAQ blocks."))
    if "robots_ai" in failed:
        fixes.append(AeoFix("Permit AI crawlers in robots.txt", "high",
                            "If GPTBot/ClaudeBot/PerplexityBot are blocked, engines may not cite what they never crawled."))
    dim_low = sorted(dims, key=lambda d: d.score)[:2]
    for d in dim_low:
        if d.score < 2.5 and d.key == "quotability":
            fixes.append(AeoFix("Add comparison tables and self-contained answer blocks", "medium",
                                "Tables earn 2.8x more citations."))
        if d.score < 2.5 and d.key == "evidence_density":
            fixes.append(AeoFix("Add figures, named sources and study citations", "medium",
                                "Statistics add +40% citation rate; in-text citations +115% visibility."))
    if "rss_feed" in failed:
        fixes.append(AeoFix("Add an RSS/Atom feed", "low", "Feeds help AI systems discover and track new content."))
    if "llms_txt" in failed:
        fixes.append(AeoFix("Serve an llms.txt", "low", "Growing convention that summarizes the site for AI agents."))
    return fixes[:6]


async def aeo_audit(url: str, llm_client=None, llm_model: str = "") -> AeoReport:
    await __import__("site_audit").validate_public_http_url(url)
    report = AeoReport(url=url, fetched=False)

    async with httpx.AsyncClient(timeout=CRAWL_TIMEOUT, headers={"User-Agent": BROWSER_USER_AGENT}) as client:
        home_html = await fetch_via_http(url)
        if not home_html:
            return report
        origin = f"{urlsplit(url).scheme}://{urlsplit(url).netloc}"
        robots_task = _fetch_text_resource(client, origin + "/robots.txt")
        llms_task = _fetch_text_resource(client, origin + "/llms.txt")
        robots_txt, llms_txt = await asyncio.gather(robots_task, llms_task)
        robots_txt, llms_txt = robots_txt or "", llms_txt or ""

        pages: List[Dict[str, str]] = [{"url": url, "html": home_html, "robots_txt": robots_txt, "llms_txt": llms_txt}]
        for page_url in _pick_pages(home_html, url, _extract_links(home_html, url))[1: MAX_PAGES]:
            page_html = await fetch_via_http(page_url)
            if page_html:
                pages.append({"url": page_url, "html": page_html, "robots_txt": robots_txt, "llms_txt": llms_txt})

    report.pages_crawled = len(pages)
    report.checks = _foundational_checks(pages, url)

    report.intelligence_source = "heuristic"
    report.dimensions = _intelligence_prior(pages[0])
    if llm_client and llm_model:
        llm_dims = await score_with_llm(llm_client, llm_model, pages)
        if llm_dims:
            report.dimensions = llm_dims
            report.intelligence_source = "llm"

    total_weight = sum(c.weight for c in report.checks)
    passed_weight = sum(c.weight for c in report.checks if c.passed)
    report.foundational_score = round(100 * passed_weight / total_weight)
    report.intelligence_score = round(100 * sum(d.score for d in report.dimensions) / 30)
    report.final_score = round(0.5 * report.foundational_score + 0.5 * report.intelligence_score)
    report.grade = _grade(report.final_score)
    report.fixes = _fixes(report.checks, report.dimensions)
    report.fetched = True
    return report
