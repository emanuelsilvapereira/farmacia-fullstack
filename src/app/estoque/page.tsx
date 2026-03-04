import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Package, Plus, AlertTriangle, Pill } from "lucide-react";
import { FiltroBusca } from "@/components/FiltroBusca"; // 👈 Nosso novo componente importado

export default async function ListaEstoque(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  // 1. Resolvemos a Promise da URL (Padrão Next.js 15)
  const searchParams = await props.searchParams;
  const termoDeBusca = searchParams?.q || "";

  // 2. Buscando direto do banco com o filtro aplicado
  const produtos = await prisma.produto.findMany({
    where: {
      OR: [
        { nome: { contains: termoDeBusca } },
        { fabricante: { contains: termoDeBusca } }
      ]
    },
    include: {
      lotes: true, // Traz os lotes amarrados a cada produto
    },
    orderBy: {
      nome: 'asc', // Ordem alfabética
    }
  });

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      
      {/* Cabeçalho */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Controle de Estoque
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Gerencie seus medicamentos, lotes e validades.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link 
            href="/estoque/novo"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Medicamento
          </Link>
        </div>
      </header>

      {/* Barra de Pesquisa e Filtros (Agora Funcional!) */}
      <Card className="p-4 mb-6 flex items-center gap-3">
        <FiltroBusca />
      </Card>

      {/* Tabela de Produtos */}
      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
              <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Produto</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Fabricante</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Categoria</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Lotes Ativos</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Estoque Total</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            
            {/* Se a busca não retornar nada ou não houver produtos */}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Pill className="w-8 h-8 opacity-20" />
                    <p>Nenhum medicamento encontrado.</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Loop renderizando os produtos do banco */}
            {produtos.map((produto) => {
              // Calculando o total de estoque somando todos os lotes
              const totalEstoque = produto.lotes.reduce((acc: any, lote: any) => acc + lote.quantidade, 0);
              // Como não temos a tipagem exata aqui, usei o || 0 para evitar erros no estoque mínimo
              const isEstoqueBaixo = totalEstoque <= (produto.estoqueMinimo || 0);

              return (
                <tr key={produto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      {produto.nome}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {produto.medida}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    {produto.fabricante}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    {produto.lotes.length} {produto.lotes.length === 1 ? 'lote' : 'lotes'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${isEstoqueBaixo ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                      {totalEstoque} un.
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {isEstoqueBaixo ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-md w-fit">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Estoque Baixo
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        Adequado
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

    </div>
  );
}