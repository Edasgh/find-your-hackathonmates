"use client";

import React, { useLayoutEffect, useState } from "react";
import TeamsLoader from "./TeamsLoader";
import useChat from "@/hooks/useChat";
import ChatTile from "./ChatTile";
import { useCreds } from "@/hooks/useCreds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus as plusIcon } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Sidebar = () => {
  const { user, isLoading, error } = useCreds();
  const { isActive } = useChat();
  const [loading, setLoading] = useState(isLoading);
  const [myTeams, setMyTeams] = useState([]);
  const [over, setOver] = useState(false);

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
                <div className="text-xl flex justify-between font-semibold p-5 border-b border-textBgPrimary text-textPrimary">
                  My Teams
                  <button
                    className="text-3xl relative"
                    onMouseOver={() => {
                      setOver(true);
                    }}
                    onMouseOut={() => {
                      setOver(false);
                    }}
                  >
                    <Link href="/createTeam">
                      <span
                        className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 -left-28 ${
                          over ? "flex" : "hidden"
                        } `}
                      >
                        Create new Team
                      </span>
                      <FontAwesomeIcon
                        className={over ? "text-indigo-400" : ""}
                        icon={over ? plusIcon : faSquarePlus}
                      />
                    </Link>
                  </button>
                </div>
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
                <div className="text-xl flex justify-between font-semibold p-5 border-b border-textBgPrimary text-textPrimary">
                  My Teams
                  <button
                    className="text-3xl relative"
                    onMouseOver={() => {
                      setOver(true);
                    }}
                    onMouseOut={() => {
                      setOver(false);
                    }}
                  >
                    <Link href="/createTeam">
                      <span
                        className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 -left-28 ${
                          over ? "flex" : "hidden"
                        } `}
                      >
                        Create new Team
                      </span>
                      <FontAwesomeIcon
                        className={over ? "text-indigo-400" : ""}
                        icon={over ? plusIcon : faSquarePlus}
                      />
                    </Link>
                  </button>
                </div>
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
