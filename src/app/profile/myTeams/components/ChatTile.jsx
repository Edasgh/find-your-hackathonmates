"use client";
import CustomAvatar from "@/components/CustomAvatar";
import useChat from "@/hooks/useChat";
import { socket } from "@/lib/socket";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const ChatTile = ({ team, myId }) => {
  const { teamId } = useChat();
  const [messages, setMessages] = useState([...team.messages]);
  const [members, setMembers] = useState([...team.members]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("new-msg-notification", ({ roomId }) => {
      const arr = [...notifications, roomId];
      Cookies.set("notifications", JSON.stringify(arr));
      setNotifications((prev) => [...prev, roomId]);
    });
    if (notifications.includes(teamId)) {
      const arr = [...notifications].filter((e) => e != teamId);
      Cookies.set("notifications", JSON.stringify(arr));
      setNotifications(notifications.filter((e) => e !== teamId));
    }
    const storedNotifications = JSON.parse(
      Cookies.get("notifications") || "[]"
    );
    setNotifications(storedNotifications);
  }, [teamId]);

  return (
    <Link
      key={team._id}
      href={`/profile/myTeams/${team._id}`}
      title={`${members.length} ${members.length == 1 ? "Member" : "Members"}`}
      className={`flex items-center p-4 cursor-pointer relative hover:bg-bgPrimary border-b border-textBgPrimary ${
        teamId === team._id && "bg-bgPrimary"
      } `}
    >
      <CustomAvatar name={team.name} />
      <div className="ml-4 flex-1">
        <h3 className="text-textPrimary font-semibold mb-1">{team.name}</h3>
        <p className="text-gray-400 text-sm truncate overflow-hidden">
          {messages.length !== 0 ? (
            <>{`${
              messages[messages.length - 1].sender.id === myId
                ? "You"
                : messages[messages.length - 1].sender.name
            } : ${
              messages[messages.length - 1].message !== ""
                ? messages[messages.length - 1].message.slice(0, 20)
                : "📄 File "
            }`}</>
          ) : (
            <>
              {`${members.length} ${
                members.length == 1 ? "Member" : "Members"
              }`}
            </>
          )}
        </p>
      </div>
      {notifications.includes(team._id) && (
        <span className="absolute right-0 px-7">
          <FontAwesomeIcon icon={faCircle} className="text-green-600" />
        </span>
      )}
    </Link>
  );
};

export default ChatTile;
