import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CardTotalItens } from "@/components/CardTotalItens";
import { RefreshEvents } from "@/components/RefreshEvents";

import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingDown,
  Users,
  Building,
  Stethoscope
} from "lucide-react";

export default async function DashboardHome() {
  // 1. Pegamos a sessão do usuário logado
  const session: any = await getServerSession(authOptions);

  // 2. Definimos as permissões baseadas no perfil (Role)
  // Se não tiver role definido, tratamos como o nível mais básico (FUNCIONARIO)
  const userRole = session?.user?.role || "FUNCIONARIO";

  const isGerente = userRole === "GERENTE" || userRole === "ADMIN";
  const isFarmaceutico = userRole === "FARMACEUTICO" || isGerente; // Gerente herda as permissões de Farmacêutico
  const isAdmin = userRole === "ADMIN";

  // Buscas no banco de dados para os cards do topo
  const produtos = await prisma.produto.findMany({
    include: { lotes: true }
  });

  const totalProdutosCadastrados = produtos.length;

  const totalItensNoEstoque = produtos.reduce((accTotal, produto) => {
    const somaLotes = produto.lotes.reduce((accLote, lote) => accLote + lote.quantidade, 0);
    return accTotal + somaLotes;
  }, 0);

  const produtosAlerta = produtos.filter(produto => {
    const estoqueProduto = produto.lotes.reduce((acc, lote) => acc + lote.quantidade, 0);
    return estoqueProduto <= (produto.estoqueMinimo || 0);
  });

  const produtosComEstoque = produtos.map(p => {
    const total = p.lotes.reduce((acc, lote) => acc + lote.quantidade, 0);
    return { nome: p.nome, total };
  });
  

  const top6Produtos = produtosComEstoque
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  // 👇 LÓGICA DO GRÁFICO ATUALIZADA 👇
  const dadosParaGrafico = top6Produtos.map(p => {
    // Definimos 100 como um "estoque ideal" de referência para o gráfico ter escala.
    const valorReferencia = 100;
    const calculoPercentual = Math.min(Math.round((p.total / valorReferencia) * 100), 100);

    return {
      label: p.nome.substring(0, 12),
      valor: p.total,
      percentual: calculoPercentual === 0 && p.total > 0 ? 5 : calculoPercentual // Garante um "tiquinho" de barra se > 0
    };
  });

  const cardStyle = "bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between";

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <RefreshEvents />

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
      </header>

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

        <CardTotalItens total={totalItensNoEstoque} dadosGrafico={dadosParaGrafico} />

        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${produtosAlerta.length > 0
            ? 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20'
            : 'bg-white border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'
          }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
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

      {/* AÇÕES RÁPIDAS COM BLOQUEIOS DE ACESSO */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* 1. TODOS VEEM: Ver Estoque */}
          <Link href="/estoque" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Ver Estoque</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
          </Link>

          {/* 2. TODOS VEEM: Registrar Saída (Frente de Caixa) */}
          <Link href="/estoque/saida" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-amber-500 dark:hover:border-amber-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 dark:group-hover:bg-amber-500/10 dark:group-hover:text-amber-400 transition-colors">
                <TrendingDown className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Registrar Saída</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors group-hover:translate-x-1" />
          </Link>

          {/* 3. SÓ FARMACÊUTICO E GERENTE VEEM: Entrada de Produto */}
          {isFarmaceutico && (
            <Link href="/estoque/novo" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-400 transition-colors">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Entrada de Produto</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1" />
            </Link>
          )}

          {/* 4. SÓ GERENTE (OU ADMIN) VEEM: Cadastros Base */}
          {isGerente && (
            <>
              <Link href="/ubs/novo" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400 transition-colors">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Cadastrar UBS</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors group-hover:translate-x-1" />
              </Link>

              <Link href="/medicos/novo" className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-pink-500 dark:hover:border-pink-500 transition-all shadow-sm hover:shadow-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 dark:group-hover:bg-pink-500/10 dark:group-hover:text-pink-400 transition-colors">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Cadastrar Médico</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors group-hover:translate-x-1" />
              </Link>
            </>
          )}

          {/* 👇 5. AQUI É A MÁGICA: SÓ ADMIN VÊ A EQUIPE 👇 */}
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