import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        A página que você está procurando não existe ou foi removida.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}