"use client";

import { useCreds } from "@/hooks/useCreds";
import { socket } from "@/lib/socket";
import { faBell, faMessage, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faMessage as msg,
  faUser as userIcon,
  faBell as bellIcon,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProfileNav = () => {
  const { user, isLoading, error } = useCreds();

  const [opened, setOpened] = useState(true);
  const [reqs, setReqs] = useState([]);

  const [over1, setOver1] = useState(false);
  const [over2, setOver2] = useState(false);
  const [over3, setOver3] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      socket.emit("get_alerts", { userId: user._id });
      socket.on("get_alerts", ({ data }) => {
        setReqs([...data]);
      });
      return () => {
        socket.off("get_alerts");
      };
    }
  }, [isLoading, user]);

  return (
    <>
      {!isLoading && user !== null && (
        <>
          <div
            className={`absolute z-50 left-0 bg-gray-800 text-white w-52 min-h-screen overflow-y-auto transition-transform transform ${
              opened && "-translate-x-[30rem]"
            }  ease-in-out duration-200 `}
            id="sidebar"
          >
            <div className="p-4">
              <h1 className="text-2xl mt-8 font-semibold"> {user.name}</h1>
              <ul className="mt-4">
                <li
                  className="mb-3"
                  onMouseOver={() => {
                    setOver1(true);
                  }}
                  onMouseOut={() => {
                    setOver1(false);
                  }}
                >
                  <Link
                    href="/profile/myTeams"
                    className="block hover:text-indigo-400"
                  >
                    <FontAwesomeIcon icon={over1 ? msg : faMessage} />
                    &nbsp;&nbsp; Teams
                  </Link>
                </li>
                <li
                  className="mb-3"
                  onMouseOver={() => {
                    setOver2(true);
                  }}
                  onMouseOut={() => {
                    setOver2(false);
                  }}
                >
                  <Link href="/profile" className="block hover:text-indigo-400">
                    <FontAwesomeIcon icon={over2 ? userIcon : faUser} />
                    &nbsp;&nbsp; Profile
                  </Link>
                </li>
                <li
                  className="mb-3"
                  onMouseOver={() => {
                    setOver3(true);
                  }}
                  onMouseOut={() => {
                    setOver3(false);
                  }}
                >
                  <Link
                    href="/profile/joinRequests"
                    className="block hover:text-indigo-400"
                  >
                    <FontAwesomeIcon icon={over3 ? bellIcon : faBell} />
                    &nbsp;&nbsp; Notifications
                    <span className="mx-2 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {reqs.length}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden absolute w-full">
            <div className="bg-bgPrimary shadow">
              <div className="container mx-auto">
                <div className="flex gap-2 py-1 px-2">
                  <button
                    className="text-gray-500 z-[100] hover:text-gray-600 border-[.5px] p-1 px-2 border-gray-600"
                    id="open-sidebar"
                    onClick={() => {
                      setOpened(!opened);
                    }}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileNav;
