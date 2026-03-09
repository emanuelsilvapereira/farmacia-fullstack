"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, BarChart3, X, AlertTriangle, PackageSearch } from "lucide-react";

interface CardProps {
  total: number;
  dadosGrafico: { label: string; valor: number; percentual: number }[];
}

export function CardTotalItens({ total, dadosGrafico }: CardProps) {
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [animarBarras, setAnimarBarras] = useState(false);

  useEffect(() => {
    if (mostrarGrafico) {
      const timer = setTimeout(() => setAnimarBarras(true), 150);
      return () => clearTimeout(timer);
    } else {
      setAnimarBarras(false);
    }
  }, [mostrarGrafico]);

  return (
    <>
      {/* CARD PRINCIPAL (O que fica no Dashboard) */}
      <div 
        onClick={() => setMostrarGrafico(true)}
        className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-500 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest">Analisar</span>
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
        
        <div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {total}
          </h3>
          <p className="font-semibold mt-1 text-slate-500 dark:text-slate-400 flex items-center gap-2">
            Itens em Estoque
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </p>
        </div>

        {/* Efeito decorativo no card */}
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <BarChart3 className="w-24 h-24" />
        </div>
      </div>

      {/* MODAL DO GRÁFICO */}
      {mostrarGrafico && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop (Fundo escurecido) */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setMostrarGrafico(false)}
          />

          {/* Janela do Modal */}
          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 fade-in duration-300">
            
            {/* Header do Modal */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  Estoque Crítico vs. Ideal
                </h3>
                <p className="text-slate-500 text-sm font-medium">Os 6 itens com maior volume físico atual.</p>
              </div>
              <button 
                onClick={() => setMostrarGrafico(false)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 text-slate-500 transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Área do Gráfico */}
            <div className="p-10">
              {dadosGrafico.length === 0 ? (
                <div className="py-20 text-center">
                  <PackageSearch className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">Nenhum dado para processar.</p>
                </div>
              ) : (
                <div className="flex items-end justify-between gap-3 md:gap-6 h-72">
                  {dadosGrafico.map((item, index) => {
                    // Lógica de cores baseada no percentual
                    const isLow = item.percentual < 25;
                    const isWarning = item.percentual >= 25 && item.percentual < 60;
                    
                    const barColor = isLow 
                      ? 'from-red-600 to-red-400 dark:from-red-500 dark:to-orange-400' 
                      : isWarning 
                        ? 'from-amber-500 to-yellow-400' 
                        : 'from-blue-600 to-cyan-400 dark:from-blue-500 dark:to-blue-300';

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center h-full group">
                        <div className="relative w-full flex-1 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl flex items-end justify-center overflow-hidden border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                          
                          {/* Label de valor flutuante */}
                          <div className="absolute top-4 z-20 transition-all transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                             <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg font-black shadow-xl">
                               {item.valor} UN
                             </span>
                          </div>

                          {/* A BARRA */}
                          <div 
                            className={`w-full bg-gradient-to-t ${barColor} rounded-t-xl transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1)`}
                            style={{ 
                              height: animarBarras ? `${item.percentual}%` : '0%',
                            }}
                          >
                            {/* Brilho da barra */}
                            <div className="w-full h-full bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        {/* Nome do Produto */}
                        <div className="mt-4 text-center">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase truncate w-20 md:w-24">
                            {item.label}
                          </p>
                          {isLow && (
                            <span className="text-[9px] font-bold text-red-500 flex items-center justify-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> CRÍTICO
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Legenda de Cores */}
              <div className="mt-12 flex justify-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-blue-500" /> ADEQUADO
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-amber-500" /> ATENÇÃO
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-red-500" /> REPOSIÇÃO
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}