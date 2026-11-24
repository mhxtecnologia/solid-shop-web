'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { apiFetch } from '@/lib/server/api';
import { clearAccessToken, setAccessToken } from '@/lib/server/session';

export interface LoginState {
  error?: string;
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.').max(128),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });
  if (res.status === 401) return { error: 'E-mail ou senha inválidos.' };
  if (res.status === 429) return { error: 'Muitas tentativas. Aguarde um minuto.' };
  if (!res.ok) return { error: 'Não foi possível entrar agora. Tente novamente.' };

  const { access_token } = (await res.json()) as { access_token: string };
  await setAccessToken(access_token);
  redirect('/');
}

export async function logout(): Promise<void> {
  await clearAccessToken();
  redirect('/');
}
