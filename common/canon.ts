export function canonicalize(value: unknown): string {
  const seen = new WeakSet<object>();
  const norm = (v: any): any => {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v)) throw new Error("Circular structure not allowed");
    seen.add(v);
    if (Array.isArray(v)) return v.map(norm);
    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = norm(v[k]);
    return out;
  };
  return JSON.stringify(norm(value));
}
