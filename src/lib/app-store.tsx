'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type User = {
  name: string
  email: string
  matricula: string
  cpf: string
  initials: string
}

export type Ticket = {
  id: string
  eventId: string
  eventTitle: string
  participant: string
  date: string
  time: string
}

type AuthModalMode = "prompt" | "login" | "forgot" | "register" | null

type AppState = {
  user: User | null;
  tickets: Ticket[];
  hydrated: boolean;
  login: (email: string) => void;
  logout: () => void;
  register: (data: { name: string; email: string; matricula: string; cpf: string }) => void;
  updateUser: (patch: Partial<User>) => void;
  addTicket: (t: Omit<Ticket, "id">) => void;
  hasTicket: (eventId: string) => boolean;
  removeTicket: (id: string) => void;
  authModal: AuthModalMode;
  openAuthModal: (m: AuthModalMode) => void;
};

const AppCtx = createContext<AppState | null>(null);

const STORAGE = "snctzo-state-v1";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase() || "U";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setTickets(parsed.tickets ?? []);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE, JSON.stringify({ user, tickets }));
    } catch {
      /* ignore */
    }
  }, [user, tickets, hydrated]);

  const value = useMemo<AppState>(
    () => ({
      user,
      tickets,
      hydrated,
      login: (email) => {
        setUser({
          name: "Maria Costa",
          email: email || "maria.costa@uerj.br",
          matricula: "20231234567",
          cpf: "12345678900",
          initials: "MC",
        });
        setAuthModal(null);
      },
      logout: () => setUser(null),
      register: (data) => {
        setUser({
          name: data.name || "Maria Costa",
          email: data.email,
          matricula: data.matricula,
          cpf: data.cpf,
          initials: initialsFrom(data.name || "Maria Costa"),
        });
        setAuthModal(null);
      },
      updateUser: (patch) => setUser((u) => (u ? { ...u, ...patch, initials: patch.name ? initialsFrom(patch.name) : u.initials } : u)),
      addTicket: (t) =>
        setTickets((prev) => [...prev, { ...t, id: `tk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }]),
      hasTicket: (eventId) => tickets.some((t) => t.eventId === eventId),
      removeTicket: (id) => setTickets((prev) => prev.filter((t) => t.id !== id)),
      authModal,
      openAuthModal: setAuthModal,
    }),
    [user, tickets, authModal, hydrated],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
