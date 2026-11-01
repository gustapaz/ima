import { os } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { service, schema } from "./service.mjs";
import { routeTable, simpleDispatch } from "./routes.mjs";
import { guarded, readJson } from "./transport.mjs";
import { fail } from "./errors.mjs";
export function createApi(db, clock) {
  const rpc = new RPCHandler({
    match: os.input(schema).handler(({ input }) => service.compute(input)),
  });
  const rest = simpleDispatch(routeTable(db, service, clock));
  return guarded(async (req) => {
    if (new URL(req.url).pathname.startsWith("/api/rpc/")) {
      if (req.method !== "POST") fail("method_not_allowed", "Use POST.", 405);
      const body = await readJson(req);
      const bounded = new Request(req.url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await rpc.handle(bounded, { prefix: "/api/rpc" });
      return result.response ?? new Response("Not found", { status: 404 });
    }
    return rest(req);
  });
}
