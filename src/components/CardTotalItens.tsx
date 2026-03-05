"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, BarChart3, X } from "lucide-react";

interface CardProps {
  total: number;
  // 👇 Agora o card avisa que precisa receber os dados reais
  dadosGrafico: { label: string; valor: number; percentual: number }[];
}

export function CardTotalItens({ total, dadosGrafico }: CardProps) {
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [animarBarras, setAnimarBarras] = useState(false);

  useEffect(() => {
    if (mostrarGrafico) {
      // Pequeno atraso garantido para a animação disparar sempre
      const timer = setTimeout(() => setAnimarBarras(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimarBarras(false);
    }
  }, [mostrarGrafico]);

  return (
    <>
      {/* O Card Verde */}
      <div 
        onClick={() => setMostrarGrafico(true)}
        className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <BarChart3 className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {total}
          </h3>
          <p className="font-medium mt-1 text-slate-500 dark:text-slate-400">
            Total de Itens Físicos
          </p>
        </div>
      </div>

      {/* A Janela Modal com o Gráfico */}
      {mostrarGrafico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Top 6 Produtos em Estoque
              </h3>
              <button 
                onClick={() => setMostrarGrafico(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {dadosGrafico.length === 0 ? (
                <p className="text-center text-slate-500 py-10">Nenhum produto cadastrado no estoque ainda.</p>
              ) : (
                <div className="flex items-end gap-3 h-48 mt-2">
                  {dadosGrafico.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                      <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-t-md relative flex items-end justify-center" style={{ height: '100%' }}>
                        
                        {/* 👇 Tooltip que mostra o valor exato no hover! */}
                        <div className="absolute -top-8 bg-slate-800 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {item.valor} unid.
                        </div>

                        {/* A barra animada */}
                        <div 
                          className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-md transition-all duration-700 ease-out group-hover:bg-blue-600 dark:group-hover:bg-blue-300"
                          style={{ height: animarBarras ? `${item.percentual}%` : '0%' }}
                        ></div>
                        
                      </div>
                      <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium truncate w-full text-center" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-center text-sm text-slate-500 mt-6">
                Representação visual dos itens com maior volume físico.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}