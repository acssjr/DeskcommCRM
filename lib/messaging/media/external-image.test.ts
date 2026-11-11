import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_MEDIA_BYTES } from "./types";
import { fetchExternalImage } from "./external-image";
import { assertUrlDeMidiaSegura } from "./url-de-midia-externa";

vi.mock("./url-de-midia-externa", () => ({ assertUrlDeMidiaSegura: vi.fn() }));

const url = "https://studio.example/images/confirmation.jpg";
const transport = vi.fn();
beforeEach(() => {
  vi.mocked(assertUrlDeMidiaSegura).mockReset().mockResolvedValue(undefined);
  transport.mockReset();
  vi.stubGlobal("fetch", transport);
});
afterEach(() => vi.unstubAllGlobals());

describe("imagem externa enviada pela integração", () => {
  it("preserva a URL original, valida antes do transporte e não envia credenciais", async () => {
    transport.mockResolvedValue(new Response(new Uint8Array([255, 216, 255]), { headers: { "content-type": "image/jpeg" } }));
    const result = await fetchExternalImage(url);
    expect(assertUrlDeMidiaSegura).toHaveBeenCalledWith(url);
    expect(transport).toHaveBeenCalledWith(url, { redirect: "error", credentials: "omit", signal: expect.any(AbortSignal) });
    expect(assertUrlDeMidiaSegura).toHaveBeenCalledBefore(transport);
    expect(result.mime).toBe("image/jpeg");
    expect(result.buffer).toEqual(Buffer.from([255, 216, 255]));
  });

  it("não faz requisição quando a guarda recusa o destino", async () => {
    vi.mocked(assertUrlDeMidiaSegura).mockRejectedValue(new Error("unsafe_url:private_ip"));
    await expect(fetchExternalImage("https://127.0.0.1/private")).rejects.toThrow("unsafe_url");
    expect(transport).not.toHaveBeenCalled();
  });

  it("não segue redirecionamentos e propaga falhas do transporte", async () => {
    transport.mockRejectedValue(new TypeError("redirect forbidden"));
    await expect(fetchExternalImage(url)).rejects.toThrow("redirect forbidden");
    expect(transport).toHaveBeenCalledWith(url, expect.objectContaining({ redirect: "error" }));
  });

  it.each(["text/html", "image/svg+xml", "application/json"])("recusa conteúdo ativo ou inesperado: %s", async (mime) => {
    transport.mockResolvedValue(new Response("conteúdo inesperado", { headers: { "content-type": mime } }));
    await expect(fetchExternalImage(url)).rejects.toThrow("unsupported_type");
  });

  it("recusa tamanho declarado acima do limite antes de ler os bytes", async () => {
    transport.mockResolvedValue(new Response("x", { headers: { "content-type": "image/jpeg", "content-length": String(MAX_MEDIA_BYTES + 1) } }));
    await expect(fetchExternalImage(url)).rejects.toThrow("media exceeds");
  });

  it("limita o fluxo mesmo quando o servidor omite o tamanho", async () => {
    const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_MEDIA_BYTES)); controller.enqueue(new Uint8Array([1])); controller.close(); } });
    transport.mockResolvedValue(new Response(body, { headers: { "content-type": "image/jpeg" } }));
    await expect(fetchExternalImage(url)).rejects.toThrow("media exceeds");
  });
});
