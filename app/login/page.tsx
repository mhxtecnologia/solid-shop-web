'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="max-w-sm mx-auto my-12 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-1">Entrar</h1>
      <p className="text-sm text-gray-600 mb-6">
        Conta de demonstração: <strong>demo@solidshop.dev</strong> / <strong>demo12345</strong>
      </p>

      <form action={formAction} className="space-y-4" noValidate>
        <label className="block">
          <span className="text-sm font-medium">E-mail</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full px-3 py-2 border-2 border-gray-200 rounded-md outline-none focus:border-gray-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Senha</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full px-3 py-2 border-2 border-gray-200 rounded-md outline-none focus:border-gray-500"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 text-white rounded-md btn-primary cursor-pointer disabled:opacity-60"
        >
          {pending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
