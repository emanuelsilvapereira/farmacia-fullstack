"use client"; // 👈 Não esqueça disso no Next.js!

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { Users, CheckCircle2, Loader2, Building2 } from "lucide-react";

export default function CadastroMedico() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Lista de UBSs que vem do banco
  const [listaUbs, setListaUbs] = useState<{ id: number, nome: string }[]>([]);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    ubsId: ''
  });

  // Busca as UBSs assim que a página abre
  useEffect(() => {
    fetch('/api/ubs')
      .then(res => res.json())
      .then(data => setListaUbs(data))
      .catch(err => console.error("Erro ao buscar UBS:", err));
  }, []);

  // Atualiza os dados conforme você digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para salvar no banco de dados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/medicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Médico cadastrado com sucesso!");
        router.push('/'); // Volta pro início
        router.refresh();
      } else {
        alert("Erro ao cadastrar médico.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <header className="mb-10 font-semibold text-3xl flex items-center gap-3">
        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
          <Users className="w-6 h-6" />
        </div>
        Cadastrar Médico
      </header>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Nome Completo do Médico</label>
              <input 
                required 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">CRM</label>
              <input 
                required 
                name="crm"
                value={formData.crm}
                onChange={handleChange}
                type="text" 
                placeholder="000000-UF" 
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> UBS Vinculada
              </label>
              <select 
                required 
                name="ubsId"
                value={formData.ubsId}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma UBS...</option>
                {/* O loop que usa os dados REAIS do banco de dados */}
                {listaUbs.map(ubs => (
                  <option key={ubs.id} value={ubs.id}>{ubs.nome}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white p-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            {loading ? 'Salvando...' : 'Salvar Médico'}
          </button>
        </form>
      </Card>
    </div>
  );
}