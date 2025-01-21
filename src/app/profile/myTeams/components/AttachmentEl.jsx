"use client";
import { transformImage } from "@/lib/features";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AttachmentEl = ({ file, fileUrl }) => {
  switch (file) {
    case "video":
      return <video src={fileUrl} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={transformImage(fileUrl, 200)}
          alt="Attachment"
          width={"200px"}
          height={"150px"}
          style={{ objectFit: "contain" }}
        />
      );

    case "audio":
      return <audio src={fileUrl} preload="none" controls />;

    default:
      return (
        <div className="flex gap-2 justify-start items-center">
          <FontAwesomeIcon
            icon={faFileLines}
            className="text-3xl p-1 text-textPrimary"
          />
          <p className="text-textPrimary font-semibold text-lg">File</p>
        </div>
      );
  }
};

export default AttachmentEl;
