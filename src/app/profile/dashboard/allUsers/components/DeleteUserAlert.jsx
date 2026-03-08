"use client";

import React from "react";

export const DeleteUserAlert = ({
  userId,
  userName,
  open,
  setOpen,
  deleteUser,
}) => {
  const handleDelUser = async () => {
    setOpen();
    await deleteUser(userId);
  };

  if (!userId || !userName || userId === null || userName === null) {
    return <></>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        background: " #0a0b0cba",
        display: "grid",
        placeItems: "center",
        visibility: open ? "visible" : "hidden",
        zIndex: open ? "10000" : "-1",
      }}
      className="w-screen h-screen"
      suppressHydrationWarning
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-fit w-fit m-auto ">
        <div className="py-7 px-4 flex flex-col gap-4 justify-center items-center rounded-md bg-bgSecondary">
          <p className="text-textBgPrimaryHv font-medium max-[800px]:text-xl min-[800.1px]:text-2xl">
            Are you sure to delete user :{" "}
            <span className="font-bold">"{userName}"</span> ?
          </p>
          <div
            className="flex p-5 relative gap-3 flex-wrap"
            suppressHydrationWarning
          >
            <span
              onClick={handleDelUser}
              className="w-fit border-[1px] text-sm text-textPrimary border-textBgPrimaryHv hover:bg-textBgPrimaryHv hover:text-black  px-5 py-3 rounded-md"
              suppressHydrationWarning
              suppressContentEditableWarning
            >
              Delete
            </span>

            <span
              onClick={setOpen}
              className="w-fit border-[1px] text-sm border-textBgPrimaryHv bg-textBgPrimaryHv text-black  px-5 py-3 rounded-md"
              suppressHydrationWarning
              suppressContentEditableWarning
            >
              Cancel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
