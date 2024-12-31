"use client";
import React from "react";

import Sidebar from "./components/Sidebar";
import useChat from "@/hooks/useChat";

const TeamsLayout = ({ children }) => {
  const { isActive } = useChat();
  return (
    <div className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-screen">
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
