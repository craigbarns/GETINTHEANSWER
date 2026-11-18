import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));

function load(name) {
  const source = readFileSync(join(SRC, "lib", `${name}.ts`), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(code, context);
  return context.exports;
}

/** English path of every static page under app/fr, e.g. "/tools/ai-chat". */
function frenchPages(dir = join(SRC, "app", "fr")) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!entry.startsWith("[")) found.push(...frenchPages(full));
    } else if (entry === "page.tsx") {
      const rel = relative(join(SRC, "app", "fr"), dir).split(sep).join("/");
      found.push(rel ? `/${rel}` : "/");
    }
  }
  return found;
}

const { LOCALIZED_PATHS, localePath, localizedAlternates } = load("i18n");

test("every French page is declared bilingual", () => {
  // A French page missing from LOCALIZED_PATHS declares the English URL as its
  // canonical and hreflang="fr", so search engines never index it.
  const pages = frenchPages();
  assert.ok(pages.length > 0);
  for (const path of pages) {
    assert.ok(LOCALIZED_PATHS.includes(path), `${path} has a French page but is not in LOCALIZED_PATHS`);
  }
});

test("every declared bilingual path has a French page", () => {
  const pages = new Set(frenchPages());
  for (const path of LOCALIZED_PATHS) {
    assert.ok(pages.has(path), `${path} is in LOCALIZED_PATHS but app/fr has no page for it`);
  }
});

test("French pages are their own canonical", () => {
  for (const path of LOCALIZED_PATHS) {
    const expected = path === "/" ? "/fr" : `/fr${path}`;
    const alternates = localizedAlternates("fr", path);
    assert.equal(alternates.canonical, expected);
    assert.equal(alternates.languages.fr, expected);
    assert.equal(alternates.languages.en, path);
  }
  assert.equal(localePath("fr", "/tools/ai-chat?x=1"), "/fr/tools/ai-chat?x=1");
  assert.equal(localePath("fr", "/study"), "/study");
});
