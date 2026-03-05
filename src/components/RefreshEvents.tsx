"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RefreshEvents() {
  const router = useRouter();

  useEffect(() => {
    // Toda vez que a janela ganhar foco (voltar de outra aba ou página)
    const handleFocus = () => {
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  return null; // Ele não renderiza nada visualmente
}