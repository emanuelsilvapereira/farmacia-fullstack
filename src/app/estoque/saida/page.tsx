"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PackageMinus, CheckCircle2, XCircle, Loader2, Package, Hash } from "lucide-react";

const InputGroup = ({ label, icon: Icon, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400" />} {label}
    </label>
    {children}
  </div>
);

export default function SaidaEstoque() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    produtoId: '',
    quantidadeStr: ''
  });

  // Carrega os produtos do banco de dados ao abrir a tela
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch('/api/produtos');
        const data = await res.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      } finally {
        setBuscando(false);
      }
    }
    fetchProdutos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setMensagem({ tipo: '', texto: '' });

    try {
      // Chama a API de saída que criamos antes da pausa
      const response = await fetch('/api/vendas', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: data.message });
        setFormData({ produtoId: '', quantidadeStr: '' }); // Limpa o formulário
        
        // Atualiza a lista para refletir o estoque reduzido
        const res = await fetch('/api/produtos');
        setProdutos(await res.json());
      } else {
        setMensagem({ tipo: 'erro', texto: data.error || 'Erro ao registrar saída.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800";

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-3xl mx-auto">
      
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <PackageMinus className="w-6 h-6" />
            </div>
            Saída de Estoque
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
            Registre a retirada de produtos. O sistema dará baixa nos lotes mais próximos do vencimento (FEFO).
          </p>
        </div>
        <ThemeToggle />
      </header>

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

      <form onSubmit={handleSubmit}>
        <Card className="p-8">
          <div className="space-y-6">
            
            <InputGroup label="Selecione o Produto" icon={Package}>
              <select 
                required 
                name="produtoId" 
                value={formData.produtoId} 
                onChange={handleChange} 
                className={inputStyle}
                disabled={buscando}
              >
                <option value="" disabled>
                  {buscando ? 'Carregando produtos...' : 'Selecione um item da lista'}
                </option>
                
                {produtos.map(produto => {
                  const estoqueTotal = produto.lotes.reduce((acc: number, lote: any) => acc + lote.quantidade, 0);
                  return (
                    <option key={produto.id} value={produto.id} disabled={estoqueTotal === 0}>
                      {produto.nome} ({produto.medida}) - Disp: {estoqueTotal} un.
                    </option>
                  );
                })}
              </select>
            </InputGroup>

            <InputGroup label="Quantidade de Saída" icon={Hash}>
              <input 
                required 
                type="number" 
                name="quantidadeStr" 
                value={formData.quantidadeStr} 
                onChange={handleChange} 
                min="1" 
                placeholder="Ex: 5"
                className={inputStyle} 
              />
            </InputGroup>

          </div>
        </Card>

        <div className="flex items-center justify-end gap-4 pt-6">
          <button type="button" onClick={() => window.history.back()} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800">
            Voltar
          </button>
          <button type="submit" disabled={loading || !formData.produtoId} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {loading ? 'Processando...' : 'Confirmar Saída'}
          </button>
        </div>
      </form>

    </div>
  );
}