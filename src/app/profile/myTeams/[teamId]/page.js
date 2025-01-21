"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useChat from "@/hooks/useChat";
import ChatLoader from "../components/ChatLoader";
import CustomAvatar from "@/components/CustomAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faLink,
  faPaperPlane,
  faFileAudio,
  faFileVideo,
  faImage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import ChatNavigation from "../components/ChatNavigation";
import { socket } from "@/lib/socket";
import { getDate } from "@/lib/getDate";
import { useCreds } from "@/hooks/useCreds";
import MessageEl from "../components/MessageEl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fileTypes = [
  { name: "Image", icon: faImage },
  { name: "Audio", icon: faFileAudio },
  { name: "Video", icon: faFileVideo },
  { name: "File", icon: faFileLines },
];

const urlRegex = /^(https?:\/\/[^\s< >\{\}\[\]]+)$/;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  const [over, setOver] = useState(false);

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

  const uploadFile = async (file, fileName) => {
    let tId = toast.loading("Sending...");
    if (!file || file.size > MAX_FILE_SIZE) {
      toast.update(tId, {
        render: "Can't upload!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
      const res = await fetch("/api/getAttachmentUrl", {
        method: "POST",
        body: formData,
      });
      setOver(false);
      if (res.ok) {
        toast.update(tId, {
          render: `${fileName} Sent!`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        const data = await res.json();
        const obj = {
          message: msg,
          attachment: { public_id: data.public_id, url: data.url },
          sender: { name: userDetails.name, id: userDetails._id },
          sentOn: currentTimeStamp,
        };
        console.log(obj);
         setMessages((prev) => [...prev, obj]);
          socket.emit("message", {
            roomId: teamId,
            message: obj.message,
            public_id: obj.attachment.public_id,
            url: obj.attachment.url,
            senderId: userDetails._id,
            senderName: userDetails.name,
            sentOn: obj.sentOn,
          });
      } else {
        throw new Error("Can't upload file!");
      }
    } catch (error) {
      toast.update(tId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const newMessage = {
      message: msg,
      attachment: {
        public_id:"-1",
        url:""
      },
      sender: { name: userDetails.name, id: userDetails._id },
      sentOn: currentTimeStamp,
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("message", {
      roomId: teamId,
      message: msg,
      public_id: "-1",
      url: "",
      senderId: userDetails._id,
      senderName: userDetails.name,
      sentOn: currentTimeStamp,
    });

    setMsg("");
  };

  const handleDelMsg = ({
    msg,
    public_id,
    url,
    sentOn,
    senderId,
    senderName,
  }) => {
    socket.emit("remove-msg", {
      roomId: teamId,
      message: msg,
      public_id,
      url,
      senderId,
      senderName,
      sentOn,
    });
  };

  useEffect(() => {
    socket.emit("join-room", teamId);

    socket.on(
      "message",
      ({ message, public_id, url, senderId, senderName, sentOn }) => {
        setMessages((prev) => [
          ...prev,
          {
            message,
            attachment: { public_id, url },
            sender: { name: senderName, id: senderId },
            sentOn,
          },
        ]);
      }
    );

    socket.on("remove-msg", ({ data }) => {
      setMessages([...data]);
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
      socket.off("remove-msg");
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
    if (linkName.includes("https://") || !urlRegex.test(link)) {
      console.log("error");
    } else socket.emit("set_link", linkData);
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
            <ToastContainer position="bottom-center" theme="dark" />
            {over == "open_list" && (
              <>
                <form className="absolute bg-textBgPrimary text-textPrimary w-[10rem] h-fit py-3 px-2 rounded-md -bottom-24 z-40 shadow-xl shadow-bgPrimary transition-all duration-75">
                  <div className="w-full flex justify-between items-center">
                    <span></span>
                    <button
                      onClick={() => {
                        setOver(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-xl" />
                    </button>
                  </div>
                  {fileTypes.map((type, index) => (
                    <button
                      type="button"
                      key={index}
                      className="hover:bg-bgSecondary flex gap-5 p-2 cursor-pointer rounded-md w-full"
                      onClick={(e) => {
                        document.getElementById(`file-${type.name}`).click();
                      }}
                    >
                      <FontAwesomeIcon icon={type.icon} className="text-2xl" />
                      {type.name}
                      <input
                        className="hidden"
                        type="file"
                        id={`file-${type.name}`}
                        onChange={(e) =>
                          uploadFile(e.target.files[0], type.name)
                        }
                        accept={
                          type.name === "Image"
                            ? ".png,.jpg,.jpeg,.gif"
                            : type.name === "Audio"
                            ? ".mp3,.wav"
                            : type.name === "Video"
                            ? ".mp4,.webm,.ogg"
                            : ".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        }
                        maxLength={1}
                      />
                    </button>
                  ))}
                </form>
              </>
            )}
            <div className="p-3 bg-bgPrimary border-b-[.1px] border-bgSecondary flex gap-2 items-center">
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
                  userName={userDetails.name}
                  userId={userDetails._id}
                  hkNm={teamData.hackathonName}
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
                <MessageEl
                  idx={idx}
                  key={idx}
                  message={m.message}
                  public_id={m.attachment.public_id}
                  url={m.attachment.url}
                  //attachments = {m.attachments}
                  over={over}
                  setOver={setOver}
                  senderId={m.sender.id}
                  senderName={m.sender.name}
                  sentOn={m.sentOn}
                  teamId={teamId}
                  userId={userDetails._id}
                  handleDelMsg={handleDelMsg}
                />
              ))}

              {/* Scroll to the bottom */}
              <div ref={msgEndRef} />
            </div>

            {/* Message Input */}
            <div className="py-4 px-6 bg-bgSecondary relative">
              <form className="flex gap-1.5" onSubmit={handleSubmit}>
                <button
                  className="bg-textBgPrimary p-2 rounded-md"
                  style={{ border: "none", outline: "none" }}
                  type="button"
                  onClick={() => {
                    setOver("open_list");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    className="text-2xl text-textPrimary rotate-[120deg]"
                  />
                </button>

                <input
                  type="text"
                  name="msg"
                  value={msg}
                  className="flex-1 px-4 py-2 border-2 rounded-lg bg-textBgPrimary text-textPrimary focus:outline-none"
                  placeholder="Type your message here..."
                  autoComplete="off"
                  style={{ border: "none", outline: "none" }}
                  onChange={(e) => setMsg(e.target.value)}
                  onFocus={() => {
                    if (over === "open_list") {
                      setOver(false);
                    }
                  }}
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#a600f0] text-white text-2xl"
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
