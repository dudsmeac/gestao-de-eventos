"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Aqui você pode logar o erro em um serviço externo (como Sentry ou similar)
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-bold text-primary">Algo deu errado!</h2>
            <p className="mt-2 text-muted-foreground max-w-sm">
                Ocorreu um erro ao carregar esta página. Tente recarregar ou volte para a página inicial.
            </p>
            <div className="mt-6 flex gap-4">
                <Button onClick={() => reset()}>Tentar novamente</Button>
                <Button variant="outline" asChild>
                    <a href="/">Voltar ao início</a>
                </Button>
            </div>
        </div>
    );
}