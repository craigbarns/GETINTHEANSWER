import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

function load(name) {
  const source = readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(code, context);
  return context.exports;
}

const { selectReportEvidence } = load("report-evidence");
const { localizeRecommendation } = load("report-localization");
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
