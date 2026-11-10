import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { resolveAuthDual } from "@/lib/api/auth-dual";
import { fail, ok } from "@/lib/api/wrappers";
import { ARCHIVED_AT, queryTolerantToMissingArchived } from "@/lib/channels/archived";
import { CHANNEL_PROVIDER_WAHA } from "@/lib/channels/capabilities";
import { canalDesativado } from "@/lib/channels/desativado";
import { getWahaClient } from "@/lib/waha/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID();
  const auth = await resolveAuthDual(req, {
    requestId, resource: "channel_sessions", role: "agent", scope: "mcp:write",
  });
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return fail("not_found", "Canal não encontrado.", 404, { requestId });
  }

  const channel = () => auth.supabase.from("channel_sessions")
    .select("waha_session_name,metadata")
    .eq("id", id)
    .eq("organization_id", auth.organizationId)
    .eq("provider", CHANNEL_PROVIDER_WAHA);
  const { data, error } = await queryTolerantToMissingArchived(
    () => channel().is(ARCHIVED_AT, null).maybeSingle(),
    () => channel().maybeSingle(),
  );
  if (error) return fail("connection_status_failed", "Não foi possível verificar o canal.", 502, { requestId });
  if (!data) return fail("not_found", "Canal não encontrado.", 404, { requestId });
  if (canalDesativado(data.metadata)) return ok({ status: "paused" }, { requestId });

  const waha = getWahaClient();
  if (!waha || !data.waha_session_name) return fail("connection_status_failed", "Canal sem transporte disponível.", 503, { requestId });
  try {
    const session = await waha.getVerifiedSession(data.waha_session_name);
    return ok({ status: session?.status === "WORKING" ? "connected" : "disconnected" }, { requestId });
  } catch {
    return fail("connection_status_failed", "Não foi possível consultar o WhatsApp.", 502, { requestId });
  }
}
