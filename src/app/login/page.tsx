"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Lock, Mail, AlertCircle, Loader2, Package } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  
  const [formData, setFormData] = useState({
    email: '',
    chave: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      // Chama o NextAuth passando as credenciais
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        chave: formData.chave,
      });

      if (result?.error) {
        setErro("E-mail ou senha incorretos.");
        setLoading(false);
      } else {
        // Se deu certo, redireciona para o Dashboard (Home)
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setErro("Ocorreu um erro ao conectar com o servidor.");
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-11 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        <div className="p-8 text-center bg-blue-600 dark:bg-blue-700">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sistema de Gestão</h1>
          <p className="text-blue-100 text-sm mt-2">Acesso restrito a colaboradores</p>
        </div>

        <div className="p-8">
          {erro && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                E-mail de acesso
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  name="email"
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@sistema.com" 
                  className={inputStyle} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                Senha de segurança
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  name="chave"
                  required 
                  value={formData.chave}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className={inputStyle} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:bg-blue-400 dark:disabled:bg-blue-800"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no Sistema'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}