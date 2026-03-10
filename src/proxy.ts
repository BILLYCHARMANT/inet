import type { NextFetchEvent, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const authHandler = withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/e-learning")) return !!token;
      if (path.startsWith("/dashboard")) {
        if (!token) return false;
        const role = token.role as string | undefined;
        return role === "SUPER_ADMIN" || role === "ADMIN";
      }
      return true;
    },
  },
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authHandler(request, event);
}

export const config = {
  matcher: ["/e-learning/:path*", "/dashboard/:path*"],
};
