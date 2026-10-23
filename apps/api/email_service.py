"""Transactional email via Resend's REST API.

No-ops entirely when RESEND_API_KEY is unset, matching the pattern used for
every other optional integration in this app (Anthropic, Perplexity, Gemini,
Firecrawl): the product works without it, and it activates the moment the
env var is set — no redeploy-time branching needed.
"""

import asyncio
import os
from html import escape
from typing import Optional

import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
FROM_ADDRESS = os.getenv("RESEND_FROM_ADDRESS", "GetInTheAnswer <reports@getintheanswer.com>")
NOTIFY_ADDRESS = os.getenv("NOTIFY_EMAIL", "").strip()

RESEND_ENDPOINT = "https://api.resend.com/emails"


async def send_email(to: str, subject: str, html: str, reply_to: Optional[str] = None, idempotency_key: Optional[str] = None) -> bool:
    if not RESEND_API_KEY:
        return False
    try:
        payload = {"from": FROM_ADDRESS, "to": [to], "subject": subject, "html": html}
        if reply_to:
            payload["reply_to"] = reply_to

        headers = {"Authorization": f"Bearer {RESEND_API_KEY}"}
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        attempts = 3 if idempotency_key else 1
        async with httpx.AsyncClient(timeout=15) as client:
            for attempt in range(attempts):
                try:
                    response = await client.post(RESEND_ENDPOINT, headers=headers, json=payload)
                    if response.status_code < 400:
                        return True
                    if response.status_code not in (409, 429) and response.status_code < 500:
                        return False
                except httpx.HTTPError:
                    pass
                if attempt + 1 < attempts:
                    await asyncio.sleep(attempt + 1)
        return False
    except Exception:
        return False


def agency_inquiry_email(
    full_name: str,
    work_email: str,
    company_name: str,
    website_url: Optional[str],
    location_count: int,
    message: Optional[str],
    inquiry_type: str = "agency",
) -> tuple[str, str]:
    safe_company = " ".join(company_name.split())
    done_for_you = inquiry_type == "done_for_you"
    subject = (
        f"Done-for-you request: {safe_company}"
        if done_for_you
        else f"Agency inquiry: {safe_company} ({location_count} locations)"
    )
    heading = "New done-for-you request" if done_for_you else "New agency inquiry"

    def safe(value: Optional[str], fallback: str = "Not provided") -> str:
        if not value or not value.strip():
            return fallback
        return escape(value.strip()).replace("\n", "<br>")

    website = safe(website_url)
    website_row = (
        f'<a href="{website}" rel="noreferrer">{website}</a>'
        if website_url
        else website
    )
    html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:620px;color:#173b35;">
      <div style="background:#173b35;padding:24px 28px;border-radius:16px 16px 0 0;">
        <span style="color:#bef264;font-weight:800;font-size:20px;">GetInTheAnswer</span>
      </div>
      <div style="background:#f8f8f3;padding:28px;border-radius:0 0 16px 16px;">
        <h1 style="font-size:22px;margin:0 0 20px;">{heading}</h1>
        <table style="border-collapse:collapse;width:100%;line-height:1.5;">
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Name</td><td><b>{safe(full_name)}</b></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Work email</td><td>{safe(work_email)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Company</td><td>{safe(company_name)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Locations</td><td>{location_count}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Website</td><td>{website_row}</td></tr>
        </table>
        <div style="margin-top:22px;padding-top:20px;border-top:1px solid #dfe4dc;">
          <p style="margin:0 0 8px;color:#66736f;">Goals or context</p>
          <p style="margin:0;line-height:1.65;">{safe(message)}</p>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#66736f;">Reply to this email to answer the prospect directly.</p>
      </div>
    </div>
    """
    return subject, html


REPORT_READY_COPY = {
    "en": {
        "subject": "Your AI visibility report for {company} is ready",
        "title": "Your report for {company} is ready",
        "body": (
            "We asked ChatGPT, Claude, Gemini and Perplexity the questions your customers actually ask. "
            "Here's what they said about {company} — and who they recommended instead."
        ),
        "cta": "View your report",
        "footer": "This link is private to you — keep it handy, it always points to your latest results.",
    },
    "fr": {
        "subject": "Votre rapport de visibilité IA pour {company} est prêt",
        "title": "Votre rapport pour {company} est prêt",
        "body": (
            "Nous avons posé à ChatGPT, Claude, Gemini et Perplexity les questions que vos clients posent vraiment. "
            "Voici ce qu'ils disent de {company} — et qui ils recommandent à votre place."
        ),
        "cta": "Voir mon rapport",
        "footer": "Ce lien vous est personnel : gardez-le, il mène toujours à vos derniers résultats.",
    },
}


def report_ready_email(company_name: str, dashboard_url: str, locale: str = "en") -> tuple[str, str]:
    copy = REPORT_READY_COPY.get(locale, REPORT_READY_COPY["en"])
    plain_company = " ".join(company_name.split())
    company = escape(plain_company)
    subject = copy["subject"].format(company=plain_company)
    html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#111;">
      <div style="background:#173b35;padding:28px 32px;border-radius:16px 16px 0 0;">
        <span style="color:#bef264;font-weight:800;font-size:20px;">GetInTheAnswer</span>
      </div>
      <div style="background:#f8f8f3;padding:32px;border-radius:0 0 16px 16px;">
        <h1 style="font-size:22px;margin:0 0 12px;">{copy["title"].format(company=company)}</h1>
        <p style="line-height:1.6;color:#444;">
          {copy["body"].format(company=company)}
        </p>
        <a href="{escape(dashboard_url)}" style="display:inline-block;margin-top:16px;background:#173b35;color:#bef264;
           padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:800;">
          {copy["cta"]}
        </a>
        <p style="margin-top:28px;font-size:13px;color:#888;">
          {copy["footer"]}
        </p>
      </div>
    </div>
    """
    return subject, html


def notify_scan_completed_email(
    company_name: str, requester_email: str, city: str, industry: str, score: int, mode: str, dashboard_url: str
) -> tuple[str, str]:
    subject = f"New scan: {company_name} ({city}) — score {score}/100"
    html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;">
      <h2>New GetInTheAnswer scan</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Company</td><td><b>{company_name}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td>{requester_email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">City / Industry</td><td>{city} · {industry}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Score</td><td><b>{score}/100</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Mode</td><td>{mode}</td></tr>
      </table>
      <p><a href="{dashboard_url}">View this report →</a></p>
    </div>
    """
    return subject, html


def weekly_report_email(company_name: str, dashboard_url: str, changes: list[dict], history: list[dict], locale: str = "en") -> tuple[str, str]:
    fr = locale == "fr"
    company = " ".join(company_name.split())
    first = next((c for c in changes if c["kind"] == "new_mention"), changes[0] if changes else None)
    if first and first["kind"] == "new_mention":
        subject = (f"Bonne nouvelle : {first['engine']} cite maintenant {company}" if fr else f"Good news: {first['engine']} now names {company}")
    elif first:
        subject = (f"Votre visibilité a changé sur {first['engine']} — {company}" if fr else f"Your visibility changed on {first['engine']} — {company}")
    else:
        subject = f"Votre point visibilité IA de la semaine — {company}" if fr else f"Your weekly AI visibility update — {company}"
    subject = " ".join(subject.split())
    items = []
    for change in changes[:5]:
        engine = escape(change["engine"])
        size, before, after = change["questions"], change["before"], change["after"]
        if change["kind"] == "new_mention":
            text = (f"{engine} vous cite désormais dans {after} des {size} questions comparables, contre {before} au relevé précédent." if fr else f"{engine} now names you in {after} of {size} comparable questions, versus {before} in the previous scan.")
        elif change["kind"] == "lost_mention":
            text = (f"{engine} ne vous cite plus dans les {size} questions comparables, contre {before} citations au relevé précédent." if fr else f"{engine} no longer names you in the {size} comparable questions, versus {before} mentions previously.")
        else:
            rival = escape(change["competitor"])
            count = change["competitor_mentions"]
            text = (f"{rival} vous a dépassé sur {engine} dans cet échantillon : {count} citations contre {after}, sur {size} questions comparables." if fr else f"{rival} overtook you on {engine} in this sample: {count} mentions versus {after}, across {size} comparable questions.")
        items.append(f'<li style="margin:12px 0;line-height:1.6;">{text}</li>')
    summary = "".join(items) or ("<li>Votre nouveau relevé est prêt. Consultez les réponses et les entreprises citées dans votre rapport.</li>" if fr else "<li>Your latest scan is ready. See the answers and named businesses in your report.</li>")
    chart = ""
    if len(history) >= 2:
        cells = []
        for point in history[-8:]:
            score = max(0, min(100, int(point["score"])))
            date = escape(str(point["date"])[:10])
            cells.append(f'<td style="padding:8px;vertical-align:bottom;text-align:center;"><b>{score}</b><div style="height:{max(2, round(score * .8))}px;background:#173b35;border-radius:4px;margin-top:6px;"></div><small>{date}</small></td>')
        label = "Évolution de votre score mesuré" if fr else "Your measured score over time"
        chart = f'<h2 style="font-size:16px;margin-top:24px;">{label}</h2><table role="presentation" style="width:100%;table-layout:fixed;"><tr>{"".join(cells)}</tr></table>'
    title = "Ce qui a changé cette semaine" if fr else "What changed this week"
    note = "Les alertes comparent les mêmes questions sur le même moteur. Les réponses des IA peuvent varier entre deux relevés." if fr else "Alerts compare the same questions on the same engine. AI answers can vary between scans."
    cta = "Voir mon rapport et les corrections prêtes à copier" if fr else "View my report and copy-ready fixes"
    html = f'''<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:auto;color:#173b35;">
      <div style="background:#173b35;color:#bef264;padding:24px;border-radius:16px 16px 0 0;font-size:22px;font-weight:800;">GetInTheAnswer</div>
      <div style="padding:28px;background:#f8f8f3;border-radius:0 0 16px 16px;">
        <h1 style="font-size:24px;">{title}</h1><p><b>{escape(company)}</b></p><ul style="padding-left:20px;">{summary}</ul>{chart}
        <p style="font-size:13px;line-height:1.6;color:#66736f;">{note}</p>
        <a href="{escape(dashboard_url, quote=True)}" style="display:inline-block;padding:14px 22px;background:#173b35;color:#bef264;border-radius:999px;text-decoration:none;font-weight:700;">{cta}</a>
      </div></div>'''
    return subject, html
