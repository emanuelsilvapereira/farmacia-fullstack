"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Pill, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simula o login e joga o usuário para o Dashboard
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Finge que está checando a senha no banco por 1 segundo
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-11 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Botão de Tema solto no topo */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Elemento de design no fundo (Opcional, dá um ar mais moderno) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        
        {/* Logo FarmaSys */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <Pill className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            FarmaSys
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão Inteligente de Estoque e PDV
          </p>
        </div>

        {/* Card de Login */}
        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  placeholder="joao@farmasys.com.br" 
                  className={inputStyle} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  className={inputStyle} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Rodapé do Login */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} FarmaSys. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}