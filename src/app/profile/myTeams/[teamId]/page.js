"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useChat from "@/hooks/useChat";
import ChatLoader from "../components/ChatLoader";
import CustomAvatar from "@/components/CustomAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import ChatNavigation from "../components/ChatNavigation";
import { socket } from "@/lib/socket";
import { getDate } from "@/lib/getDate";
import { useCreds } from "@/hooks/useCreds";

const TeamChat = () => {
  const { teamId } = useChat();
  const { user, isLoading, error } = useCreds();
  const userDetails = user;

  const currentTimeStamp = getDate();
  const [loading, setLoading] = useState(isLoading);
  const [teamData, setTeamData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newLinks, setNewLinks] = useState([]);
  const [newMembers, setNewMembers] = useState([]);

  const [msg, setMsg] = useState("");

  const msgEndRef = useRef(null);

  // Fetch team messages and data
  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/myTeams`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: teamId }),
      });
      if (res.status === 200) {
        const data = await res.json();
        setTeamData(data);
        setMessages(data.messages);
        setNewLinks(data.links);
        setNewMembers(data.members);
      } else {
        throw new Error("Team not found");
      }
    } catch {
      setTeamData(null);
      setMessages([]);
      setNewLinks([]);
      setNewMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchTeamData();
  }, []);

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const newMessage = {
      message: msg,
      sender: { name: userDetails.name, id: userDetails._id },
      sentOn: currentTimeStamp,
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("message", {
      roomId: teamId,
      message: msg,
      senderId: userDetails._id,
      senderName: userDetails.name,
      sentOn: currentTimeStamp,
    });

    setMsg("");
  };

  useEffect(() => {
    socket.emit("join-room", teamId);

    socket.on("message", ({ message, senderId, senderName, sentOn }) => {
      setMessages((prev) => [
        ...prev,
        { message, sender: { name: senderName, id: senderId }, sentOn },
      ]);
    });

    socket.on("set_link", ({ linkName, link }) => {
      setNewLinks((prev) => [...prev, { name: linkName, link }]);
    });

    socket.on("set_member", ({ memberName, memberId }) => {
      setNewMembers((prev) => prev.filter((m) => m.id !== memberId));
    });

    return () => {
      socket.off("join-room");
      socket.off("message");
      socket.off("set_link");
      socket.off("set_member");
    };
  }, [teamId]);

  // Add a new link
  const handleAddLink = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const linkName = data.get("linkName");
    const link = data.get("link");
    const linkData = {
      teamId,
      linkName,
      link,
    };
    socket.emit("set_link", linkData);
  };

  // Remove a member
  const handleRemoveMember = (member) => {
    socket.emit("set_member", { teamId, ...member });
  };

  // Scroll to the bottom whenever the messages change
  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {loading ? (
        <ChatLoader />
      ) : (
        teamData &&
        userDetails && (
          <>
            <div className="p-4 bg-bgPrimary border-b-[.1px] border-bgSecondary flex gap-2 items-center">
              <Link
                className="text-lg mr-2 max-[750px]:flex min-[750.1px]:hidden text-textPrimary"
                href="/profile/myTeams"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <CustomAvatar name={teamData.name} />
              <div className="ml-4">
                <h2 className="font-semibold text-textPrimary">
                  {teamData.name}
                </h2>
                <span className="text-sm text-gray-600 ml-2">
                  {`${newMembers.length} ${
                    newMembers.length === 1 ? "Member" : "Members"
                  }`}
                </span>
              </div>
              <span className="absolute right-0">
                <ChatNavigation
                  email={teamData.email}
                  userId={userDetails._id}
                  adminId={teamData.admin}
                  name={teamData.name}
                  description={teamData.description}
                  members={newMembers}
                  links={newLinks}
                  handleAddLink={handleAddLink}
                  handleRemoveMember={handleRemoveMember}
                />
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-bgSecondary">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.sender.id === userDetails._id
                      ? "justify-end"
                      : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      m.sender.id === userDetails._id
                        ? "bg-[#a600f0] text-white"
                        : "bg-textBgPrimary text-textPrimary"
                    }`}
                  >
                    <h2 className="text-sm font-semibold">{m.sender.name}</h2>
                    <p className="font-light">{m.message}</p>
                    <span className="text-[.6rem] text-blue-100 mt-1 block">
                      {m.sentOn}
                    </span>
                  </div>
                </div>
              ))}
              {/* Scroll to the bottom */}
              <div ref={msgEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-bgSecondary">
              <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="msg"
                  value={msg}
                  className="flex-1 px-4 py-2 border-2 rounded-lg bg-textBgPrimary text-textPrimary focus:outline-none"
                  placeholder="Type your message here..."
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#a600f0] text-white"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </>
        )
      )}
    </>
  );
};

export default TeamChat;
