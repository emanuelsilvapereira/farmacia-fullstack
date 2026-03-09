"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PackageMinus, CheckCircle2, XCircle, Loader2, Package, Hash, Users, Building2, AlertCircle } from "lucide-react";

const InputGroup = ({ label, icon: Icon, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400" />} {label}
    </label>
    {children}
  </div>
);

export default function SaidaEstoque() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [ubss, setUbss] = useState<any[]>([]);
  
  const [buscando, setBuscando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    produtoId: '',
    quantidadeStr: '',
    medicoId: '',
    ubsId: ''
  });

  // Carrega os dados necessários ao abrir a tela
  useEffect(() => {
    async function fetchData() {
      try {
        const [resProdutos, resMedicos, resUbss] = await Promise.all([
          fetch('/api/produtos'),
          fetch('/api/medicos'), // Rota a ser criada/ajustada se necessário
          fetch('/api/ubs')
        ]);
        
        setProdutos(await resProdutos.json());
        setMedicos(await resMedicos.json());
        setUbss(await resUbss.json());
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setBuscando(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmSave = async () => {
    setShowModal(false);
    setLoading(true); 
    setMensagem({ tipo: '', texto: '' });

    try {
      // Chama a API de saída (ajuste a rota/payload conforme sua API)
      const response = await fetch('/api/vendas', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: data.message || 'Saída registrada com sucesso!' });
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1500);
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

  // Função auxiliar para pegar o nome do produto selecionado para o modal
  const getNomeProduto = () => {
    const prod = produtos.find(p => p.id === formData.produtoId);
    return prod ? prod.nome : '';
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-4xl mx-auto relative">
      
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <PackageMinus className="w-6 h-6" />
            </div>
            Saída de Estoque
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
            Registre a retirada de produtos informando o médico e a UBS destino.
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

      <form onSubmit={handlePreSubmit}>
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
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
                    const estoqueTotal = produto.lotes?.reduce((acc: number, lote: any) => acc + lote.quantidade, 0) || 0;
                    return (
                      <option key={produto.id} value={produto.id} disabled={estoqueTotal === 0}>
                        {produto.nome} ({produto.medida}) - Disp: {estoqueTotal} un.
                      </option>
                    );
                  })}
                </select>
              </InputGroup>
            </div>

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

            <InputGroup label="Médico Prescritor" icon={Users}>
              <select 
                required 
                name="medicoId" 
                value={formData.medicoId} 
                onChange={handleChange} 
                className={inputStyle}
                disabled={buscando}
              >
                <option value="" disabled>
                  {buscando ? 'Carregando médicos...' : 'Selecione o médico'}
                </option>
                {medicos.map(medico => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nome} (CRM: {medico.crm})
                  </option>
                ))}
              </select>
            </InputGroup>

            <div className="md:col-span-2">
              <InputGroup label="UBS de Destino" icon={Building2}>
                <select 
                  required 
                  name="ubsId" 
                  value={formData.ubsId} 
                  onChange={handleChange} 
                  className={inputStyle}
                  disabled={buscando}
                >
                  <option value="" disabled>
                    {buscando ? 'Carregando UBS...' : 'Selecione a UBS'}
                  </option>
                  {ubss.map(ubs => (
                    <option key={ubs.id} value={ubs.id}>
                      {ubs.nome}
                    </option>
                  ))}
                </select>
              </InputGroup>
            </div>

          </div>
        </Card>

        <div className="flex items-center justify-end gap-4 pt-6">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800">
            Voltar
          </button>
          <button type="submit" disabled={loading || !formData.produtoId} className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 dark:disabled:bg-amber-800 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2">
            Confirmar Saída
          </button>
        </div>
      </form>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirmar Saída?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Você está prestes a registrar a saída de <strong>{formData.quantidadeStr}</strong> unidades de <strong>{getNomeProduto()}</strong>.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Revisar
                </button>
                <button 
                  onClick={handleConfirmSave}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sim, Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}