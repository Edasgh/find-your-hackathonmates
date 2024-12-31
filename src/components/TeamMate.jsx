"use client";

import Link from "next/link";
import React, { useState } from "react";

import CustomAvatar from "./CustomAvatar";
import SkillsCloud from "./SkillsCloud";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import InviteToTeamModal from "./InviteToTeamModal";

const TeamMate = ({ name, userId, bio, skills, githubID, email, index, country }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
    <InviteToTeamModal open={openModal} setOpen={setOpenModal} userName={name} userId={userId} email={email} />
    <div
      key={index}
      className=" max-[800px]:max-h-[25rem] min-[800.1px]:max-h-[28rem] min-h-[20rem] max-[800px]:w-[19rem] min-[800.1px]:w-[20rem] p-7 flex flex-col gap-3 justify-start items-start border-[1px] border-textSecondary rounded-2xl"
      >
      <div className="flex gap-3 justify-center items-center">
        <CustomAvatar name={name} />
        <div className="flex flex-col gap-1 justify-start items-start">
        <p
          className="text-textPrimary font-semibold text-lg"
          suppressHydrationWarning
          >
          {name}
        </p>
        <Link href={`mailTo:${email}`} className="text-textPrimary text-xs" suppressHydrationWarning>
          {email}
        </Link>
          </div>
      </div>
      <p
        className="text-textPrimary font-light text-xs"
        style={isOpen ? { display: "none" } : { display: "initial" }}
        suppressHydrationWarning
        >
        {country}
      </p>
      <div
        style={isOpen ? { display: "none" } : { display: "flex" }}
        className="flex flex-wrap gap-4"
        >
        <Link href={`https://github.com/${githubID}`} target="_blank">
          <button className="text-textPrimary flex gap-0 justify-center items-center text-xs px-2 py-1 rounded-md dashing-muted">
            <FontAwesomeIcon className="text-2xl" icon={faGithub} />
            &nbsp;&nbsp; Github
          </button>
        </Link>

        <button
          onClick={()=>{setOpenModal(true)}}
          title="Invite to your team"
          className="text-textPrimary flex gap-0 justify-center items-center text-xs px-2 py-1 rounded-md dashing-muted"
          >
          <FontAwesomeIcon
            className="text-2xl text-textPrimary"
            icon={faEnvelope}
            />
          &nbsp;&nbsp; Invite
        </button>
      </div>
      <p
        className="text-textSecondary font-light text-[.9rem] cursor-pointer text-center"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        >
        {isOpen ? "Hide" : "See"} Bio
      </p>
      <p
        style={isOpen ? { display: "initial" } : { display: "none" }}
        className="text-textBgPrimaryHv font-light text-xs"
        >
        {bio}
      </p>
      <div style={isOpen ? { display: "none" } : { display: "initial" }}>
        <SkillsCloud skilsArr={skills} />
      </div>
    </div>
        </>
  );
};

export default TeamMate;
