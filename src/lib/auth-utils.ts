import type { Session } from "next-auth";
import type { Role } from "@/types/next-auth";

export function hasRole(session: Session | null, role: Role): boolean {
  return session?.user?.role === role;
}

export function isSuperAdmin(session: Session | null): boolean {
  return hasRole(session, "SUPER_ADMIN");
}

export function isAdmin(session: Session | null): boolean {
  return hasRole(session, "ADMIN");
}

export function isMentor(session: Session | null): boolean {
  return hasRole(session, "MENTOR");
}

export function isAdminOrAbove(session: Session | null): boolean {
  const r = session?.user?.role;
  return r === "SUPER_ADMIN" || r === "ADMIN";
}
