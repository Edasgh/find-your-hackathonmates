"use client";

import { usePathname } from "next/navigation";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CredsProvider } from "@/hooks/useCreds";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  const pathname = usePathname();

  // Check if path is profile/myTeams/[teamId]
  const isMyTeamsPage = pathname.startsWith("/profile/myTeams/");
  return (
    <ConvexProvider client={convex}>
      <SessionProvider>
        <CredsProvider>
            <Navbar />
            <ToastContainer
              position={isMyTeamsPage ? "bottom-center" : "top-center"}
              theme="dark"
            />
            {children}
        </CredsProvider>
      </SessionProvider>
    </ConvexProvider>
  );
}
