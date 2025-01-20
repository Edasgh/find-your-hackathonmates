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

const ChooseFile = ({ open, setOpen, 
  // msg,handleSend

 }) => {
  return (
    <>
      {open == "open_list" ? (
        <>
          <div className="absolute bg-textBgPrimary text-textPrimary w-[10rem] h-fit py-3 px-2 rounded-md bottom-3 shadow-xl shadow-bgPrimary transition-all duration-75">
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
                onClick={()=>{
                  document.getElementById(`file-${type.name}`).click();
                }}
              >
                <FontAwesomeIcon icon={type.icon} className="text-2xl" />
                {type.name}
                <input
                className="hidden"
                  type="file"
                  id={`file-${type.name}`}
                  onChange={(e)=>{
                  console.log(e.target.value);
                  }}
                  accept={
                    type.name === "Image"
                      ? ".png,.jpg,.jpeg,.gif"
                      : type.name === "Audio"
                      ? ".mp3,.wav"
                      : type.name === "Video"
                      ? ".mp4,.webm,.ogg"
                      : ".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  }
                />
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
