import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth"; // 👈 Importado
import { authOptions } from "@/lib/auth"; // 👈 Importado
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  ArrowRightLeft, 
  PlusCircle, 
  ArrowRight,
  TrendingDown,
  Users // 👈 Ícone para a equipe
} from "lucide-react";

export default async function DashboardHome() {
  // 0. Buscando a sessão para validar o Nível de Acesso
  const session: any = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  // 1. Buscando todos os produtos e lotes para fazer os cálculos
  const produtos = await prisma.produto.findMany({
    include: { lotes: true }
  });

  // 2. Calculando as métricas do Dashboard
  const totalProdutosCadastrados = produtos.length;
  
  const totalItensNoEstoque = produtos.reduce((accTotal, produto) => {
    const somaLotes = produto.lotes.reduce((accLote, lote) => accLote + lote.quantidade, 0);
    return accTotal + somaLotes;
  }, 0);

  const produtosAlerta = produtos.filter(produto => {
    const estoqueProduto = produto.lotes.reduce((acc, lote) => acc + lote.quantidade, 0);
    return estoqueProduto <= (produto.estoqueMinimo || 0);
  });

  const cardStyle = "bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between";

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      
      {/* Cabeçalho */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Visão Geral
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Resumo do seu controle de estoque e acessos rápidos.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{totalProdutosCadastrados}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Produtos Cadastrados</p>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{totalItensNoEstoque}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Total de Itens Físicos</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
          produtosAlerta.length > 0 
            ? 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20' 
            : 'bg-white border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              produtosAlerta.length > 0 
                ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                : 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className={`text-3xl font-bold ${produtosAlerta.length > 0 ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
              {produtosAlerta.length}
            </h3>
            <p className={`font-medium mt-1 ${produtosAlerta.length > 0 ? 'text-red-600 dark:text-red-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
              Alertas de Estoque Baixo
            </p>
          </div>
        </div>

      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link href="/estoque" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Ver Estoque Completo</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
          </Link>

          <Link href="/estoque/novo" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-400 transition-colors">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Entrada de Produto</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1" />
          </Link>

          <Link href="/estoque/saida" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-amber-500 dark:hover:border-amber-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 dark:group-hover:bg-amber-500/10 dark:group-hover:text-amber-400 transition-colors">
                <TrendingDown className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Registrar Saída</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors group-hover:translate-x-1" />
          </Link>

          {/* Botão Condicional para o ADMIN */}
          {isAdmin && (
            <Link href="/usuarios" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-purple-500 dark:hover:border-purple-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 dark:group-hover:bg-purple-500/10 dark:group-hover:text-purple-400 transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Gerenciar Equipe</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors group-hover:translate-x-1" />
            </Link>
          )}

        </div>
      </div>

    </div>
  );
}