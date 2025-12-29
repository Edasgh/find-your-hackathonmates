"use client";
import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import useChat from "@/hooks/useChat";
import { useCreds } from "@/hooks/useCreds";
import NotFoundUser from "@/components/not-found-user";

const TeamsLayout = ({ children }) => {
  const { isActive } = useChat();
  const { user, isLoading, error } = useCreds();
  if (error || user === null) {
    return (
      <>
        <div title="my teams" className="w-screen h-screen">
          <NotFoundUser />
        </div>
      </>
    );
  }
  return (
    <div title="my teams" className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-screen">
      <Sidebar />
      <div
        className={`flex-1  ${
          isActive ? "max-[750px]:flex" : "max-[750px]:hidden"
        }  min-[750.1px]:flex flex-col`}
      >
        {" "}
        {children}{" "}
      </div>
    </div>
  );
};

export default TeamsLayout;
