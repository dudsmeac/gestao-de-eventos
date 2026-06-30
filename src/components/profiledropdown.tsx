"use client";

import { useRouter } from "next/navigation";
import { Ticket as TicketIcon, Award, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApp, type User } from "@/lib/app-store";

export function ProfileDropdown({ user }: { user: User }) {
  const { logout } = useApp();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menu do perfil"
        className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
          <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* As navegações agora usam o router.push() do Next.js */}
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