"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BotaoDeletar({ id, nomeProduto }: { id: string | number; nomeProduto?: string }) {
  const router = useRouter();
  const [deletando, setDeletando] = useState(false);

  const handleDelete = async () => {
    // 1. Confirmação de segurança para evitar cliques acidentais
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir ${nomeProduto ? `o remédio "${nomeProduto}"` : 'este item'}? \nEssa ação não pode ser desfeita.`
    );
    
    if (!confirmacao) return;

    setDeletando(true);

    try {
      // 2. Chama o nosso "motor" lá na API
      const res = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 3. Atualiza a página magicamente para o item sumir da tela
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
    <button
      onClick={handleDelete}
      disabled={deletando}
      title="Excluir Remédio"
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
    >
      {/* Se estiver deletando, podemos mostrar um ícone piscando ou apenas a lixeira padrão */}
      <Trash2 className={`w-5 h-5 ${deletando ? 'animate-pulse text-red-400' : ''}`} />
    </button>
  );
}