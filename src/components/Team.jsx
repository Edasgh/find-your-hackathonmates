"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleCheck,
  faCircleNotch,
  faEnvelope,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import CustomAvatar from "./CustomAvatar";
import SkillsCloud from "./SkillsCloud";

import { useCreds } from "@/hooks/useCreds";
import { socket } from "@/lib/socket";
import { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Team({
  id,
  name,
  hkNm,
  desc,
  skills,
  members,
  githubLink,
  admin,
  email,
  index,
}) {
  const [loading, setLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const { user, isLoading, error } = useCreds();

  const cleanedSkills = [
    ...new Set(
      skills
        .map((skill) => skill.trim().toLowerCase())
        .filter((skill) => skill !== ""),
    ),
  ];

  const handleApply = async () => {
    setLoading(true);

    const data = {
      teamName: name,
      teamId: id,
      recieverId: admin,
      teamEmail: email,
      myId: user._id,
      myName: user.name,
    };
    /*
    teamName, teamId, recieverId, teamEmail, myId, myName
    */
    try {
      socket.emit("apply-to-join", data);
      socket.once("applied-to-join", (resp) => {
        if (resp.status === 200) {
          setLoading(false);
          setApplySuccess(true);
        } else {
          setLoading(false);
          toast.error(resp.message);
        }
        return;
      });
    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div
        key={index}
        className="team-card max-[800px]:h-[27rem] min-[800.1px]:h-[29rem] w-[19rem] backdrop-blur-md m-auto"
      >
        <div
          className="team-card-inner py-7 px-4 flex flex-col gap-4 justify-center items-center  border border-white/10
        shadow-lg hover:shadow-purple-500/20 rounded-2xl bg-gradient-to-br from-[#0f172a]/90 to-[#020617]/90"
        >
          <div className="team-card-front flex flex-col gap-4 justify-center items-center">
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500">
              <CustomAvatar name={name} />
            </div>
            <p className="text-white font-semibold text-lg tracking-wide">
              {name}
            </p>
            <p className="text-gray-400 text-sm">
              Hackathon : <span className="font-medium text-white">{hkNm}</span>
            </p>
            <p className="text-gray-400 text-sm line-clamp-2 px-2">{desc}</p>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <FontAwesomeIcon icon={faPeopleGroup} />
              <span>{members.length} Members</span>
            </div>
            {/* Skills */}
            <div className="mt-2">
              <SkillsCloud skilsArr={cleanedSkills} />
            </div>

            {/* Hint */}
            <p className="text-purple-400 text-xs mt-auto animate-pulse">
              Hover to flip →
            </p>
          </div>
          <div className="team-card-back">
            <div className="flex flex-col justify-center items-center gap-7 text-textPrimary">
              <Link
                href={`${githubLink}`}
                target="_blank"
                className="flex gap-2 justify-center items-center"
              >
                <button className=" px-1 py-2 w-[10rem] rounded-md bg-gradient-to-r from-purple-500 to-indigo-500
                text-white text-sm font-medium
                hover:opacity-90
                transition-all duration-300
                shadow-md hover:shadow-purple-500/30">
                  <FontAwesomeIcon className="text-2xl" icon={faGithub} />
                  &nbsp;&nbsp; Github
                </button>
              </Link>
              <button
                onClick={handleApply}
                title="Request to Join"
                className="flex gap-2 justify-center items-center px-1 py-2 w-[10rem] rounded-md bg-gradient-to-r from-purple-500 to-indigo-500
                text-white text-sm font-medium
                hover:opacity-90
                transition-all duration-300
                shadow-md hover:shadow-purple-500/30"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      className="text-2xl poopins-light"
                      icon={faCircleNotch}
                      spin
                    />
                    &nbsp;&nbsp; Applying..
                  </>
                ) : (
                  <>
                    {applySuccess ? (
                      <>
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-2xl"
                        />
                        &nbsp;&nbsp; Applied
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          className="text-2xl"
                          icon={faEnvelope}
                        />
                        &nbsp;&nbsp; Apply
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
