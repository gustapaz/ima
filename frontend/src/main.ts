import { render } from "inferno";
import { createElement as h } from "inferno-create-element";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { model } from "./model";
import { motionToggle } from "./client";
const rpc: any = createORPCClient(
  new RPCLink({ url: location.origin + "/api/rpc" }),
);
let alive = false;
const a = model(
  "ima",
  () => {
    if (alive) view();
  },
  (r) => {
    matchResult = r;
    begin = performance.now();
  },
);
const d = a.d;
const restCompute = a.api.compute;
a.api.compute = async (input: unknown) => {
  try {
    return await rpc.match(input);
  } catch (e: any) {
    throw new Error(e.message || "O cálculo não respondeu. Tente novamente.");
  }
};
let matchResult: any,
  begin = performance.now(),
  paused = false;
const root = document.querySelector("#app-root")!;
const btn = (text: string, fn: () => void, disabled = false, cls = "") =>
  h(
    "button",
    { onClick: fn, disabled: disabled || d.busy, className: cls },
    text,
  );
const label = (text: string, node: any) =>
  h("label", null, h("span", null, text), node);
const change = (key: string) => (e: Event) =>
  a.change(key, (e.target as HTMLSelectElement).value);
const dimensions: any = {
  design: "Design",
  code: "Código",
  motion: "Movimento",
  research: "Pesquisa",
};
function view() {
  render(
    h(
      "div",
      { className: "magnet-app" },
      d.catalog
        ? h(
            "div",
            { className: "parameters" },
            label(
              "Pares na composição",
              h(
                "select",
                {
                  "aria-label": "Quantidade de pares",
                  value: d.input.count,
                  onChange: (e: Event) =>
                    a.change("count", +(e.target as HTMLSelectElement).value),
                },
                ...[2, 3, 4, 5, 6].map((n) =>
                  h("option", { value: n }, String(n)),
                ),
              ),
            ),
            label(
              "Dar mais peso a",
              h(
                "select",
                {
                  "aria-label": "Foco da composição",
                  value: d.input.focus,
                  onChange: change("focus"),
                },
                ...Object.entries(dimensions).map(([id, text]) =>
                  h("option", { value: id }, text),
                ),
              ),
            ),
            label(
              "Critério",
              h(
                "select",
                {
                  "aria-label": "Critério de otimização",
                  value: d.input.fairness ? "fair" : "total",
                  onChange: (e: Event) =>
                    a.change(
                      "fairness",
                      (e.target as HTMLSelectElement).value === "fair",
                    ),
                },
                h("option", { value: "fair" }, "Proteger o menor par"),
                h("option", { value: "total" }, "Maior soma"),
              ),
            ),
            btn(
              d.busy ? "Combinando…" : "Compor os pares ↗",
              a.run,
              false,
              "compose",
            ),
          )
        : btn("Tentar carregar perfis", a.init),
      h("p", { role: "status", className: "status" }, d.error || d.status),
      d.catalog
        ? h(
            "div",
            { className: "presets" },
            ...d.catalog.presets.map((p: any) =>
              btn(p.name + " ↗", () => a.preset(p)),
            ),
          )
        : null,
      d.result
        ? h(
            "div",
            { className: "connections" },
            h(
              "div",
              { className: "scoreboard" },
              h("span", null, "COMPOSIÇÃO ENCONTRADA"),
              h(
                "strong",
                null,
                d.result.found ? String(d.result.total_score) : "∅",
              ),
              h(
                "p",
                null,
                d.result.found
                  ? "pontos no conjunto · menor par " + d.result.minimum_score
                  : d.result.reason,
              ),
              h(
                "small",
                null,
                d.result.assignments_examined + " composições examinadas",
              ),
            ),
            h(
              "ol",
              { className: "pairs" },
              ...d.result.matches.map((m: any, i: number) =>
                h(
                  "li",
                  { key: m.left.id, style: { "--i": String(i) } },
                  h(
                    "div",
                    { className: "profile" },
                    h("b", null, m.left.name),
                    h(
                      "small",
                      null,
                      m.left.skills
                        .map(
                          (x: number, j: number) =>
                            dimensions[d.catalog.dimensions[j]] + " " + x,
                        )
                        .join(" / "),
                    ),
                  ),
                  h(
                    "div",
                    { className: "bond" },
                    h("span", null, m.score),
                    h("i", null),
                  ),
                  h(
                    "div",
                    { className: "profile right" },
                    h("b", null, m.right.name),
                    h(
                      "small",
                      null,
                      m.right.skills
                        .map(
                          (x: number, j: number) =>
                            dimensions[d.catalog.dimensions[j]] + " " + x,
                        )
                        .join(" / "),
                    ),
                  ),
                ),
              ),
            ),
          )
        : null,
      d.catalog
        ? h(
            "details",
            { className: "restrictions" },
            h(
              "summary",
              null,
              "Afastar combinações · " +
                d.input.blocked.length +
                " bloqueio(s)",
            ),
            h(
              "p",
              null,
              "Cada botão alterna se o par pode se encontrar. Depois, componha novamente.",
            ),
            h(
              "div",
              {
                className: "block-matrix",
                style: { "--count": String(d.input.count) },
              },
              ...d.catalog.left.slice(0, d.input.count).flatMap((l: any) =>
                d.catalog.right.slice(0, d.input.count).map((r: any) => {
                  const id = l.id + ":" + r.id,
                    on = d.input.blocked.includes(id);
                  return h(
                    "button",
                    {
                      "aria-pressed": String(on),
                      onClick: () =>
                        a.change(
                          "blocked",
                          on
                            ? d.input.blocked.filter((x: string) => x !== id)
                            : [...d.input.blocked, id],
                        ),
                      className: on ? "blocked" : "",
                    },
                    l.name + " × " + r.name + (on ? " −" : " +"),
                  );
                }),
              ),
            ),
          )
        : null,
      h(
        "section",
        { className: "save-field" },
        h(
          "div",
          null,
          h("span", null, "FIXE UMA BOA COMPOSIÇÃO"),
          label(
            "Nome da composição",
            h("input", {
              "aria-label": "Nome da composição",
              value: d.title,
              maxLength: 48,
              onInput: (e: Event) =>
                a.title((e.target as HTMLInputElement).value),
            }),
          ),
          btn(
            d.current && d.owns
              ? "Salvar alterações ↗"
              : "Guardar composição ↗",
            a.save,
            !d.result,
          ),
          h(
            "small",
            null,
            "Dados sintéticos. Registros por 7 dias; acesso de edição nesta aba. Exportação da revisão salva.",
          ),
        ),
        h(
          "div",
          { className: "save-tools" },
          d.current
            ? h(
                "div",
                null,
                btn("Reler do banco", () => a.open(d.current.id)),
                btn("Exportar CSV ↓", a.download),
                d.owns
                  ? btn(
                      d.current.published ? "Encerrar link" : "Criar link",
                      a.share,
                    )
                  : null,
                btn("Nova composição", a.fresh),
              )
            : null,
          d.link
            ? h(
                "a",
                { href: d.link, target: "_blank", rel: "noreferrer" },
                "Abrir composição compartilhada ↗",
              )
            : null,
          h(
            "details",
            null,
            h("summary", null, "Arquivo desta aba (" + d.archive.length + ")"),
            ...d.archive.map((x: any) =>
              btn(x.title + " ↗", () => a.open(x.id)),
            ),
          ),
        ),
      ),
    ),
    root,
  );
}
root.replaceChildren();
alive = true;
view();
a.init();
const canvas = document.querySelector<HTMLCanvasElement>("#field")!,
  ctx = canvas.getContext("2d")!;
let w = 0,
  hg = 0,
  visible = true;
new ResizeObserver(() => {
  w = canvas.clientWidth;
  hg = canvas.clientHeight;
  const dpr = Math.min(1.5, devicePixelRatio);
  canvas.width = w * dpr;
  canvas.height = hg * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw(performance.now());
}).observe(canvas);
new IntersectionObserver((es) => {
  visible = es[0].isIntersecting;
}).observe(canvas);
function draw(t: number) {
  if (!ctx || !w) return;
  ctx.clearRect(0, 0, w, hg);
  const k = paused ? 0 : t * 0.0002;
  for (let i = 0; i < 100; i++) {
    const x = (((i % 10) + 0.5) * w) / 10,
      y = ((Math.floor(i / 10) + 0.5) * hg) / 10,
      dx = x - w * 0.7,
      dy = y - hg * 0.55,
      angle =
        Math.atan2(dy, dx) + Math.sin(k + Math.hypot(dx, dy) * 0.004) * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = "#20201b28";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.stroke();
    ctx.restore();
  }
}
function tick(t: number) {
  if (!paused && visible && !document.hidden) draw(t);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
motionToggle((v) => {
  paused = v;
  draw(0);
});
if (new URL(location.href).searchParams.has("record"))
  document.querySelector("#lab")?.scrollIntoView();
