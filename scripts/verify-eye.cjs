const fs = require("fs");
const ts = require("typescript");
const assert = require("node:assert/strict");
const source = fs.readFileSync(
  "src/compositions/watchful-eye/animation.ts",
  "utf8",
);
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const mod = { exports: {} };
new Function("exports", "module", code)(mod.exports, mod);
const a = mod.exports;
const state = (f) => {
  const t = a.loopTime(f, 30);
  return {
    gaze: a.gazeAt(t),
    pupil: a.pupilAt(t),
    lids: a.lidsAt(t),
    aperture: a.apertureAt(t),
    skin: a.skinPoint(0.4, 120, true, t),
  };
};
assert.deepEqual(state(360), state(0));
assert.equal(a.blinkAt(103 / 30), 1);
assert.equal(a.blinkAt(104 / 30), 1);
for (let i = 0; i <= 100; i++)
  assert.ok(
    Math.abs(
      a.lidPoint(i / 100, true, 103 / 30).y -
        a.lidPoint(i / 100, false, 103 / 30).y,
    ) < 1e-9,
  );
assert.deepEqual(a.gazeAt(104 / 30), {
  x: 3 * Math.sin(((3 * (104 / 30)) / 12) * Math.PI * 2),
  y: 2 * Math.sin(((2 * (104 / 30)) / 12) * Math.PI * 2),
});
for (let f = 0; f <= 360; f++) {
  const s = state(f);
  assert.ok(s.pupil >= 82.5 && s.pupil <= 102.5);
  assert.ok(Number.isFinite(s.gaze.x));
}
const eps = 0.0001,
  before = state(360 - eps),
  after = state(eps),
  zero = state(0);
for (const key of ["x", "y"])
  assert.ok(
    Math.abs(
      (zero.gaze[key] - before.gaze[key]) / eps -
        (after.gaze[key] - zero.gaze[key]) / eps,
    ) < 1e-4,
  );
console.log(
  "PASS: frame 0 = virtual 360; seam velocity; full blink seal; hidden gaze reset; pupil bounds.",
);
