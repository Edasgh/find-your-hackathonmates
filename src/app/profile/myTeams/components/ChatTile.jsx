"use client";
import CustomAvatar from "@/components/CustomAvatar";
import useChat from "@/hooks/useChat";
import { useCreds } from "@/hooks/useCreds";
import { socket } from "@/lib/socket";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import Link from "next/link";
import React, { useEffect, useState } from "react";

const ChatTile = ({ team, myId }) => {
  const {user,isLoading,error} = useCreds();
  const { teamId } = useChat();
  const [messages, setMessages] = useState([...team.messages]);
  const [members, setMembers] = useState([...team.members]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
     if(user)
     {
      socket.emit("get_notifs", { userId: user._id });
      socket.on("get_notifs", ({ data }) => {
        setNotifications([...data]);
      });
     }
  }, [user]);

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
      {notifications.find(n=>n.team===team._id)!==undefined && (
        <span className="absolute right-0 px-7">
          <FontAwesomeIcon icon={faCircle} className="text-green-600" />
        </span>
      )}
    </Link>
  );
};

export default ChatTile;
