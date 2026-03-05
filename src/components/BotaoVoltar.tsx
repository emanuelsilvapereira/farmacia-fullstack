"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BotaoVoltar() {
  const router = useRouter();
  const pathname = usePathname();

  // Se estivermos no Dashboard (página inicial), não mostra o botão
  if (pathname === "/") {
    return null;
  }

  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-500/10 px-4 py-2 rounded-lg"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </button>
  );
}