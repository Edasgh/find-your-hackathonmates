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
      return <FontAwesomeIcon icon={faFileLines} className="text-2xl" />;
  }
};

export default AttachmentEl;
