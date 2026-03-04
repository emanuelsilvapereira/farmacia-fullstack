import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error("A variável DATABASE_URL não foi encontrada. Verifique seu arquivo .env");
  }

  // Truque: O adaptador exige o prefixo mariadb:// para funcionar
  const adapterUrl = dbUrl.replace('mysql://', 'mariadb://');
  
  // 1. Criamos a conexão do adaptador
  const adapter = new PrismaMariaDb(adapterUrl);

  // 2. Passamos o adaptador para o Prisma (o erro vermelho vai sumir!)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma