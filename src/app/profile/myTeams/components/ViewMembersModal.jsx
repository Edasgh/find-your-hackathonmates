"use client";

import { faCircleMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const ViewMembersModal = ({
  members,
  userId,
  isAdmin,
  open,
  setOpen,
  handleRemoveMember
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [over1, setOver1] = useState(false);
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: " #0a0b0cba",
        display: "grid",
        placeItems: "center",
        visibility: open ? "visible" : "hidden",
        zIndex: open ? "100" : "-1",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          borderRadius: "0.4rem",
        }}
        className="bg-bgPrimary gap-3 text-textPrimary p-5 w-fit"
      >
        <div className="flex justify-between items-center w-[15rem]">
          <h1 className="text-textPrimary font-semibold text-2xl mb-3">
            {" "}
            &nbsp; {members.length} &nbsp;
            {members.length === 1 ? "Member" : "Members"}
            &nbsp;&nbsp;
          </h1>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl cursor-pointer"
            onClick={handleClose}
          />
        </div>
        {open == true && (
          <>
            {members.length !== 0 &&
              members.map((m, i) => (
                <div
                  key={i}
                  className="flex relative w-full gap-2 justify-between cursor-pointer p-2 items-center hover:bg-textBgPrimary text-textPrimary"
                >
                  <p className="text-lg">{m.name}</p>
                  {isAdmin && (
                    <>
                      {userId !== m.id && (
                        <>
                          <FontAwesomeIcon
                            className="text-red-700 text-xl cursor-pointer"
                            onMouseOver={() => {
                              setOver1(true);
                            }}
                            onMouseOut={() => {
                              setOver1(false);
                            }}
                            icon={faCircleMinus}
                            onClick={() =>
                              handleRemoveMember({
                                memberName: m.name,
                                memberId: m.id,
                              })
                            }
                          />
                          <span
                            className={`bg-slate-500 text-textPrimary px-2 py-1 text-sm rounded-md absolute bottom-10 right-0 ${
                              over1 ? "flex" : "hidden"
                            } `}
                          >
                            Remove
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewMembersModal;
