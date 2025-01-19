import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faFileAudio, faFileVideo, faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const fileTypes = [
  { name: "Image", icon: faImage },
  { name: "Audio", icon: faFileAudio },
  { name: "Video", icon: faFileVideo },
  { name: "File", icon: faFileLines },
];

const ChooseFile = ({ open, setOpen }) => {
  return (
    <>
      {open == "open_list" ? (
        <>
          <div className="absolute bg-textBgPrimary text-textPrimary w-[10rem] h-fit py-3 px-2 rounded-md bottom-3 shadow-md shadow-bgPrimary transition-all duration-75">
            <div className="w-full flex justify-between items-center">
              <span></span>
              <button
                onClick={() => {
                  setOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="text-xl" />
              </button>
            </div>
            {fileTypes.map((type, index) => (
              <button
                key={index}
                className="hover:bg-bgSecondary flex gap-5 p-2 cursor-pointer rounded-md w-full"
              >
                <FontAwesomeIcon icon={type.icon} className="text-2xl" />
                {type.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChooseFile;
