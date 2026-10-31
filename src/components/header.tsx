"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileDropdown } from "./profiledropdown"; // <- Lembrete: confira se o nome do arquivo é minúsculo mesmo ou ProfileDropdown
import { useApp } from "@/lib/app-store";

export function Header() {
  const { user, openAuthModal } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-9xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          SNCTZO
        </Link>

        <div className="relative ml-2 hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            className="h-10 rounded-full border-border bg-muted/60 pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {user.role === "GESTOR" && (
                <Link
                  href="/gestor/eventos"
                  className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
                >
                  Meus Eventos
                </Link>
              )}

              <Link
                href="/ingressos"
                className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
              >
                Ingressos
              </Link>
              <Link
                href="/certificados"
                className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
              >
                Certificados
              </Link>
              <ProfileDropdown user={user} />
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                Login/Cadastro
              </button>
              <button
                onClick={() => openAuthModal("prompt")}
                aria-label="Entrar"
                className="rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-muted text-muted-foreground" />
                </Avatar>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}