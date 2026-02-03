import { Lock, Zap } from "lucide-react";

const LandingView = ({ setView }: { setView: (v: "login" | "register") => void }) => (
  <div className="w-full max-w-md text-center">
    <div className="mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
        <Zap className="text-white" size={32} />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">
        Prime<span className="text-indigo-400">Flow</span>
      </h1>
      <p className="text-slate-400 text-lg">
        A plataforma completa para gestão financeira corporativa
      </p>
    </div>

    <div className="space-y-4">
      <button
        onClick={() => setView("login")}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-lg flex items-center justify-center gap-2"
      >
        <Lock size={20} />
        Fazer Login
      </button>

      <button
        onClick={() => setView("register")}
        className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all text-lg"
      >
        Criar Conta Gratuita
      </button>
    </div>

    <p className="mt-8 text-slate-500 text-sm">
      14 dias de teste gratuito · Sem cartão de crédito
    </p>
  </div>
);

export default LandingView;