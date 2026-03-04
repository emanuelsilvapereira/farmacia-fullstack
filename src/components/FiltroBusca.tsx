"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function FiltroBusca() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Função que dispara a cada letra digitada
  function handleSearch(termo: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (termo) {
      params.set("q", termo);
    } else {
      params.delete("q");
    }
    
    // Altera a URL no navegador forçando a atualização da rota
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <Search className="w-5 h-5 ml-2 text-slate-400" />
      <input 
        type="text" 
        defaultValue={searchParams.get("q") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar medicamento por nome ou fabricante..." 
        className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
      />
    </div>
  );
}