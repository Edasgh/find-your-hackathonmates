"use client";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { ProfileEl } from "./ProfileEl";
import TeamEl from "./TeamEl";

const AlertEl = ({ index, r, handleAccept, handleReject }) => {
  const [over1, setOver1] = useState(false);
  const [over2, setOver2] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  return (
    <div
      key={index}
      className="bg-textPrimary flex flex-wrap justify-center items-center gap-2 px-5 py-8 rounded-lg w-fit"
      suppressHydrationWarning
    >
      {r.message.includes("invited you to join") ? (
        <div
          className="text-textBgPrimary text-[1rem]"
          suppressHydrationWarning
        >
          <span
            className={`${
              openProfile
                ? "cursor-default"
                : "font-bold cursor-pointer hover:underline"
            }`}
            onClick={() => {
              setOpenProfile(!openProfile);
            }}
          >
            {r.sender.name}
            <ProfileEl
              userId={r.sender.id}
              open={openProfile}
              setOpen={setOpenProfile}
            />
          </span>{" "}
          invited you to join the team{" "}
          <span
            className={`${
              openTeam
                ? "cursor-default"
                : "font-bold cursor-pointer hover:underline"
            }`}
            onClick={() => {
              setOpenTeam(!openTeam);
            }}
          >
            {r.team.name}
            <TeamEl teamId={r.team.id} open={openTeam} />
          </span>
        </div>
      ) : (
        <div
          className="text-textBgPrimary text-[1rem]"
          suppressHydrationWarning
        >
          <span
            className={`${
              openProfile
                ? "cursor-default"
                : "font-bold cursor-pointer hover:underline"
            }`}
            onClick={() => {
              setOpenProfile(!openProfile);
            }}
          >
            {r.sender.name}
            <ProfileEl
              userId={r.sender.id}
              open={openProfile}
              setOpen={setOpenProfile}
            />
          </span>{" "}
          sent a request to join your team{" "}
          <span
            className={`${
              openTeam
                ? "cursor-default"
                : "font-bold cursor-pointer hover:underline"
            }`}
            onClick={() => {
              setOpenTeam(!openTeam);
            }}
          >
            {r.team.name}
            <TeamEl teamId={r.team.id} open={openTeam} />
          </span>
        </div>
      )}
      <div className="relative flex flex-wrap gap-2">
        <button
          className="px-2 py-0.5 rounded-md hover:bg-gray-300"
          onMouseOver={() => {
            setOver1(true);
          }}
          onMouseOut={() => {
            setOver1(false);
          }}
          onClick={() =>
            handleAccept(
              r.message,
              r.sender.name,
              r.sender.id,
              r.team.id,
              r.reciever.name,
              r.reciever.id,
              r._id
            )
          }
        >
          <FontAwesomeIcon className="text-green-700" icon={faCheck} />
        </button>
        <span
          className={`bg-slate-500 text-textPrimary px-2 py-1 text-sm rounded-md absolute bottom-10 ${
            over1 ? "flex" : "hidden"
          } `}
        >
          Accept
        </span>
        <button
          className="px-2 py-0.5 rounded-md hover:bg-gray-300"
          onMouseOver={() => {
            setOver2(true);
          }}
          onMouseOut={() => {
            setOver2(false);
          }}
          onClick={() => handleReject(r._id)}
        >
          <FontAwesomeIcon className="text-red-700" icon={faXmark} />
        </button>
        <span
          className={`bg-slate-500 text-textPrimary px-2 py-1 text-sm rounded-md absolute bottom-10 ${
            over2 ? "flex" : "hidden"
          } `}
        >
          Reject
        </span>
      </div>
    </div>
  );
};

export default AlertEl;
