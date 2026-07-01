"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "USER" | "GESTOR";

export type User = {
  name: string;
  email: string;
  matricula: string;
  cpf: string;
  initials: string;
  role: Role;
};

export type Ticket = {
  id: string;
  eventId: string;
  eventTitle: string;
  participant: string;
  date: string;
  time: string;
  cpf?: string; // <- Adicionado para resolver o TypeScript na tela de Ingressos
};

export type Inscrito = {
  name: string;
  cpf: string;
  matricula: string;
  checkedIn: boolean;
};

export type ManagedEvent = {
  id: string;
  title: string;
  description: string;
  local: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  vagas: number;
  professor: string;
  assunto: string;
  image?: string;
  inscritos: Inscrito[];
};

type AuthModalMode = "prompt" | "login" | "forgot" | "register" | null;

type AppState = {
  user: User | null;
  tickets: Ticket[];
  managedEvents: ManagedEvent[];
  hydrated: boolean;
  login: (email: string) => void;
  logout: () => void;
  register: (data: { name: string; email: string; matricula: string; cpf: string }) => void;
  updateUser: (patch: Partial<User>) => void;
  deleteAccount: () => void;
  addTicket: (t: Omit<Ticket, "id">) => void;
  hasTicket: (eventId: string) => boolean;
  removeTicket: (id: string) => void;
  createEvent: (data: Omit<ManagedEvent, "id" | "inscritos"> & { inscritos?: Inscrito[] }) => string;
  updateEvent: (id: string, patch: Partial<ManagedEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleCheckin: (eventId: string, cpf: string) => void;
  checkinByIdentifier: (eventId: string, value: string) => { ok: boolean; name?: string };
  authModal: AuthModalMode;
  openAuthModal: (m: AuthModalMode) => void;
};

const AppCtx = createContext<AppState | null>(null);

const STORAGE = "snctzo-state-v2";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase() || "U";
}

function roleFromEmail(email: string): Role {
  return email.toLowerCase().endsWith("@uerj.com.br") ? "GESTOR" : "USER";
}

function seedManagedEvents(): ManagedEvent[] {
  return [
    {
      id: "me-seed-1",
      title: "Oficina de Escrita Científica",
      description: "Oficina prática sobre estruturação e revisão de artigos acadêmicos.",
      local: "Sala 4001 - Bloco F",
      dateStart: "2026-10-21",
      dateEnd: "2026-10-21",
      timeStart: "14:00",
      timeEnd: "17:00",
      vagas: 30,
      professor: "Prof. Ana Ribeiro",
      assunto: "Metodologia",
      inscritos: [
        { name: "João Silva", cpf: "11122233344", matricula: "20221111111", checkedIn: false },
        { name: "Beatriz Lima", cpf: "22233344455", matricula: "20221111222", checkedIn: false },
        { name: "Carlos Pereira", cpf: "33344455566", matricula: "20221111333", checkedIn: true },
      ],
    },
    {
      id: "me-seed-2",
      title: "Painel: Ciência Aberta",
      description: "Debate sobre práticas de ciência aberta e ciência cidadã no Brasil.",
      local: "Auditório 11 - UERJ Maracanã",
      dateStart: "2026-10-23",
      dateEnd: "2026-10-23",
      timeStart: "10:00",
      timeEnd: "12:00",
      vagas: 120,
      professor: "Prof. Roberto Alves",
      assunto: "Divulgação Científica",
      inscritos: [
        { name: "Daniela Souza", cpf: "44455566677", matricula: "20221111444", checkedIn: false },
        { name: "Eduardo Nunes", cpf: "55566677788", matricula: "20221111555", checkedIn: false },
      ],
    },
  ];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [managedEvents, setManagedEvents] = useState<ManagedEvent[]>([]);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [hydrated, setHydrated] = useState(false);

  // Carrega os dados salvos no navegador quando a página abre
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setTickets(parsed.tickets ?? []);
        setManagedEvents(parsed.managedEvents ?? []);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Salva os dados no navegador sempre que houver mudança
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE,
        JSON.stringify({ user, tickets, managedEvents })
      );
    } catch {
      /* ignore */
    }
  }, [user, tickets, managedEvents, hydrated]);

  const value = useMemo<AppState>(
    () => ({
      user,
      tickets,
      managedEvents,
      hydrated,
      login: (email) => {
        const role = roleFromEmail(email);
        setUser({
          name: role === "GESTOR" ? "Prof. Ana Ribeiro" : "Maria Costa",
          email: email || (role === "GESTOR" ? "ana.ribeiro@uerj.com.br" : "maria.costa@uerj.br"),
          matricula: role === "GESTOR" ? "" : "20231234567",
          cpf: role === "GESTOR" ? "98765432100" : "12345678900",
          initials: role === "GESTOR" ? "AR" : "MC",
          role,
        });
        if (role === "GESTOR") {
          setManagedEvents((prev) => (prev.length === 0 ? seedManagedEvents() : prev));
        }
        setAuthModal(null);
      },
      logout: () => setUser(null),
      register: (data) => {
        const role = roleFromEmail(data.email);
        setUser({
          name: data.name || "Novo Usuário",
          email: data.email,
          matricula: data.matricula,
          cpf: data.cpf,
          initials: initialsFrom(data.name || "Novo Usuário"),
          role,
        });
        if (role === "GESTOR") {
          setManagedEvents((prev) => (prev.length === 0 ? seedManagedEvents() : prev));
        }
        setAuthModal(null);
      },
      updateUser: (patch) =>
        setUser((u) =>
          u
            ? {
              ...u,
              ...patch,
              initials: patch.name ? initialsFrom(patch.name) : u.initials,
            }
            : u
        ),
      deleteAccount: () => {
        setUser(null);
        setTickets([]);
        setManagedEvents([]);
      },
      addTicket: (t) =>
        setTickets((prev) => [
          ...prev,
          { ...t, id: `tk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ]),
      hasTicket: (eventId) => tickets.some((t) => t.eventId === eventId),
      removeTicket: (id) => setTickets((prev) => prev.filter((t) => t.id !== id)),
      createEvent: (data) => {
        const id = `me-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setManagedEvents((prev) => [
          ...prev,
          { ...data, id, inscritos: data.inscritos ?? [] },
        ]);
        return id;
      },
      updateEvent: (id, patch) =>
        setManagedEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      deleteEvent: (id) => setManagedEvents((prev) => prev.filter((e) => e.id !== id)),
      toggleCheckin: (eventId, cpf) =>
        setManagedEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? {
                ...e,
                inscritos: e.inscritos.map((i) =>
                  i.cpf === cpf ? { ...i, checkedIn: !i.checkedIn } : i
                ),
              }
              : e
          )
        ),
      checkinByIdentifier: (eventId, value) => {
        const digits = value.replace(/\D/g, "");
        const ev = managedEvents.find((e) => e.id === eventId);
        if (!ev) return { ok: false };
        const match = ev.inscritos.find((i) => i.cpf === digits || i.matricula === digits);
        if (!match) return { ok: false };
        setManagedEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? {
                ...e,
                inscritos: e.inscritos.map((i) =>
                  i.cpf === match.cpf ? { ...i, checkedIn: true } : i
                ),
              }
              : e
          )
        );
        return { ok: true, name: match.name };
      },
      authModal,
      openAuthModal: setAuthModal,
    }),
    [user, tickets, managedEvents, authModal, hydrated]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}