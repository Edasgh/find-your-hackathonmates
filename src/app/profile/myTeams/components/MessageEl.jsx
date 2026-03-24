"use client";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fileFormat } from "@/lib/features";
import AttachmentEl from "../components/AttachmentEl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MessageEl = ({
  message,
  msgID,
  public_id,
  url,
  name,
  senderName,
  senderId,
  sentOn,
  teamId,
  userId,
  idx,
  over,
  setOver,
  handleDelMsg,
}) => {
  const sameSender = senderId === userId;

  const parts = useMemo(() => {
    const urlRegex = /(https:\/\/[^\s]+)/g;

    const split = message.split(urlRegex).filter(Boolean);

    return split.map((part) => ({
      text: part,
      isLink: /^https:\/\/[^\s]+$/.test(part),
    }));
  }, [message]);

 


  return (
    <div
      key={idx}
      className={`flex ${sameSender ? "justify-end" : "justify-start"} px-2 py-1 animate-[fadeIn_0.25s_ease] mb-4`}
    >
      <div
        className={`
          group relative max-w-[75%] px-4 py-2 rounded-2xl text-sm
          backdrop-blur-md transition-all duration-300
          ${
            sameSender
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md shadow-lg shadow-purple-500/20"
              : "bg-white/5 text-textPrimary border border-white/10 rounded-bl-md"
          }
        `}
      >
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xs font-semibold opacity-80">
            {sameSender ? "You" : senderName}
          </h2>
          <span
            className={`bg-slate-600 text-textPrimary px-2 py-1 text-xs rounded-md absolute top-[-1.5rem] right-[-.9rem] ${
              over === idx ? "visible" : "hidden"
            }`}
          >
            Delete
          </span>
          {sameSender && (
            <button
              className="lg:opacity-0 lg:group-hover:opacity-100
                transition-all duration-200
                hover:scale-110 active:scale-95"
              onMouseOver={() => {
                setOver(idx);
              }}
              onMouseOut={() => {
                setOver(false);
              }}
              onClick={() => {
                handleDelMsg({
                  msgId: msgID,
                  teamId: teamId,
                });
                setOver(false);
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-white/70 text-sm hover:text-red-800"
              />
            </button>
          )}
        </div>

        {/* Message Content */}
        <div className="leading-relaxed break-words space-y-1">
          {parts.map((part, i) =>
            part.isLink ? (
              <Link
                key={i}
                href={
                  part.text.startsWith("http")
                    ? part.text
                    : `https://${part.text}`
                }
                target="_blank"
                className="text-cyan-300 underline hover:text-cyan-200 break-all"
              >
                {part.text}
              </Link>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </div>

        {public_id !== "-1" && (
          <div>
            <Link href={url} target="_blank" download className="text-black">
              {AttachmentEl({
                file: fileFormat(name),
                fileUrl: url,
                fileName: name,
              })}
            </Link>
          </div>
        )}
        <span className={`block text-[.6rem] mt-2 opacity-60 text-right`}>
          {sentOn?.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default MessageEl;
