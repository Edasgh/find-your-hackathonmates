import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fileFormat } from "@/lib/features";
import AttachmentEl from "../components/AttachmentEl";

const MessageEl = ({
  message,
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
        {/* {attachments.length>0 && attachments.map((attachment,index)=>{
                const fileUrl = attachment.url;
                const file = fileFormat(fileUrl);
                return(
                  <div>
                    <Link href={fileUrl} target="_blank" download className="text-black">
                     {AttachmentEl({file,fileUrl})}
                    </Link>
                  </div>
                )

              })} */}
        <span className="text-[.6rem] text-blue-100 mt-1 block">{sentOn}</span>
      </div>
    </div>
  );
};

export default MessageEl;
