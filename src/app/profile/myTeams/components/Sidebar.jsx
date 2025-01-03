"use client";

import React, { useLayoutEffect, useState } from "react";
import TeamsLoader from "./TeamsLoader";
import useChat from "@/hooks/useChat";
import ChatTile from "./ChatTile";
import { useCreds } from "@/hooks/useCreds";

const Sidebar = () => {
  const {user,isLoading,error} = useCreds();
  const { isActive } = useChat();
  const [loading, setLoading] = useState(isLoading);
  const [myTeams, setMyTeams] = useState([]);

  const getMyTeams = async () => {
    setLoading(true);
    try {
      const getUser = await fetch("/api/profile");
      const jsonData = await getUser.json();
      if (getUser.status !== 200) {
        throw new Error("Something went wrong!");
      } else {
        const resp = await fetch(`/api/profile/myTeams?id=${jsonData._id}`);
        const data = await resp.json();
        if (resp.status === 200) {
          setMyTeams([...data]);
          setLoading(false);
        } else {
          throw new Error("No teams found!");
        }
      }
    } catch (error) {
      console.log(error);
      setMyTeams([]);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    getMyTeams();
  }, []);

  return (
    <>
      {loading ? (
        <TeamsLoader />
      ) : (
        <>
          {myTeams.length === 0 ? (
            <>
              <div
                className={`max-[750px]:w-screen min-[750.1px]:w-1/4 ${
                  isActive && "max-[750px]:hidden"
                }  bg-bgSecondary border-r border-textBgPrimary`}
              >
                <h1 className="text-xl font-semibold p-5 border-b border-textBgPrimary text-textPrimary">
                  My Teams
                </h1>
                <div className="overflow-y-auto h-[calc(100vh-5rem)]">
                  <p className="text-sm text-gray-400 p-3">No teams to show</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className={`max-[750px]:w-screen min-[750.1px]:w-1/4 ${
                  isActive && "max-[750px]:hidden"
                }  bg-bgSecondary border-r border-textBgPrimary`}
              >
                <h1 className="text-xl font-semibold p-5 border-b border-textBgPrimary text-textPrimary">
                  My Teams
                </h1>
                <div className="overflow-y-auto h-[calc(100vh-5rem)]">
                  {myTeams.map((team, index) => (
                    <ChatTile key={index} team={team} myId={user._id} />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;
