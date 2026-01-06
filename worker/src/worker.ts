import { canonicalize } from "../../common/canon";
import { MemoryPendingStore } from "./storage";
import { verifyAuthorSignature } from "./verify";

type Env = {
  LANE_DEFAULT: string;
  MAX_LIMIT: string;
  ACCEPTED_SET_URL: string;
  INDEX_MANIFEST_URL: string;
  // NONCE_KV?: KVNamespace;
  // PENDING_KV?: KVNamespace;
  // PENDING_R2?: R2Bucket;
};

function nowIso() { return new Date().toISOString(); }

function json(data: unknown, status = 200, headers: Record<string,string> = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}

function jsonHeadOrGet(req: Request, data: unknown, status = 200, headers: Record<string,string> = {}) {
  const body = JSON.stringify(data, null, 2);
  return new Response(req.method === "HEAD" ? null : body, {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}

async function sha256HexAsync(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,"0")).join("");
}

function clampLimit(v: string | null, maxDefault: number) {
  const n = v ? Number(v) : maxDefault;
  if (!Number.isFinite(n) || n <= 0) return maxDefault;
  return Math.min(Math.floor(n), 100);
}

function getLane(u: URL, env: Env) {
  const lane = (u.searchParams.get("lane") || env.LANE_DEFAULT || "stable").toLowerCase();
  return (lane === "sandbox") ? "sandbox" : "stable";
}

function replayWindowOk(ts: string): boolean {
  const t = Date.parse(ts);
  if (!Number.isFinite(t)) return false;
  const now = Date.now();
  const diff = Math.abs(now - t);
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return diff <= sevenDays;
}

function openapiDoc(origin: string) {
  return {
    openapi: "3.0.3",
    info: {
      title: "ONETOO AI Search API",
      version: "2.0",
      description: "Thin, decade-stable AI search endpoint. Demo scaffold returns deterministic results and a proof bundle stub."
    },
    servers: [{ url: origin }],
    paths: {
      "/health": { get: { summary: "Health check", responses: { "200": { description: "OK" } } } },
      "/healthz": { get: { summary: "Health check (alias)", responses: { "200": { description: "OK" } } } },
      "/openapi.json": { get: { summary: "OpenAPI doc", responses: { "200": { description: "OpenAPI JSON" } } } },
      "/trust": { get: { summary: "Trust discovery (human-friendly)", responses: { "200": { description: "Trust discovery JSON" } } } },
      "/.well-known/ai-trust.json": { get: { summary: "Trust discovery (machine-readable)", responses: { "200": { description: "TFWS AI trust JSON" } } } },
      "/search/v1": {
        get: {
          summary: "Search (alias)",
          parameters: [
            { name: "q", in: "query", required: false, schema: { type: "string" } },
            { name: "lane", in: "query", required: false, schema: { type: "string", enum: ["stable", "sandbox"] } },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100 } }
          ],
          responses: { "200": { description: "Search results" } }
        }
      },
      "/search/v2": {
        get: {
          summary: "Search",
          parameters: [
            { name: "q", in: "query", required: false, schema: { type: "string" } },
            { name: "lane", in: "query", required: false, schema: { type: "string", enum: ["stable", "sandbox"] } },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100 } }
          ],
          responses: { "200": { description: "Search results" } }
        }
      },
      "/contrib/v2/submit": { post: { summary: "Submit contribution (pending)", responses: { "202": { description: "Accepted into pending store" } } } },
      "/contrib/v2/pending": { get: { summary: "List pending contributions (dev)", responses: { "200": { description: "Pending list" } } } },
      "/contrib/v2/accepted": { get: { summary: "Get accepted-set URL (out-of-band verification)", responses: { "200": { description: "Accepted-set pointer" } } } }
    }
  };
}

const pendingStore = new MemoryPendingStore();

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const u = new URL(req.url);

    const corsCache = {
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300"
    };

    if (u.pathname === "/openapi.json" && (req.method === "GET" || req.method === "HEAD")) {
      return jsonHeadOrGet(req, openapiDoc(u.origin), 200, corsCache);
    }

    if ((u.pathname === "/health" || u.pathname === "/healthz") && (req.method === "GET" || req.method === "HEAD")) {
      return jsonHeadOrGet(req, { ok: true, service: "onetoo-ai-search-v2", time: nowIso() }, 200, corsCache);
    }

    if (u.pathname === "/trust" && (req.method === "GET" || req.method === "HEAD")) {
      return jsonHeadOrGet(req, {
        ok: true,
        service: "onetoo-ai-search-v2",
        trust_root: "https://www.onetoo.eu/.well-known/minisign.pub",
        key_history: "https://www.onetoo.eu/.well-known/key-history.json",
        dumps_sha256: "https://www.onetoo.eu/dumps/sha256.json",
        dumps_release: "https://www.onetoo.eu/dumps/release.json",
        active_kid_hint: "BEAF18316BE2FC65",
        accepted_set_url: env.ACCEPTED_SET_URL,
        accepted_set_sig_url: env.ACCEPTED_SET_URL + ".minisig"
      }, 200, corsCache);
    }

    if (u.pathname === "/.well-known/ai-trust.json" && (req.method === "GET" || req.method === "HEAD")) {
      return jsonHeadOrGet(req, {
        schema: "tfws-ai-trust/v1",
        updated_at: nowIso(),
        service: "onetoo-ai-search-v2",
        trust_root: "https://www.onetoo.eu/.well-known/minisign.pub",
        key_history: "https://www.onetoo.eu/.well-known/key-history.json",
        dumps: {
          sha256: "https://www.onetoo.eu/dumps/sha256.json",
          release: "https://www.onetoo.eu/dumps/release.json"
        },
        accepted_set: {
          url: env.ACCEPTED_SET_URL,
          sig_url: env.ACCEPTED_SET_URL + ".minisig"
        },
        active_kid_hint: "BEAF18316BE2FC65"
      }, 200, corsCache);
    }

    if ((u.pathname === "/search/v1" || u.pathname === "/search/v2") && (req.method === "GET" || req.method === "HEAD")) {
      const q = (u.searchParams.get("q") || "").trim();
      const lane = getLane(u, env);
      const limit = clampLimit(u.searchParams.get("limit"), Number(env.MAX_LIMIT || 20));
      const t = nowIso();

      const results = q ? [{
        url: "https://onetoo.eu/",
        title: "onetoo.eu — Trust-First AI Hub",
        snippet: "Signed, archival-grade trust artifacts (TFWS v2).",
        score: 1.0,
        trust_state: {
          version: "2.0",
          generated_at: t,
          subject: "https://onetoo.eu/",
          state: "partial",
          signals: ["tfws-v2", "artifact-first", "proof-bundle"],
          notes: "Demo trust state (wire to real verification pipeline)."
        }
      }] : [];

      return jsonHeadOrGet(req, {
        version: "2.0",
        query: q,
        lane,
        results: results.slice(0, limit),
        proof: {
          version: "2.0",
          generated_at: t,
          accepted_set: {
            url: env.ACCEPTED_SET_URL,
            sha256: "TODO",
            sig_url: env.ACCEPTED_SET_URL + ".minisig"
          },
          verified_sources: [
            { base_url: "https://onetoo.eu/", status: "partial", checks: ["demo-mode"] }
          ],
          checks: ["proof-bundle-v2"]
        }
      }, 200, corsCache);
    }

    if (u.pathname === "/contrib/v2/submit" && req.method === "POST") {
      let body: any;
      try { body = await req.json(); }
      catch { return json({ ok: false, error: "invalid_json" }, 400); }

      if (!body?.timestamp || !replayWindowOk(String(body.timestamp))) {
        return json({ ok: false, error: "replay_window_failed" }, 400);
      }

      const sig = await verifyAuthorSignature(body);
      if (!sig.ok) return json({ ok: false, error: "signature_failed", reason: sig.reason }, 400);

      const canon = canonicalize(body);
      const id = await sha256HexAsync(canon);

      if (await pendingStore.has(id)) {
        return json({ ok: false, error: "duplicate", id }, 409);
      }

      await pendingStore.put(id, body);
      return json({ ok: true, id, stored: "pending", note: "Stable lane unchanged until maintainer publishes signed accepted-set." }, 202, {
        "access-control-allow-origin": "*"
      });
    }

    if (u.pathname === "/contrib/v2/pending" && (req.method === "GET" || req.method === "HEAD")) {
      const limit = clampLimit(u.searchParams.get("limit"), 50);
      const list = await pendingStore.list(limit);
      return jsonHeadOrGet(req, { ok: true, count: list.length, items: list }, 200, {
        "access-control-allow-origin": "*"
      });
    }

    if (u.pathname === "/contrib/v2/pending/" && (req.method === "GET" || req.method === "HEAD")) {
      return jsonHeadOrGet(req, { ok: false, error: "use /contrib/v2/pending?id=..." }, 400, {
        "access-control-allow-origin": "*"
      });
    }

    if (u.pathname === "/contrib/v2/accepted" && (req.method === "GET" || req.method === "HEAD")) {
      return jsonHeadOrGet(req, {
        ok: true,
        accepted_set_url: env.ACCEPTED_SET_URL,
        note: "Fetch this artifact from the trust hub and verify signature out-of-band."
      }, 200, {
        "access-control-allow-origin": "*"
      });
    }

    return json({ ok: false, error: "not_found" }, 404);
  }
};
