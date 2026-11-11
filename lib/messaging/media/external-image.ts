import { MAX_MEDIA_BYTES, MediaTooLargeError, type FetchedMedia } from "./types";
import { assertUrlDeMidiaSegura } from "./url-de-midia-externa";

const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

/** Reads public outbound artwork, never a provider's inbound media URL. */
export async function fetchExternalImage(url: string): Promise<FetchedMedia> {
  await assertUrlDeMidiaSegura(url);
  const response = await fetch(url, { redirect: "error", credentials: "omit", signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error("external_image_unavailable");
  const mime = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (!mime || !IMAGE_MIMES.has(mime)) {
    await response.body?.cancel();
    throw new Error("external_image_unsupported_type");
  }
  if (Number(response.headers.get("content-length")) > MAX_MEDIA_BYTES) {
    await response.body?.cancel();
    throw new MediaTooLargeError();
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error("external_image_empty");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_MEDIA_BYTES) {
        await reader.cancel();
        throw new MediaTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (!length) throw new Error("external_image_empty");
  return { buffer: Buffer.concat(chunks), mime };
}
