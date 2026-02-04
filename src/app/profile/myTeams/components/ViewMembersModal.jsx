"use client";

import { faCircleMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { ProfileEl } from "../../joinRequests/components/ProfileEl";

const DeleteMemberAlert = ({
  memberName,
  open,
  setOpen,
  memberId,
  handleRemoveMember,
}) => {
  const handleRemove = async () => {
    setOpen(null);
    await handleRemoveMember({ memberName, memberId });
  };
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        background: " #0a0b0cba",
        display: "grid",
        placeItems: "center",
        visibility: open === "removeMember" ? "visible" : "hidden",
        zIndex: open === "removeMember" ? "10000" : "-1",
      }}
      className="w-screen h-screen"
      suppressHydrationWarning
    >
      <div className="h-fit w-fit m-auto ">
        <div className="py-7 px-4 flex flex-col gap-4 justify-center items-center rounded-md bg-bgSecondary">
          <p className="text-textBgPrimaryHv font-medium max-[800px]:text-xl min-[800.1px]:text-2xl">
            Are you sure to remove member{" "}
            <span className="font-bold">"{memberName}"</span> ?
          </p>
          <div
            className="flex p-5 relative gap-3 flex-wrap"
            suppressHydrationWarning
          >
            <button
              onClick={handleRemove}
              className="w-fit border-[1px] text-sm text-textPrimary border-textBgPrimaryHv hover:bg-textBgPrimaryHv hover:text-black  px-5 py-3 rounded-md"
            >
              Remove
            </button>

            <button
              onClick={() => {
                setOpen(null);
              }}
              className="w-fit border-[1px] text-sm border-textBgPrimaryHv bg-textBgPrimaryHv text-black  px-5 py-3 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewMembersModal = ({
  members,
  userId,
  isAdmin,
  open,
  setOpen,
  handleRemoveMember,
}) => {
  const handleClose = () => {
    setOpen(null);
  };

  const [openRemoveMemberModal, setOpenRemoveMemberModal] = useState(null);
  const [openProfileId, setOpenProfileId] = useState(null); // For controlling which ProfileEl is open

  const toggleProfile = (memberId) => {
    setOpenProfileId((prevId) => (prevId === memberId ? null : memberId)); // Toggle the profile view
  };
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
        visibility: open === "members" ? "visible" : "hidden",
        zIndex: open === "members" ? "100" : "-1",
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
        {open === "members" && (
          <>
            {members.length !== 0 &&
              members.map((m, i) => (
                <div
                  key={i}
                  className="flex relative w-full gap-2 justify-between cursor-pointer p-2 items-center hover:bg-textBgPrimary text-textPrimary"
                >
                  <div
                    className="text-lg hover:underline"
                    onClick={() => toggleProfile(m.id)}
                  >
                    <p>{m.name}</p>
                    <ProfileEl open={openProfileId === m.id} userId={m.id} />
                  </div>
                  {isAdmin && (
                    <>
                      {userId !== m.id && (
                        <>
                          <FontAwesomeIcon
                            className="text-red-700 text-xl cursor-pointer"
                            icon={faCircleMinus}
                            onClick={() => {
                              setOpenRemoveMemberModal("removeMember");
                            }}
                          />

                          <DeleteMemberAlert
                            memberName={m.name}
                            memberId={m.id}
                            open={openRemoveMemberModal}
                            setOpen={setOpenRemoveMemberModal}
                            handleRemoveMember={handleRemoveMember}
                          />
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
