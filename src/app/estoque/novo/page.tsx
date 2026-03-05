"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { Pill, Building2, Package, Tag, AlertTriangle, Hash, Calendar, Layers, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

const InputGroup = ({ label, icon: Icon, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400" />} {label}
    </label>
    {children}
  </div>
);

export default function CadastroMedicamento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // 👈 Estado do Modal
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

  const handleNumberFocus = (name: string, value: number) => {
    if (value === 0) {
      if (name.startsWith('lote.')) {
        setFormData(prev => ({ ...prev, lote: { ...prev.lote, quantidade: '' as any } }));
      } else {
        setFormData(prev => ({ ...prev, [name]: '' as any }));
      }
    }
  };

  const handleNumberBlur = (name: string, value: any) => {
    if (value === '' || value === null) {
      if (name.startsWith('lote.')) {
        setFormData(prev => ({ ...prev, lote: { ...prev.lote, quantidade: 0 } }));
      } else {
        setFormData(prev => ({ ...prev, [name]: 0 }));
      }
    }
  };

  // 1. O clique do formulário agora apenas abre o Modal
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  // 2. O envio real acontece aqui, chamado pelo botão do Modal
  const handleConfirmSave = async () => {
    setShowModal(false);
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: "Cadastro realizado com sucesso!" });
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1500);
      } else {
        setMensagem({ tipo: 'erro', texto: data.error || 'Erro ao salvar.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800";

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-5xl mx-auto relative">
      
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Pill className="w-6 h-6" />
            </div>
            Novo Medicamento
          </h1>
        </div>
      </header>

      {mensagem.texto && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium text-sm animate-in fade-in slide-in-from-top-4 ${
          mensagem.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400'
        }`}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handlePreSubmit} className="space-y-8">
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputGroup label="Nome do Medicamento" icon={Tag}>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputStyle} />
              </InputGroup>
            </div>
            <InputGroup label="Fabricante" icon={Building2}>
              <input required type="text" name="fabricante" value={formData.fabricante} onChange={handleChange} className={inputStyle} />
            </InputGroup>
            <InputGroup label="Medida" icon={Package}>
              <input required type="text" name="medida" value={formData.medida} onChange={handleChange} className={inputStyle} />
            </InputGroup>
            <InputGroup label="Alerta Mínimo" icon={AlertTriangle}>
              <input required type="number" name="estoqueMinimo" value={formData.estoqueMinimo} onFocus={() => handleNumberFocus('estoqueMinimo', Number(formData.estoqueMinimo))} onBlur={(e) => handleNumberBlur('estoqueMinimo', e.target.value)} onChange={handleChange} className={inputStyle} />
            </InputGroup>
          </div>
        </Card>

        <Card className="p-8 border-l-4 border-l-blue-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Lote" icon={Hash}>
              <input required type="text" name="lote.numeroLote" value={formData.lote.numeroLote} onChange={handleChange} maxLength={10} className={inputStyle} />
            </InputGroup>
            <InputGroup label="Validade" icon={Calendar}>
              <input required type="date" name="lote.validade" value={formData.lote.validade} onChange={handleChange} className={inputStyle} />
            </InputGroup>
            <InputGroup label="Quantidade" icon={Package}>
              <input required type="number" name="lote.quantidade" value={formData.lote.quantidade} onFocus={() => handleNumberFocus('lote.quantidade', Number(formData.lote.quantidade))} onBlur={(e) => handleNumberBlur('lote.quantidade', e.target.value)} onChange={handleChange} className={inputStyle} />
            </InputGroup>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Confirmar Cadastro
          </button>
        </div>
      </form>

      {/* 🟦 MODAL DE CONFIRMAÇÃO (NA FRENTE DE TUDO) 🟦 */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirmar Dados?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Você está prestes a cadastrar <strong>{formData.nome}</strong> com <strong>{formData.lote.quantidade}</strong> unidades no lote <strong>{formData.lote.numeroLote}</strong>.
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
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                >
                  Sim, Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}