import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker";

test("healthz returns ok", async () => {
  const req = new Request("http://local.test/healthz");
  const res = await worker.fetch(req, {
    LANE_DEFAULT: "stable",
    MAX_LIMIT: "20",
    ACCEPTED_SET_URL: "https://onetoo.eu/dumps/contrib-accepted.json",
    INDEX_MANIFEST_URL: "https://onetoo.eu/dumps/ai-search-index.json",
  } as any);
  assert.equal(res.status, 200);
  const j = await res.json();
  assert.equal(j.ok, true);
});
