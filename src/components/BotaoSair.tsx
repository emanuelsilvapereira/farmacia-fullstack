"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function BotaoSair() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-500/10 px-4 py-2 rounded-lg"
    >
      <LogOut className="w-4 h-4" />
      Sair do Sistema
    </button>
  );
}