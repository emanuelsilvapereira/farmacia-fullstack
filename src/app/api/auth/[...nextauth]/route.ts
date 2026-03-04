import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // 👈 Puxa as regras do arquivo central!

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };