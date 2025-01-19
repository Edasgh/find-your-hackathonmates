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
      socket.on("apply-to-join", (resp) => {
        if (resp.status === 200) {
          setLoading(false);
          setApplySuccess(true);
        } else {
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  return (
    <>
      <div
        key={index}
        className="team-card max-[800px]:h-[27rem] min-[800.1px]:h-[29rem] w-[19rem] backdrop-blur-md m-auto"
      >
        <div className="team-card-inner py-7 px-4 flex flex-col gap-4 justify-center items-center border-[1px] border-textSecondary rounded-2xl">
          <div className="team-card-front flex flex-col gap-4 justify-center items-center">
            <CustomAvatar name={name} />
            <p className="text-textBgPrimaryHv font-semibold text-lg">{name}</p>
            <p className="text-textPrimary text-sm">
              For the Hackathon : <span className="font-bold">{hkNm}</span>
            </p>
            <p className="text-textPrimary text-sm">{desc}</p>
            <p className="text-textPrimary text-center text-xs">
              <FontAwesomeIcon
                icon={faPeopleGroup}
                className={"text-textPrimary text-lg"}
              />
              &nbsp; Team Members : &nbsp;{members.length}
            </p>
            <SkillsCloud skilsArr={skills} />
          </div>
          <div className="team-card-back ">
            <div className="flex flex-col justify-center items-center gap-7 text-textPrimary">
              <Link
                href={`${githubLink}`}
                target="_blank"
                className="flex gap-2 justify-center items-center"
              >
                <button className=" px-1 py-2 w-[10rem] rounded-md dashing">
                  <FontAwesomeIcon className="text-2xl" icon={faGithub} />
                  &nbsp;&nbsp; Github
                </button>
              </Link>
              <button
                onClick={handleApply}
                title="Request to Join"
                className="flex gap-2 justify-center items-center px-1 py-2 w-[10rem] rounded-md dashing"
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
