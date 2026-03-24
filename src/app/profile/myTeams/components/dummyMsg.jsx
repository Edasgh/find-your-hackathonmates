const sameSender = senderId === userId;

// 🔥 Better URL detection (handles multiple links)
const parts = useMemo(() => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]+)/g;

  const split = message.split(urlRegex).filter(Boolean);

  return split.map((part) => ({
    text: part,
    isLink: urlRegex.test(part),
  }));
}, [message]);

return (
  <div
    key={idx}
    className={`flex ${
      sameSender ? "justify-end" : "justify-start"
    } px-2 py-1 animate-[fadeIn_0.25s_ease]`}
  >
    <div
      className={`
          group relative max-w-[75%] px-4 py-2 rounded-2xl text-sm
          backdrop-blur-md transition-all duration-300
          ${
            sameSender
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md shadow-lg shadow-purple-500/20"
              : "bg-white/5 text-textPrimary border border-white/10 rounded-bl-md"
          }
        `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xs font-semibold opacity-80">
          {sameSender ? "You" : senderName}
        </h2>

        {/* Delete Button (Clean Hover UX) */}
        {sameSender && (
          <button
            onClick={() => handleDelMsg({ msgId: msgID, teamId })}
            className="
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                hover:scale-110 active:scale-95
              "
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-xs text-white/70 hover:text-red-400"
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

      {/* Attachment */}
      {public_id !== "-1" && (
        <div className="mt-2">
          <Link href={url} target="_blank" download>
            {AttachmentEl({
              file: fileFormat(name),
              fileUrl: url,
              fileName: name,
            })}
          </Link>
        </div>
      )}

      {/* Timestamp */}
      <span className="block text-[10px] mt-2 opacity-60 text-right">
        {sentOn?.toUpperCase()}
      </span>
    </div>
  </div>
);
