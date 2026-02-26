"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Pill, Building2, Package, Tag, AlertTriangle, Hash, Calendar, Layers, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function CadastroMedicamento() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    nome: '', fabricante: '', medida: '', categoria: 'Analgésico', estoqueMinimo: 10,
    lote: { numeroLote: '', validade: '', quantidade: 0 }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('lote.')) {
      const loteField = name.split('.')[1];
      setFormData(prev => ({ ...prev, lote: { ...prev.lote, [loteField]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMensagem({ tipo: '', texto: '' });
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: data.message });
      } else {
        setMensagem({ tipo: 'erro', texto: data.error || 'Erro ao salvar.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // Componente auxiliar para Input com Ícone
  const InputGroup = ({ label, icon: Icon, children }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />} {label}
      </label>
      {children}
    </div>
  );

  // Estilo padrão dos inputs
  const inputStyle = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800";

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-5xl mx-auto">
      
      {/* Cabeçalho */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Pill className="w-6 h-6" />
            </div>
            Novo Medicamento
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
            Cadastre um novo produto na base ou adicione lotes de entrada.
          </p>
        </div>
        <ThemeToggle /> {/* O Botão de Dark Mode ali no canto! */}
      </header>

      {/* Alertas Premium */}
      {mensagem.texto && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium text-sm animate-in fade-in slide-in-from-top-4 ${
          mensagem.tipo === 'sucesso' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
            : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
        }`}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Card 1: Produto */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Identificação do Produto</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Informações fixas do medicamento.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputGroup label="Nome Comercial / Princípio Ativo" icon={Tag}>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Dipirona Sódica Monoidratada" className={inputStyle} />
              </InputGroup>
            </div>
            <InputGroup label="Fabricante / Laboratório" icon={Building2}>
              <input required type="text" name="fabricante" value={formData.fabricante} onChange={handleChange} placeholder="Ex: Medley" className={inputStyle} />
            </InputGroup>
            <InputGroup label="Apresentação / Medida" icon={Package}>
              <input required type="text" name="medida" value={formData.medida} onChange={handleChange} placeholder="Ex: 500mg, 30 Comprimidos" className={inputStyle} />
            </InputGroup>
            <InputGroup label="Categoria Terapêutica" icon={Layers}>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className={inputStyle}>
                <option value="Analgésico">Analgésico e Antitérmico</option>
                <option value="Antibiótico">Antibiótico</option>
                <option value="Anti-inflamatório">Anti-inflamatório</option>
                <option value="Controlado">Uso Controlado (Tarja Preta)</option>
              </select>
            </InputGroup>
            <InputGroup label="Alerta de Estoque Mínimo" icon={AlertTriangle}>
              <input required type="number" name="estoqueMinimo" value={formData.estoqueMinimo} onChange={handleChange} min="1" className={inputStyle} />
            </InputGroup>
          </div>
        </Card>

        {/* Card 2: Lote */}
        <Card className="p-8 border-l-4 border-l-blue-500 dark:border-l-blue-500">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dados do Lote</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">A quantidade será somada se a validade já existir.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Número do Lote" icon={Hash}>
              <input required type="text" name="lote.numeroLote" value={formData.lote.numeroLote} onChange={handleChange} placeholder="Ex: L-48291" className={inputStyle} />
            </InputGroup>
            <InputGroup label="Data de Validade" icon={Calendar}>
              <input required type="date" name="lote.validade" value={formData.lote.validade} onChange={handleChange} className={inputStyle} />
            </InputGroup>
            <InputGroup label="Quantidade de Entrada" icon={Package}>
              <input required type="number" name="lote.quantidade" value={formData.lote.quantidade} onChange={handleChange} min="1" className={inputStyle} />
            </InputGroup>
          </div>
        </Card>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="button" className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {loading ? 'Processando...' : 'Salvar no Estoque'}
          </button>
        </div>
        
      </form>
    </div>
  );
}