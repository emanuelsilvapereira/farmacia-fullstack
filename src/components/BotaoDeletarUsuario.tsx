"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

export function BotaoDeletarUsuario({ id, nome }: { id: string | number; nome: string }) {
  const router = useRouter();
  const [deletando, setDeletando] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConfirmarExclusao = async () => {
    setDeletando(true);
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
      if (res.ok) {
        setShowModal(false); // Fecha o modal antes de recarregar a tela
        router.refresh();
      } else {
        alert("Ops! Ocorreu um erro ao tentar excluir.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setDeletando(false);
    }
  };

  return (
    <>
      {/* 1. O Botão Original que fica na Tabela */}
      <button
        onClick={() => setShowModal(true)}
        className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        Remover
      </button>

      {/* 2. O Modal Bonitão (Só aparece quando showModal for true) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Impede que feche se clicar sem querer dentro do card
          >
            <div className="p-6 md:p-8">
              
              {/* Ícone de Alerta */}
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full">
                <AlertTriangle className="w-7 h-7" />
              </div>
              
              {/* Textos */}
              <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                Remover Acesso?
              </h3>
              <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
                Tem certeza que deseja remover o acesso de <strong className="text-slate-700 dark:text-slate-300">"{nome}"</strong>? Esta ação não poderá ser desfeita.
              </p>
              
              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={deletando}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarExclusao}
                  disabled={deletando}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {deletando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  {deletando ? "Removendo..." : "Sim, remover"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}