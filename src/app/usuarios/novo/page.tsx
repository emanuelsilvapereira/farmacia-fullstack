"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Save, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'OPERADOR' // Cargo padrão
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Deu certo! Volta para a lista de usuários e atualiza
        router.push('/usuarios');
        router.refresh();
      } else {
        const data = await res.json();
        setErro(data.error || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-3xl mx-auto">
      <header className="mb-10">
        <Link href="/usuarios" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Equipe
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Cadastrar Funcionário
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Crie um novo acesso ao sistema e defina suas permissões.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm space-y-6">
        
        {/* Aviso de Erro */}
        {erro && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <Shield className="w-5 h-5" /> {erro}
          </div>
        )}

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: João da Silva"
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail (Login)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@sistema.com"
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Senha de Acesso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="senha"
                required
                minLength={6}
                value={formData.senha}
                onChange={handleChange}
                placeholder="Mínimo de 6 caracteres"
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Cargo/Permissão */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cargo / Nível de Permissão</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-500">
                <Shield className="w-5 h-5" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 appearance-none"
              >
                <option value="OPERADOR">OPERADOR (Apenas registrar saídas)</option>
                <option value="FARMACEUTICO">FARMACÊUTICO (Pode dar entrada em estoque)</option>
                <option value="GERENTE">GERENTE (Acesso Total ao sistema)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
          <button
            type="submit"
            disabled={salvando}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {salvando ? "Salvando..." : "Criar Usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}