import { test } from "node:test";
import assert from "node:assert/strict";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createApi } from "../server/api.mjs";
import { service } from "../server/service.mjs";
test("native oRPC client uses the real Fetch adapter and validates input", async () => {
  const api = createApi({});
  const link = new RPCLink({
    url: "https://ima.test/api/rpc",
    fetch: (input, init) => api(new Request(input, init)),
  });
  const rpc = createORPCClient(link);
  const r = await rpc.match(service.meta.default_input);
  assert.equal(r.found, true);
  assert.equal(r.matches.length, 4);
  await assert.rejects(() =>
    rpc.match({ ...service.meta.default_input, count: 99 }),
  );
});
