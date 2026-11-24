import 'server-only';
import { cookies } from 'next/headers';

/**
 * O JWT da API fica num cookie HttpOnly: o JavaScript do navegador não consegue lê-lo,
 * então um XSS não rouba a sessão. Só o servidor do Next anexa o token nas chamadas à API.
 */
export const SESSION_COOKIE = 'solid_shop_session';

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function setAccessToken(token: string): Promise<void> {
  const payload = decodePayload(token);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // O cookie expira junto com o token.
    ...(payload?.exp && { expires: new Date(payload.exp * 1000) }),
  });
}

export async function clearAccessToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * Lê o e-mail do token só para exibir no cabeçalho. Não valida a assinatura: quem decide se o
 * token vale é a API, a cada requisição.
 */
export async function getSessionEmail(): Promise<string | null> {
  const token = await getAccessToken();
  const payload = token ? decodePayload(token) : null;
  if (!payload?.email) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload.email;
}

function decodePayload(token: string): { email?: string; exp?: number } | null {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
