"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { MapPin, Home, Hash, CheckCircle2, Loader2, Building } from "lucide-react";

export default function CadastroUBS() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '', bairro: '', cep: '', rua: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Aqui viria o seu fetch para /api/ubs
    setTimeout(() => {
      alert("UBS cadastrada com sucesso!");
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            <Building className="w-6 h-6" />
          </div>
          Cadastrar Nova UBS
        </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Nome da Unidade</label>
              <input required type="text" placeholder="Ex: UBS Central" className="w-full p-3 rounded-xl border dark:bg-slate-900" 
                onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">CEP</label>
              <input required type="text" placeholder="00000-000" className="w-full p-3 rounded-xl border dark:bg-slate-900"
                onChange={e => setFormData({...formData, cep: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bairro</label>
              <input required type="text" className="w-full p-3 rounded-xl border dark:bg-slate-900"
                onChange={e => setFormData({...formData, bairro: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Rua / Logradouro</label>
              <input required type="text" className="w-full p-3 rounded-xl border dark:bg-slate-900"
                onChange={e => setFormData({...formData, rua: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
             <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
              Confirmar Cadastro
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}