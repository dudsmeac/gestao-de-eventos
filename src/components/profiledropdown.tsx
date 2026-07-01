"use client";

import { useRouter } from "next/navigation";
import { Ticket as TicketIcon, Award, Settings, LogOut, LayoutGrid } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useApp, type User } from "@/lib/app-store";

export function ProfileDropdown({ user }: { user: User }) {
  const { logout } = useApp();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menu do perfil"
        className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring transition-transform hover:scale-105"
      >
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
          <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>

          {/* Selo visual para identificar Gestores */}
          {user.role === "GESTOR" && (
            <span className="mt-1 inline-flex w-fit rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Gestor
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Opção exclusiva para Gestores */}
        {user.role === "GESTOR" && (
          <DropdownMenuItem onClick={() => router.push("/gestor/eventos")}>
            <LayoutGrid className="mr-2 size-4" /> Meus Eventos
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => router.push("/ingressos")}>
          <TicketIcon className="mr-2 size-4" /> Ingressos
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/certificados")}>
          <Award className="mr-2 size-4" /> Certificados
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
          <Settings className="mr-2 size-4" /> Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => {
            logout();
            router.push("/"); // Redireciona para a home ao sair
          }}
        >
          <LogOut className="mr-2 size-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}