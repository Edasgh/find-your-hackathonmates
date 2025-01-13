import React from "react";

const LeaveAlert = ({ teamId, userId, teamName, open, setOpen, leaveTeam }) => {
  const handleLeaveTeam = async () => {
    setOpen(null);
    await leaveTeam();
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
        visibility: open === "leaveTeam" ? "visible" : "hidden",
        zIndex: open === "leaveTeam" ? "10000" : "-1",
      }}
      className="w-screen h-screen"
      suppressHydrationWarning
    >
      <div className="h-fit w-fit m-auto ">
        <div className="py-7 px-4 flex flex-col gap-4 justify-center items-center rounded-md bg-bgSecondary">
          <p className="text-textBgPrimaryHv font-medium max-[800px]:text-xl min-[800.1px]:text-2xl">
            Leave Team <span className="font-bold">"{teamName}"</span> ?
          </p>
          <div
            className="flex p-5 relative gap-3 flex-wrap"
            suppressHydrationWarning
          >
            <button
              onClick={handleLeaveTeam}
              className="w-fit border-[1px] text-sm text-textPrimary border-textBgPrimaryHv hover:bg-textBgPrimaryHv hover:text-black  px-5 py-3 rounded-md"
            >
              Leave
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

export default LeaveAlert;
