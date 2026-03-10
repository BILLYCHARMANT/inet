import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "INET Maker | Digital Fabrication & Innovation",
  description: "Join the digital fabrication and innovation training program. Master the tools of tomorrow and turn your boldest ideas into physical reality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light font-display text-slate-900 antialiased min-h-screen flex flex-col">
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
