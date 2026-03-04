import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Cabecalho } from "@/components/Cabecalho";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "FarmaSys | Gestão Inteligente",
  description: "Sistema profissional para gestão de farmácias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="antialiased">
      <body className={`${inter.className} bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors duration-300 ease-in-out`}>
        <ThemeProvider>
          <Cabecalho /> {/* Cabecalho perfeitamente posicionado aqui */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}