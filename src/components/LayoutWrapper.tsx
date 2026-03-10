"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SigninApplyPopup from "@/components/SigninApplyPopup";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isApplyJoin = pathname === "/apply/join";

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
      {/* Popup after 1 min for visitors: Sign in or Apply (default form) */}
      {!isApplyJoin && <SigninApplyPopup />}
    </>
  );
}
