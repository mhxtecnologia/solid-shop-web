import 'server-only';
import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/server/api';
import { clearAccessToken, getAccessToken } from '@/lib/server/session';

/**
 * BFF (backend for frontend): o navegador chama /api/cart do próprio Next, e o Next repassa à
 * API com o token do cookie. O token nunca passa pelo JavaScript do cliente.
 */
export async function proxyCartRequest(path: string, init: RequestInit = {}) {
  if (!(await getAccessToken())) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const res = await apiFetch(path, { ...init, auth: true });
  // Token expirado ou inválido: apaga o cookie para o cabeçalho voltar a mostrar "Entrar".
  if (res.status === 401) await clearAccessToken();

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}
