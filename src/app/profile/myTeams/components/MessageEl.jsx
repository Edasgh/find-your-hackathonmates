import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fileFormat } from "@/lib/features";
import AttachmentEl from "../components/AttachmentEl";
import Link from "next/link";

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
  return (
    <div
      key={idx}
      className={`flex ${sameSender ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
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
                className="text-white text-sm"
              />
            </button>
          )}
        </div>
        <p className="font-light">{message}</p>
        {public_id !== "-1" && (
          <div>
            <Link
              href={url}
              target="_blank"
              download
              className="text-black"
            >
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
