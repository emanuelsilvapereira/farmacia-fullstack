import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/Card";
import { Users,MapPin, Home, Hash, CheckCircle2, Loader2, Building } from "lucide-react";


export default function CadastroMedico() {
  // Aqui você precisaria buscar as UBSs do banco para preencher o select
  const ubsFake = [{id: 1, nome: "UBS Central"}, {id: 2, nome: "UBS Vila Maria"}];

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <header className="mb-10 font-semibold text-3xl flex items-center gap-3">
         <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          Cadastrar Médico
      </header>

      <Card className="p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Nome Completo do Médico</label>
              <input required type="text" className="w-full p-3 rounded-xl border dark:bg-slate-900" />
            </div>
            <div>
              <label className="text-sm font-medium">CRM</label>
              <input required type="text" placeholder="000000-UF" className="w-full p-3 rounded-xl border dark:bg-slate-900" />
            </div>
            <div>
              <label className="text-sm font-medium">UBS Vinculada</label>
              <select className="w-full p-3 rounded-xl border dark:bg-slate-900">
                {ubsFake.map(ubs => <option key={ubs.id} value={ubs.id}>{ubs.nome}</option>)}
              </select>
            </div>
          </div>
          <button className="w-full bg-purple-600 text-white p-4 rounded-xl font-bold mt-4">
            Salvar Médico
          </button>
        </form>
      </Card>
    </div>
  );
}