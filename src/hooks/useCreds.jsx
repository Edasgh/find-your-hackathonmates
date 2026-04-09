"use client";
import { createContext, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { socket } from "@/lib/socket";

const CredsContext = createContext();

export const CredsProvider = ({ children }) => {
  const { data: session, status } = useSession();

  const user = session?.user || null;
  const isLoading = status === "loading";

  useEffect(() => {
    if (user) {
      socket.emit("visit", user.id);
    }
  }, [user]);

  return (
    <CredsContext.Provider value={{ user, isLoading }}>
      {children}
    </CredsContext.Provider>
  );
};

export const useCreds = () => useContext(CredsContext);
