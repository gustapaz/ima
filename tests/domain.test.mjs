import { test } from "node:test";
import assert from "node:assert/strict";
import { service, left, right, score } from "../server/service.mjs";
test("two-profile optimum matches independent two-permutation oracle", () => {
  const p = { count: 2, focus: "code", fairness: false, blocked: [] },
    r = service.compute(p),
    direct =
      score(left[0], right[0], p.focus) + score(left[1], right[1], p.focus),
    cross =
      score(left[0], right[1], p.focus) + score(left[1], right[0], p.focus);
  assert.equal(r.total_score, Math.max(direct, cross));
});
test("complete assignment uses every selected participant once", () => {
  const r = service.compute({ ...service.meta.default_input, count: 6 });
  assert.equal(r.matches.length, 6);
  assert.equal(new Set(r.matches.map((m) => m.right.id)).size, 6);
  assert.equal(r.assignments_examined, 720);
});
test("blocking every possible partner produces genuine empty result", () => {
  assert.equal(
    service.compute({
      count: 2,
      focus: "motion",
      fairness: true,
      blocked: ["l1:r1", "l1:r2"],
    }).found,
    false,
  );
});
test("blocked pairs are never assigned", () => {
  const r = service.compute({
    ...service.meta.default_input,
    blocked: ["l1:r1", "l2:r2"],
  });
  assert.ok(
    r.matches.every(
      (m) => !["l1:r1", "l2:r2"].includes(m.left.id + ":" + m.right.id),
    ),
  );
});
test("scores bounded and deterministic", () => {
  const p = service.meta.default_input;
  assert.deepEqual(service.compute(p), service.compute(p));
  for (const a of left)
    for (const b of right)
      assert.ok(score(a, b, p.focus) >= 0 && score(a, b, p.focus) <= 100);
});
test("duplicates invalid count and unknown fields rejected", () => {
  for (const p of [
    { ...service.meta.default_input, count: 7 },
    { ...service.meta.default_input, blocked: ["l1:r1", "l1:r1"] },
    { ...service.meta.default_input, extra: 1 },
  ])
    assert.throws(() => service.compute(p));
});
