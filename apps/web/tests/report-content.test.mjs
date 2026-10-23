import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

function load(name) {
  const source = readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(code, context);
  return context.exports;
}

const { selectReportEvidence } = load("report-evidence");
const { localizeRecommendation } = load("report-localization");
const { buildReportDeliverables } = load("report-deliverables");
const answer = (engine, mentioned, excerpt) => ({ engine, brand_mentioned: mentioned, query: "Question de test", competitors_detected: ["Concurrent de test"], answer_excerpt: excerpt });

test("proof never turns simulations or missing excerpts into real quotes", () => {
  assert.equal(selectReportEvidence({ mode: "simulation", queries: [answer("ChatGPT", false, "Concurrent de test")] }), null);
  assert.equal(selectReportEvidence({ mode: "live", queries: [answer("ChatGPT", false, null)] }), null);
});

test("proof prefers an actual missed ChatGPT answer naming a competitor", () => {
  const wanted = answer("ChatGPT", false, "Consultez Concurrent de test.");
  const data = { mode: "live", queries: [answer("ChatGPT", true, "Votre entreprise"), answer("Claude", false, "Concurrent de test"), wanted] };
  assert.equal(selectReportEvidence(data), wanted);
  assert.equal(selectReportEvidence(data).answer_excerpt, "Consultez Concurrent de test.");
});

test("legacy French recommendation keeps real service, city and priority", () => {
  const input = { title: "Create a local FAQ page", description: "Answer the questions customers actually ask about agence immobilière and the areas you serve around Marseille.", priority: "high", estimated_impact: "high" };
  const result = localizeRecommendation(input, "fr");
  assert.equal(result.title, "Créer une page FAQ locale");
  assert.match(result.description, /agence immobilière/);
  assert.match(result.description, /Marseille/);
  assert.equal(result.priority, input.priority);
  assert.equal(localizeRecommendation(input, "en"), input);
  const custom = { ...input, description: "Custom evidence-based recommendation" };
  assert.equal(localizeRecommendation(custom, "fr"), custom);
});

const report = { mode: "live", unlocked: true, company_name: "Entreprise de test", city: "Marseille", industry: "Plomberie", services: "recherche de fuite", website_url: "https://example.com", queries: [{ query: "Quel plombier contacter en urgence à Marseille ?" }, { query: "Quelle entreprise de plomberie choisir à Marseille ?" }] };

test("copy-ready assets enforce entitlement and real scan provenance", () => {
  assert.equal(buildReportDeliverables({ ...report, unlocked: false }, "fr"), null);
  assert.equal(buildReportDeliverables({ ...report, mode: "simulation" }, "fr"), null);
  const assets = buildReportDeliverables(report, "fr");
  assert.equal(assets.faq[0].sourceQuestion, report.queries[0].query);
  assert.match(assets.faqHtml, /recherche de fuite/);
  const schema = JSON.parse(assets.schemaCode.replace(/^<script[^>]*>\n|\n<\/script>$/g, ""));
  assert.equal(schema.name, report.company_name);
  assert.equal(schema.url, report.website_url);
  for (const field of ["telephone", "openingHours", "aggregateRating", "priceRange"]) assert.equal(field in schema, false);
  assert.equal(assets.googleDescription.includes("https://"), false);
  assert.ok(assets.googleDescription.length <= 750);
});

test("copy-ready HTML escapes profile input and obeys Google description limits", () => {
  const assets = buildReportDeliverables({ ...report, company_name: '</script><img src=x onerror="alert(1)">', services: "service ".repeat(90) + "https://example.com/promotion" }, "fr");
  assert.ok(assets.googleDescription.length <= 750);
  assert.equal(assets.googleDescription.includes("https://"), false);
  assert.equal(assets.faqHtml.includes("<img"), false);
  assert.equal(assets.schemaCode.split("</script>").length, 2);
});
