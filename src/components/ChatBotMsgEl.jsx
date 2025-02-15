import React from "react";
import { AIAvatar, UserAvatar } from "./ChatBot";

const ChatBotMsgEl = ({ index, message, sender, botMessages }) => {
  return (
    <div
      key={index}
      className={`flex ${
        sender === "AI"
          ? "justify-start text-gray-200"
          : "justify-end text-gray-400"
      } gap-3 my-4 ${index === botMessages.length - 1 && "mb-16"}
                     text-sm flex-1`}
    >
      {sender === "AI" ? <AIAvatar /> : <UserAvatar />}
      <p
        className={`${
          sender === "AI"
            ? "max-w-[12rem] bg-textBgPrimary"
            : "max-w-[8rem] bg-indigo-900"
        } font-light rounded-lg p-2`}
        suppressHydrationWarning
      >
        <span
          className={`block font-bold 
                         text-gray-200
                        `}
        >
          {sender === "AI" ? "DevBot" : "You"}
        </span>
        <span className="block whitespace-pre-wrap break-words">{message}</span>
      </p>
    </div>
  );
};

export default ChatBotMsgEl;
