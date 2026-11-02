import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const metadataDir = path.join(root, "metadata/adobe-stock");
const header = ["Filename", "Title", "Keywords", "Category", "Releases"];
const families = [
  "Focus Corner Brackets", "Blank Caption Strip", "Directional Arrow",
  "Impact Accents", "Brush Caption", "Circle Highlights", "Attention Marks",
];
// Scope is independent of the metadata rows so omissions fail validation.
const scopePattern = /^(Focus[A-Z]|Caption[A-Z]|DirectionalArrow|ImpactAccent|BrushCaption|NaturalBrushCaption|CircleHighlight|AttentionMarks)/;
const fail = (message) => { throw new Error(message); };
const unwrap = (node) => {
  while (node && (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isSatisfiesExpression(node))) node = node.expression;
  return node;
};
const literal = (input) => {
  const node = unwrap(input);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((p) => {
    assert(ts.isPropertyAssignment(p), "Expected literal property assignment");
    return [p.name.getText().replace(/^["']|["']$/g, ""), literal(p.initializer)];
  }));
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  return fail(`Unsupported static value: ${node.getText().slice(0, 100)}`);
};
const declaration = (ast, name) => {
  let result;
  ast.forEachChild((statement) => {
    if (ts.isVariableStatement(statement)) for (const d of statement.declarationList.declarations) {
      if (d.name.getText(ast) === name) result = unwrap(d.initializer);
    }
  });
  return result;
};
const parseSource = async (filename) => {
  const source = await readFile(filename, "utf8");
  return { source, ast: ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) };
};
const unique = (values, label) => assert.equal(new Set(values.map((v) => v.toLowerCase())).size, values.length, `Duplicate ${label}`);
const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
export const encodeCsv = (rows) => header.join(",") + "\r\n" + rows.map((a) =>
  [a.filename, a.title, a.keywords.join(", "), a.category, ""].map(csvCell).join(",") + "\r\n").join("");

// Strict reader also verifies generated CSV round-trips with commas and quotes.
export const decodeCsv = (text) => {
  const rows = []; let row = [], cell = "", quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"') {
      assert(!cell && !closed, "Unexpected CSV quote"); quoted = true;
    } else if (c === "," || c === "\n" || c === "\r") {
      row.push(cell); cell = ""; closed = false;
      if (c !== ",") {
        rows.push(row); row = [];
        if (c === "\r" && text[i + 1] === "\n") i++;
      }
    } else {
      assert(!closed, "Unexpected text after CSV quote"); cell += c;
    }
  }
  assert(!quoted, "Unterminated CSV quote");
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
};

export async function loadCatalog() {
  const metadata = JSON.parse(await readFile(path.join(metadataDir, "assets.json"), "utf8"));
  assert.equal(metadata.schemaVersion, 1);
  assert.equal(metadata.language, "en");
  const assets = metadata.assets;
  unique(assets.map((a) => a.id), "metadata ID");
  unique(assets.map((a) => a.filename), "metadata filename");
  unique(assets.map((a) => a.title), "title");
  const { ast: registry } = await parseSource(path.join(root, "src/compositions/registry.tsx"));
  const imports = new Map();
  for (const statement of registry.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings || !ts.isNamedImports(statement.importClause.namedBindings)) continue;
    for (const element of statement.importClause.namedBindings.elements) {
      imports.set(element.name.text, { source: statement.moduleSpecifier.text, exported: (element.propertyName ?? element.name).text });
    }
  }
  const entries = declaration(registry, "assetRegistry");
  assert(entries && ts.isArrayLiteralExpression(entries), "Registry must remain an explicit array for discovery");
  const discovered = [];
  for (const entry of entries.elements) {
    assert(ts.isObjectLiteralExpression(entry));
    const idNode = entry.properties.find((p) => p.name?.getText(registry) === "id");
    const id = literal(idNode.initializer);
    let configName, componentName, defaultProps;
    const visit = (node) => {
      if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(registry) === "Composition") {
        for (const attribute of node.attributes.properties) {
          if (ts.isJsxSpreadAttribute(attribute)) {
            assert(!configName, `Multiple config spreads: ${id}`);
            configName = attribute.expression.getText(registry);
          } else if (attribute.name.getText(registry) === "component") componentName = attribute.initializer.expression.getText(registry);
          else if (attribute.name.getText(registry) === "defaultProps") defaultProps = literal(attribute.initializer.expression);
          else fail(`Review new Composition override for ${id}: ${attribute.getText(registry)}`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(entry);
    const row = assets.find((a) => a.id === id);
    if (!scopePattern.test(id)) {
      assert(!row, `Out-of-scope metadata row: ${id}`);
      discovered.push({ id, filename: `${id}.mp4` });
      continue;
    }
    assert(row, `Missing in-scope metadata: ${id}`);
    assert.deepEqual(defaultProps, {}, `Review overridden defaults for ${id}`);
    assert.equal(imports.get(componentName)?.source, imports.get(configName)?.source, `Component/config source mismatch: ${id}`);
    const sourcePath = path.posix.normalize(`src/compositions/${imports.get(configName).source}.tsx`);
    const { source, ast } = await parseSource(path.join(root, sourcePath));
    const config = literal(declaration(ast, imports.get(configName).exported));
    assert.equal(config.id, id, `Config ID mismatch: ${id}`);
    assert.deepEqual([config.width, config.height, config.fps], [3840, 2160, 30], `Review changed output settings: ${id}`);
    const component = declaration(ast, imports.get(componentName).exported);
    assert(component && ts.isArrowFunction(component));
    const binding = component.parameters[0]?.name;
    assert(binding && ts.isObjectBindingPattern(binding));
    const defaults = Object.fromEntries(binding.elements.filter((e) => e.initializer).map((e) => [e.name.getText(ast), literal(e.initializer)]));
    assert.equal(defaults.background, "black", `Review background change: ${id}`);
    const segmentsNode = declaration(ast, `${id}Segments`);
    const segments = segmentsNode ? literal(segmentsNode) : [];
    const variationCount = segments.length || 1;
    if (segments.length) {
      assert.equal(segments.length, 5, `Review pack design count: ${id}`);
      assert.equal(segments[0].startSeconds, 0);
      segments.forEach((segment, i) => {
        assert(segment.endSeconds > segment.startSeconds);
        if (i) assert.equal(segment.startSeconds, segments[i - 1].endSeconds);
      });
      assert.equal(segments.at(-1).endSeconds, config.durationInFrames / config.fps);
      assert(/^Five /.test(row.title), `Describe five-design pack: ${id}`);
    }
    assert(families.includes(row.family), `Unknown family: ${id}`);
    assert.equal(row.category, 8, `Expected Graphic Resources category 8: ${id}`);
    assert(row.filename.length <= 30 && /^[A-Za-z0-9_-]+\.mp4$/.test(row.filename), `Invalid Adobe filename: ${id}`);
    assert(row.title.length <= 70 && /^[A-Za-z0-9 ]+$/.test(row.title), `Title exceeds CSV rules: ${id}`);
    assert(row.keywords.length >= 5 && row.keywords.length <= 49, `Keyword count: ${id}`);
    unique(row.keywords, `keywords for ${id}`);
    row.keywords.forEach((keyword) => assert(keyword.trim() === keyword && /^[a-z0-9]+(?:[ -][a-z0-9]+)*$/.test(keyword), `Invalid keyword: ${keyword}`));
    assert(row.keywords.slice(0, 10).includes("black background"), `Background must be explicit in top ten: ${id}`);
    const claims = `${row.title} ${row.keywords.join(" ")}`.toLowerCase();
    assert(!/transparent|alpha|green screen|chroma|seamless|\bloop\b|editable|template|mogrt|vector|source code|remotion|adobe|4k|best seller|premium|amazing/.test(claims), `Unsupported delivery claim: ${id}`);
    assert(row.visual && row.animation, `Missing review facts: ${id}`);
    discovered.push({
      id, filename: row.filename, source: sourcePath, family: row.family,
      visual: row.visual, animation: row.animation, variationCount, segments,
      sourceDefaults: defaults,
      background: "solid black (#000000)", alphaChannel: false,
      width: config.width, height: config.height, fps: config.fps,
      durationInFrames: config.durationInFrames, durationSeconds: config.durationInFrames / config.fps,
      output: `release/videos/${row.filename}`, codec: "h264", pixelFormat: "yuv420p",
      loopClaim: "none; endpoints and motion continuity are not certified as seamless",
      sourceSha256: createHash("sha256").update(source.replaceAll("\r\n", "\n")).digest("hex"),
    });
  }
  unique(discovered.map((a) => a.id), "registry ID");
  unique(discovered.map((a) => a.filename), "render filename");
  assert.deepEqual(assets.map((a) => a.id).sort(), discovered.filter((a) => a.family).map((a) => a.id).sort(), "Orphan metadata or missing registry entries");
  const csv = encodeCsv(assets);
  assert.deepEqual(decodeCsv(csv), [header, ...assets.map((a) => [a.filename, a.title, a.keywords.join(", "), String(a.category), ""])]);
  assert(Buffer.byteLength(csv) < 1_000_000 && assets.length <= 5000, "CSV import size exceeded");
  return { assets, discovered, csv };
}

const inventoryText = (discovered) => JSON.stringify({
  schemaVersion: 1,
  scope: families,
  note: "Generated from registry, literal source configs, default props, segment arrays and reviewed visual/animation facts in assets.json. Props list alternatives; only black H.264 output is described by import metadata. No concept document exists in this working tree.",
  assets: discovered.filter((a) => a.family),
}, null, 2) + "\n";

async function main() {
  const command = process.argv[2] ?? "check";
  const { assets, discovered, csv } = await loadCatalog();
  const csvPath = path.join(metadataDir, "adobe_stock_metadata.csv");
  const inventoryPath = path.join(metadataDir, "inventory.json");
  if (command === "generate") {
    await writeFile(csvPath, csv);
    await writeFile(inventoryPath, inventoryText(discovered));
  } else {
    assert.equal(await readFile(csvPath, "utf8"), csv, "CSV is stale; run npm run metadata:generate");
    assert.equal(await readFile(inventoryPath, "utf8"), inventoryText(discovered), "Inventory/source facts are stale; review source changes and run npm run metadata:generate");
  }
  if (command === "manifest") {
    const selected = (process.env.SELECTED_COMPOSITION ?? "").trim();
    assert(!selected || discovered.some((a) => a.id === selected), `Unknown composition: ${selected}`);
    const renders = selected ? discovered.filter((a) => a.id === selected) : discovered;
    const rows = assets.filter((a) => renders.some((r) => r.id === a.id));
    const releaseDir = path.join(root, "release");
    await mkdir(path.join(releaseDir, "metadata"), { recursive: true });
    await writeFile(path.join(root, "render-list.tsv"), renders.map((a) => `${a.id}\t${a.filename}\n`).join(""));
    await writeFile(path.join(releaseDir, "metadata/adobe_stock_metadata.csv"), encodeCsv(rows));
    if (process.env.GITHUB_OUTPUT) {
      await writeFile(process.env.GITHUB_OUTPUT, `has_compositions=${renders.length > 0}\n`, { flag: "a" });
    }
    console.log(`Manifest: ${renders.length} render(s), ${rows.length} scoped CSV row(s).`);
  } else if (command === "verify-rendered") {
    const lines = (await readFile(path.join(root, "render-list.tsv"), "utf8")).trim().split("\n").filter(Boolean);
    const expected = lines.map((line) => line.split("\t")[1]);
    const actual = (await readdir(path.join(root, "release/videos"))).filter((f) => f.endsWith(".mp4"));
    assert.deepEqual(actual.sort(), expected.sort(), "Rendered files do not exactly match manifest");
    for (const file of actual) assert((await stat(path.join(root, "release/videos", file))).size > 0, `Empty render: ${file}`);
    const selectedRows = assets.filter((a) => expected.includes(a.filename));
    const releaseCsv = await readFile(path.join(root, "release/metadata/adobe_stock_metadata.csv"), "utf8");
    assert.equal(releaseCsv, encodeCsv(selectedRows), "Release CSV does not match rendered subset");
    assert.deepEqual(decodeCsv(releaseCsv).slice(1).map((r) => r[0]).sort(), selectedRows.map((a) => a.filename).sort());
  } else assert(["generate", "check"].includes(command), `Unknown command: ${command}`);
  console.log(`Validated ${assets.length} metadata rows across ${families.length} families; category 8; CSV round-trip and source mapping passed.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
