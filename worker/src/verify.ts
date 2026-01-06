/**
 * Signature verification stub.
 *
 * Decade-stable approach:
 * - stable lane relies on artifacts signed by maintainers and published in trust hub
 * - submit endpoint verifies author signature (optional strict mode) before storing pending
 *
 * Wire-in options:
 * - minisign verification via an external verifier service OR offline pipeline
 * - sigstore verification
 *
 * NOTE: keep server verification minimal to reduce complexity.
 */
export async function verifyAuthorSignature(_contribution: any): Promise<{ok: boolean; reason?: string}> {
  // Placeholder: return ok=true for scaffold.
  return { ok: true };
}
