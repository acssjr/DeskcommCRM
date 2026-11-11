import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { resolveAuthDual, tetoDeEscritaDoToken } from "@/lib/api/auth-dual";
import { fail, ok } from "@/lib/api/wrappers";
import { CHANNEL_SESSION_REF_COLUMNS, getAdapter, resolveSessionRef } from "@/lib/channels";
import { ARCHIVED_AT, queryTolerantToMissingArchived } from "@/lib/channels/archived";
import { canalDesativado } from "@/lib/channels/desativado";

const parametros = z.object({ id: z.guid() });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID();
  const caminho = parametros.safeParse(await params);
  if (!caminho.success) return fail("not_found", "Canal não encontrado.", 404, { requestId });

  const auth = await resolveAuthDual(req, {
    requestId, resource: "channel_sessions", role: "agent", scope: "mcp:write",
  });
  if (!auth.ok) return auth.response;
  const limite = await tetoDeEscritaDoToken(auth, "channel-session-status", requestId);
  if (limite) return limite;

  const channel = () => auth.supabase.from("channel_sessions")
    .select(`${CHANNEL_SESSION_REF_COLUMNS}, metadata`)
    .eq("id", caminho.data.id)
    .eq("organization_id", auth.organizationId);
  const { data, error } = await queryTolerantToMissingArchived(
    () => channel().is(ARCHIVED_AT, null).maybeSingle(),
    () => channel().maybeSingle(),
  );
  if (error) return fail("connection_status_failed", "Não foi possível verificar o canal.", 502, { requestId });
  if (!data) return fail("not_found", "Canal não encontrado.", 404, { requestId });
  if (canalDesativado(data.metadata)) return ok({ status: "paused" }, { requestId });

  try {
    const adapter = getAdapter(data.provider);
    const sessionRef = resolveSessionRef(data);
    if (!adapter.checkHealth || !sessionRef) {
      return fail("connection_status_failed", "Canal sem consulta de estado disponível.", 503, { requestId });
    }
    const saude = await adapter.checkHealth({ organizationId: auth.organizationId, sessionRef });
    if (saude.reachable && saude.status) {
      return ok({ status: saude.status === "WORKING" ? "connected" : "disconnected" }, { requestId });
    }
  } catch {
    return fail("connection_status_failed", "Não foi possível consultar o canal.", 502, { requestId });
  }
  return fail("connection_status_failed", "Não foi possível consultar o canal.", 502, { requestId });
}
