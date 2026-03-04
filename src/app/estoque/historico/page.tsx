import React from 'react';
import prisma from '@/lib/prisma';
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { History, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default async function HistoricoMovimentacoes() {
  // Busca as últimas 50 movimentações no banco, da mais recente para a mais antiga
  const movimentacoes = await prisma.movimentacao.findMany({
    include: {
      produto: true // Traz os dados do produto junto
    },
    orderBy: {
      data: 'desc'
    },
    take: 50
  });

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-5xl mx-auto">
      
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <History className="w-6 h-6" />
            </div>
            Histórico de Movimentações
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
            Acompanhe as últimas entradas e saídas do seu estoque.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Card className="overflow-hidden">
        {movimentacoes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Nenhuma movimentação registrada ainda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {movimentacoes.map((mov) => (
              <div key={mov.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    mov.tipo === 'ENTRADA' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                  }`}>
                    {mov.tipo === 'ENTRADA' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{mov.produto.nome}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
                      <span>{mov.tipo === 'ENTRADA' ? 'Entrada no estoque' : 'Saída registrada'}</span>
                      <span>•</span>
                      <span>
                        {new Date(mov.data).toLocaleDateString('pt-BR', { 
                          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' 
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className={`text-lg font-bold ${
                  mov.tipo === 'ENTRADA' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade}
                </div>

              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  );
}