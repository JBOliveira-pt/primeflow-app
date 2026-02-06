'use client';

import { useActionState, Suspense } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, Github, Globe, Lock, Mail } from "lucide-react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

const LoginContent = ({ setView }: { setView: (v: "register") => void }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="w-full max-w-md">
      <Link
        href="https://primeflow-landing.vercel.app"
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para o início
      </Link>

      <form action={formAction} className="w-full">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className=" flex items-center justify-center mx-auto mb-4">
              <Image src="/images/primeflow-whiteroundlogo-nobg.png" width={70} height={50} alt="PrimeFlow Logo" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-slate-400 text-sm">
              Entre na sua conta corporativa Prime<span className="font-bold">Flow</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="nome@empresa.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Senha
                </label>
                <a href="#" className="text-xs text-indigo-400 hover:underline">
                  Esqueceu?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={callbackUrl} />

          <button
            type="submit"
            aria-disabled={isPending}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-lg disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>

          {errorMessage && (
            <div className="flex items-center gap-2 mt-4 text-red-500">
              <ExclamationCircleIcon className="h-5 w-5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Ou use redes sociais</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 py-3 rounded-xl text-sm font-medium transition-all text-white"
            >
              <Github size={18} /> GitHub
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 py-3 rounded-xl text-sm font-medium transition-all text-white"
            >
              <Globe size={18} /> Google
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Não tem conta?{" "}
            <button onClick={() => setView("register")} type="button" className="text-indigo-400 font-bold hover:underline">
              Registre-se gratuitamente
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

const LoginView = (props: { setView: (v: "register") => void }) => {
  return (
    <Suspense fallback={<div className="text-white text-center p-4">Carregando...</div>}>
      <LoginContent {...props} />
    </Suspense>
  );
};

export default LoginView;