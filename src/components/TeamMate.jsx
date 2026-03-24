"use client";

import Link from "next/link";
import React, { useState } from "react";
import CustomAvatar from "./CustomAvatar";
import SkillsCloud from "./SkillsCloud";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import InviteToTeamModal from "./InviteToTeamModal";
import { timeDiff } from "@/lib/dateOperations";

const TeamMate = ({
  name,
  userId,
  bio,
  skills,
  githubID,
  email,
  index,
  country,
  joinedOn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <InviteToTeamModal
        open={openModal}
        setOpen={setOpenModal}
        userName={name}
        userId={userId}
        email={email}
      />

      <div
        key={index}
        className="
        group
        w-[20rem] min-h-[22rem] p-6
        rounded-2xl
        bg-gradient-to-br from-[#111827]/80 to-[#020617]/80
        backdrop-blur-lg
        border border-purple-500/20
        hover:border-purple-400/40
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
        flex flex-col gap-4
      "
      >
        {/* HEADER */}
        <div className="flex gap-3 items-center">
          <div className="ring-2 ring-purple-500/20 rounded-full p-[2px]">
            <CustomAvatar name={name} />
          </div>

          <div className="flex flex-col">
            <p className="text-white font-semibold text-lg leading-tight">
              {name}
            </p>

            <Link
              href={`mailTo:${email}`}
              className="text-gray-400 text-xs hover:text-purple-400 transition"
            >
              {email}
            </Link>
          </div>
        </div>

        {/* META */}
        {!isOpen && (
          <p className="text-gray-500 text-xs">
            {country} •{" "}
            <span className="italic font-mono">
              Joined {timeDiff(new Date(joinedOn), new Date())}
            </span>
          </p>
        )}

        {/* ACTION BUTTONS */}
        {!isOpen && (
          <div className="flex gap-3 mt-1">
            <Link href={`https://github.com/${githubID}`} target="_blank">
              <button
                className="
                flex items-center gap-2 text-xs px-3 py-1.5
                border border-gray-700 rounded-md
                text-gray-300 hover:text-white
                hover:border-purple-400
                transition
              "
              >
                <FontAwesomeIcon icon={faGithub} />
                Github
              </button>
            </Link>

            <button
              onClick={() => setOpenModal(true)}
              className="
                flex items-center gap-2 text-xs px-3 py-1.5
                bg-gradient-to-r from-purple-500 to-indigo-500
                text-white rounded-md
                hover:opacity-90
                transition
              "
            >
              <FontAwesomeIcon icon={faEnvelope} />
              Invite
            </button>
          </div>
        )}

        {/* BIO TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-purple-400 text-sm hover:underline mt-1 text-left"
        >
          {isOpen ? "Hide Bio" : "View Bio"}
        </button>

        {/* BIO */}
        {isOpen && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {bio || "No bio provided."}
          </p>
        )}

        {/* SKILLS */}
        {!isOpen && (
          <div className="mt-auto">
            <SkillsCloud skilsArr={skills} />
          </div>
        )}
      </div>
    </>
  );
};

export default TeamMate;
