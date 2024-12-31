"use client";
import { useCreds } from "@/hooks/useCreds";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useLayoutEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InviteToTeamModal = ({ open, setOpen, userId, userName, email }) => {
  const { user, isLoading, error } = useCreds();
  const [loading, setLoading] = useState(isLoading);
  const [myTeams, setMyTeams] = useState([]);

  const getMyTeams = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/profile/myTeams?id=${user._id}`);
      const data = await resp.json();
      if (resp.status === 200) {
        setMyTeams([...data]);
        setLoading(false);
      } else {
        throw new Error("No teams found!");
      }
    } catch (error) {
      console.log(error);
      setMyTeams([]);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (!isLoading && user) {
      getMyTeams();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    handleClose();
    let tId = toast.loading("Sending Invitation...");
    const data = new FormData(e.target);
    const team = JSON.parse(data.get("team"));
    const invitationData = {
      senderName: user.name,
      senderId: user._id,
      teamName: team.name,
      teamId: team.id,
      recieverName: userName,
      recieverId: userId,
      email: email,
    };
    try {
      const sendInvite = await fetch("/api/invite", {
        method: "POST",
        body: JSON.stringify(invitationData),
      });

      if (sendInvite.status === 200) {
        toast.update(tId, {
          render: "Invite Sent!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      } else if (sendInvite.status === 403) {
        throw new Error("Already a member of the team!");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.update(tId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      {!loading && myTeams.length !== 0 ? (
        <>
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
              zIndex: open ? "10000" : "-1",
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
              className="bg-bgPrimary gap-3 text-textPrimary p-5 w-[20rem]"
            >
              <div className="flex gap-2 justify-between items-center w-full">
                <h1 className="text-2xl font-semibold text-center">
                  Invite to Team
                </h1>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-xl cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <form
                className="flex flex-col gap-3 mt-5 w-full"
                onSubmit={handleInvite}
              >
                <label htmlFor="team">Select Team</label>
                <select
                  name="team"
                  id="team"
                  className="p-2 border bg-bgPrimary cursor-pointer text-textPrimary rounded-md"
                >
                  {myTeams.map((team, index) => (
                    <option
                      key={index}
                      value={JSON.stringify({
                        name: team.name,
                        id: team._id,
                      })}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                >
                  Invite
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
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
            zIndex: open ? "10000" : "-1",
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
            className="bg-bgPrimary gap-3 text-textPrimary p-5 w-[20rem]"
          >
            <div className="flex gap-2 justify-between items-center w-full">
              <h1 className="text-2xl font-semibold text-center">
                Invite to Team
              </h1>
              <FontAwesomeIcon
                icon={faXmark}
                className="text-xl cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <div className="flex flex-col gap-3 mt-5 w-full">
              <p className="text-gray-500">No teams found!</p>
              <Link
                href="/createTeam"
                className="text-sm text-blue-700 hover:underline"
              >
                Create a Team Here &gt; &gt;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteToTeamModal;
