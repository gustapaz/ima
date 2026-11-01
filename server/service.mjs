import { z } from "zod";
import { fail } from "./errors.mjs";
export const schema = z
  .object({
    count: z.number().int().min(2).max(6),
    focus: z.enum(["design", "code", "motion", "research"]),
    fairness: z.boolean(),
    blocked: z.array(z.string().regex(/^l[1-6]:r[1-6]$/)).max(36),
  })
  .strict();
export const left = [
  ["Lia", [9, 3, 7, 4]],
  ["Nilo", [5, 9, 4, 6]],
  ["Cora", [8, 5, 9, 3]],
  ["Teo", [4, 8, 3, 9]],
  ["Iara", [7, 6, 8, 5]],
  ["Bento", [6, 7, 5, 8]],
].map(([name, skills], i) => ({ id: "l" + (i + 1), name, skills }));
export const right = [
  ["Azul", [3, 9, 5, 8]],
  ["Íris", [9, 4, 7, 5]],
  ["Sol", [5, 7, 9, 4]],
  ["Noa", [8, 6, 4, 9]],
  ["Lume", [6, 8, 6, 7]],
  ["Ari", [7, 5, 8, 6]],
].map(([name, skills], i) => ({ id: "r" + (i + 1), name, skills }));
export const meta = {
  slug: "ima",
  title: "ÍMÃ",
  engine: "orpc-zod-assignment",
  headline: "Ideias encontram sua outra metade.",
  left,
  right,
  dimensions: ["design", "code", "motion", "research"],
  default_input: { count: 4, focus: "motion", fairness: true, blocked: [] },
  presets: [
    {
      name: "Equilíbrio",
      input: { count: 4, focus: "motion", fairness: true, blocked: [] },
    },
    {
      name: "Código",
      input: { count: 6, focus: "code", fairness: false, blocked: [] },
    },
    {
      name: "Outra combinação",
      input: {
        count: 3,
        focus: "design",
        fairness: true,
        blocked: ["l1:r1", "l2:r2"],
      },
    },
  ],
  note: "Universo de perfis e pontuações inteiramente sintéticos. Exercício de otimização, não avaliação de pessoas reais, contratação ou recomendação profissional.",
};
export function validate(input) {
  const r = schema.safeParse(input);
  if (!r.success || new Set(input.blocked).size !== input.blocked.length)
    fail("invalid_input", "Confira quantidade, foco e pares bloqueados.");
  return r.data;
}
export function score(a, b, focus) {
  const k = meta.dimensions.indexOf(focus),
    coverage = a.skills.map((x, i) => Math.min(10, Math.max(x, b.skills[i]))),
    balance =
      40 - a.skills.reduce((s, x, i) => s + Math.abs(x - b.skills[i]), 0);
  return Math.round(
    ((coverage.reduce((s, x) => s + x, 0) + coverage[k] * 2 + balance / 2) /
      80) *
      100,
  );
}
export function compute(raw) {
  const p = validate(raw),
    ls = left.slice(0, p.count),
    rs = right.slice(0, p.count);
  let best;
  let examined = 0;
  function visit(i, used, pairs, total, minimum) {
    if (i === p.count) {
      examined++;
      const candidate = {
        pairs,
        total,
        minimum,
        key: pairs.map((x) => x.right.id).join(),
      };
      if (
        !best ||
        (p.fairness
          ? minimum > best.minimum ||
            (minimum === best.minimum && total > best.total)
          : total > best.total) ||
        (minimum === best.minimum &&
          total === best.total &&
          candidate.key < best.key)
      )
        best = candidate;
      return;
    }
    for (let j = 0; j < p.count; j++) {
      if (used.has(j) || p.blocked.includes(ls[i].id + ":" + rs[j].id))
        continue;
      const value = score(ls[i], rs[j], p.focus);
      visit(
        i + 1,
        new Set([...used, j]),
        [
          ...pairs,
          {
            left: ls[i],
            right: rs[j],
            score: value,
            reason:
              "Cobertura de " +
              p.focus +
              " e complementaridade nas quatro dimensões.",
          },
        ],
        total + value,
        Math.min(minimum, value),
      );
    }
  }
  visit(0, new Set(), [], 0, Infinity);
  return best
    ? {
        found: true,
        matches: best.pairs,
        total_score: best.total,
        minimum_score: best.minimum,
        assignments_examined: examined,
        objective: p.fairness ? "max-min then total" : "total then stable key",
      }
    : {
        found: false,
        matches: [],
        assignments_examined: 0,
        reason: "Os bloqueios impedem uma composição completa.",
      };
}
export function exportResult(input) {
  const r = compute(input);
  return {
    type: "text/csv; charset=utf-8",
    extension: "csv",
    text:
      "perfil_a,perfil_b,pontos\n" +
      r.matches
        .map((m) => [m.left.name, m.right.name, m.score].join(","))
        .join("\n") +
      "\n",
  };
}
export const service = { meta, validate, compute, export: exportResult };
