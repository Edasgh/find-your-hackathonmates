"use client";

import { chat } from "@/lib/geminiConfig";
import {
  faBars,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const AIAvatar = () => {
  return (
    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
      <div className="rounded-full bg-gray-100 border p-1">
        <svg
          stroke="none"
          fill="black"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          ></path>
        </svg>
      </div>
    </span>
  );
};

const UserAvatar = () => {
  return (
    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
      <div className="rounded-full bg-gray-100 border p-1">
        <svg
          stroke="none"
          fill="black"
          strokeWidth="0"
          viewBox="0 0 16 16"
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
        </svg>
      </div>
    </span>
  );
};

const ChatLoaderComp = ({color}) => {
  return (
    <span className="flex gap-1 mt-4" suppressHydrationWarning>
      <span
        className={`h-2 w-2 ${color} rounded-full animate-bounce [animation-delay:-0.3s]`}
      ></span>
      <span
        className={`h-2 w-2 ${color} rounded-full animate-bounce [animation-delay:-0.15s]`}
      ></span>
      <span
        className={`h-2 w-2 ${color} rounded-full animate-bounce`}
      ></span>
    </span>
  );
};

const uiTooltips = [
  {
    title: "Find Teams",
    link: "/teams",
  },
  {
    title: "Find Team mates",
    link: "/teamMates",
  },
  {
    title: "Create new Team",
    link: "/createTeam",
  },
  {
    title: "View Your Profile",
    link: "/profile",
  },
];

const ChatBotUI = ({}) => {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const [botMsg, setBotMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [botNotifHide,setBotNotifHide] = useState(false);
  const endRef = useRef(null);
  const [botMessages, setBotMessages] = useState([
    {
      sender: "AI",
      message: "Hi I'm DevBot,how can I help you today?",
    },
  ]);

  const sendMsg = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("botMsg");

    if (message.trim() === "") return;

    const msgObj = {
      sender: "You",
      message: message,
    };

    const loadingObj = {
      sender: "AI",
      message: <ChatLoaderComp color={"bg-gray-400"} />,
    };
    setBotMessages((prev) => [...prev, msgObj]);
    setTimeout(() => {
      setBotMessages((prev) => [...prev, loadingObj]);
    }, 900);
    setBotMsg("");
    setHide(true);
    setTimeout(async() => {
      const result = await chat.sendMessage(message);
    const botMsg = result.response.text().split("\n");
    for (const msg of botMsg) {
      if (msg.trim() !== "") {
        const botMsgObj = {
          sender: "AI",
          message: msg,
        };
        setBotMessages((prev) => [...prev, botMsgObj]);
      }
    }
    setBotMessages((prevMessages) => {
      return prevMessages.filter(
        (e) =>
          !(e.sender === loadingObj.sender && e.message === loadingObj.message)
      );
    });
    }, 1800);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }, []);

  useEffect(() => {
    if (open === true) {
      setTimeout(() => {
        if (endRef.current) {
          endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 100);
    }
  }, [botMessages, open]);

  return (
    <>
      {/* <!-- component --> */}
      <div className="fixed bottom-4 right-4">
        {!botNotifHide && (
          <span className="imessage">
            <span
              className={`from-bot left-[-46px] shadow-black shadow-2xl bottom-[2px] ${
                loading ? "w-[8rem]" : "max-w-[10rem] text-[.99rem]"
              }`}
            >
              {loading ? (
                <ChatLoaderComp color={"bg-gray-100"} />
              ) : (
                `${botMessages[0].message}`
              )}
            </span>
          </span>
        )}
        <button
          className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium  border rounded-full w-16 h-16 bg-blue-800 hover:bg-blue-900 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case outline-none leading-5 hover:text-gray-900"
          type="button"
          onClick={() => {
            setOpen(!open);
            setBotNotifHide(true);
          }}
        >
          <svg
            xmlns=" http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path
              d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
              className="border-gray-200"
            ></path>
          </svg>
        </button>
      </div>

      {open && (
        <div
          style={{
            boxShadow: " 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
            zIndex: "99999999999999999999999999999999999999",
          }}
          className="fixed overflow-y-auto bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-bgPrimary p-6 rounded-lg border-[1px] border-black shadow-black shadow-xl  max-w-[440px] h-[634px]"
        >
          {/* <!-- Heading --> */}
          <div
            className="flex w-full justify-between items-center sticky -top-6 py-3 px-1 bg-bgPrimary"
            style={{
              zIndex: "9999999",
            }}
          >
            <h2 className="font-semibold text-xl border-none text-textPrimary tracking-tight">
              DevBot
              <span className="text-2xl">🛠️</span>
            </h2>
          </div>

          {/* <!-- Chat Container --> */}
          <div
            className="pr-4 h-[474px] overflow-y-auto flex flex-col gap-10 chat-container"
            style={{
              minWidth: "100%",
              display: "table",
              overflowY: "auto",
            }}
          >
            {botMessages.length !== 0 &&
              botMessages.map((e, index) => (
                <div
                  key={index}
                  className={`flex ${
                    e.sender === "AI"
                      ? "justify-start text-gray-200"
                      : "justify-end text-gray-400"
                  } gap-3 my-4 ${index === botMessages.length - 1 && "mb-16"}
                   text-sm flex-1`}
                >
                  {e.sender === "AI" ? <AIAvatar /> : <UserAvatar />}
                  <p
                    className={`${
                      e.sender === "AI"
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
                      {e.sender === "AI" ? "DevBot" : "You"}
                    </span>
                    {e.message}
                  </p>
                </div>
              ))}
            {/* Scroll to the bottom */}
            <div ref={endRef} />
          </div>

          <div className="sticky bottom-0 bg-bgPrimary z-40">
            {/* Tooltips container */}
            {!hide && (
              <div
                className={
                  "max-w-[17rem] absolute bottom-[8px] h-auto mb-4 text-xs bg-bgPrimary py-5 px-2 text-textPrimary flex gap-2 flex-wrap"
                }
              >
                {uiTooltips.map((e, index) => (
                  <Link
                    className="py-1 rounded-xl px-4 bg-[#a600f0]"
                    key={index}
                    href={e.link}
                  >
                    {e.title}
                  </Link>
                ))}
              </div>
            )}
            {/* <!-- Input box  --> */}
            <div className="flex gap-2 w-[17rem] absolute bottom-[-24px] bg-bgPrimary m-0 items-center justify-start pt-1">
              <FontAwesomeIcon
                className="text-textPrimary cursor-pointer text-xl"
                icon={hide ? faBars : faXmark}
                onClick={() => {
                  setHide(!hide);
                }}
              />
              <form
                className="flex items-center justify-center w-full space-x-2"
                onSubmit={(e) => sendMsg(e)}
              >
                <input
                  className="flex h-10 w-full bg-bgSecondary rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] outline-none disabled:cursor-not-allowed disabled:opacity-50 text-textPrimary focus-visible:ring-offset-2"
                  placeholder="Ask me anything...."
                  id="botMsg"
                  name="botMsg"
                  value={botMsg}
                  onChange={(e) => {
                    setBotMsg(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-900 text-white text-xl  border-none outline-none"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotUI;
