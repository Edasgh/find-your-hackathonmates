"use client";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fileFormat } from "@/lib/features";
import AttachmentEl from "../components/AttachmentEl";
import Link from "next/link";
import { useEffect, useState } from "react";

const MessageEl = ({
  message,
  public_id,
  url,
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
  const msgParts = message.split(" ");

  const [urlIndex,setUrlIndex] = useState(-1);

   const isValidUrl = (urlString) => {
     var urlPattern = new RegExp(
       "^(https?:\\/\\/)?" + // validate protocol
         "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
         "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
         "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
         "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
         "(\\#[-a-z\\d_]*)?$",
       "i"
     ); // validate fragment locator
     return !!urlPattern.test(urlString);
   };

  useEffect(()=>{
    msgParts.map((e) => {
      if (isValidUrl(e)) {
        setUrlIndex(msgParts.indexOf(e));
      }
    });
  },[])


  return (
    <div
      key={idx}
      className={`flex ${sameSender ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[250px] rounded-lg p-3 box-decoration-slice ${
          sameSender
            ? "bg-[#a600f0] text-white"
            : "bg-textBgPrimary text-textPrimary"
        }`}
      >
        <div className="flex gap-5 justify-between items-center relative">
          {sameSender ? (
            <h2 className="text-sm font-semibold">You</h2>
          ) : (
            <h2 className="text-sm font-semibold">{senderName}</h2>
          )}
          <span
            className={`bg-slate-600 text-textPrimary px-2 py-1 text-xs rounded-md absolute top-[-1.5rem] right-[-.9rem] ${
              over === idx ? "visible" : "hidden"
            }`}
          >
            Delete
          </span>
          {sameSender && (
            <button
              onMouseOver={() => {
                setOver(idx);
              }}
              onMouseOut={() => {
                setOver(false);
              }}
              onClick={() => {
                handleDelMsg({
                  msg: message,
                  public_id,
                  url,
                  teamId: teamId,
                  sentOn: sentOn,
                  senderId: senderId,
                  senderName: senderName,
                });
                setOver(false);
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-white text-sm hover:text-red-800"
              />
            </button>
          )}
        </div>
        {urlIndex === -1 ? (
          <span className="font-light block whitespace-pre-wrap">
            {message}
          </span>
        ) : (
          <>
            <span className="font-light block whitespace-pre-wrap">
              {message.slice(0, message.indexOf(msgParts[urlIndex]))}
            </span>
            <Link
              className="text-cyan-300 underline block break-words"
              href={msgParts[urlIndex]}
              target="_blank"
            >
              {msgParts[urlIndex]}
            </Link>
            <span className="font-light block whitespace-pre-wrap">
              {message.slice(
                message.indexOf(msgParts[urlIndex]) + msgParts[urlIndex].length
              )}
            </span>
          </>
        )}

        {public_id !== "-1" && (
          <div>
            <Link href={url} target="_blank" download className="text-black">
              {AttachmentEl({ file: fileFormat(url), fileUrl: url })}
            </Link>
          </div>
        )}
        <span className="text-[.6rem] text-blue-100 mt-1 block">{sentOn}</span>
      </div>
    </div>
  );
};

export default MessageEl;
