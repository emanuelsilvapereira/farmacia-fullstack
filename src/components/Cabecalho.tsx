import { ThemeToggle } from "@/components/ThemeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BotaoSair } from "./BotaoSair";
import { BotaoVoltar } from "@/components/BotaoVoltar";

export async function Cabecalho() {
  // 👈 Agora passamos a regra para o NextAuth saber que precisa buscar o 'role'
  const session: any = await getServerSession(authOptions);

  if (!session?.user) return null;

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-sm px-6 md:px-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase">
          {session.user.name?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            {session.user.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Nível: {session.user.role || 'Indefinido'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <BotaoVoltar />
        <ThemeToggle />
        <BotaoSair />
      </div>
    </header>
  );
}