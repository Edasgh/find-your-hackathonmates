"use client";

import CustomAvatar from "@/components/CustomAvatar";
import SkillsCloud from "@/components/SkillsCloud";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function TeamCell({ team, open }) {
  return (
    <>
      {team !== null && (
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
            cursor: "default",
          }}
          suppressHydrationWarning
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-fit w-[19rem] m-auto">
            <div className="py-7 px-4 flex flex-col gap-4 justify-center items-center border-[1px] border-textSecondary rounded-2xl bg-bgSecondary">
              <div className="flex flex-col gap-4 justify-center items-center">
                <CustomAvatar name={team.name} />
                <p className="text-textBgPrimaryHv font-semibold text-lg">
                  {team.name}
                </p>
                <p className="text-textPrimary font-semibold text-sm">
                  {team.hkNm}
                </p>
                <p className="text-textPrimary text-sm">{team.desc}</p>
                <p className="text-textPrimary text-center text-xs flex justify-center">
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    className={"text-textPrimary text-lg"}
                  />
                  &nbsp; Team Members : &nbsp;{team.members.length}
                </p>
                <SkillsCloud skilsArr={team.skills} />
              </div>

              <div className="flex gap-3 justify-center items-center">
                <Link
                  href={`${team.githubLink}`}
                  target="_blank"
                  className="flex gap-2 justify-center items-center"
                >
                  <button className=" px-5 py-2  rounded-md dashing text-textPrimary text-sm">
                    <FontAwesomeIcon
                      className="text-sm text-textPrimary"
                      icon={faGithub}
                    />
                    &nbsp;&nbsp; Github
                  </button>
                </Link>
                <Link
                  href={`mailTo:${team.email}`}
                  target="_blank"
                  className="flex gap-2 justify-center items-center"
                >
                  <button className=" px-5 py-2  rounded-md dashing text-textPrimary text-sm">
                    <FontAwesomeIcon
                      className="text-sm text-textPrimary"
                      icon={faEnvelope}
                    />
                    &nbsp;&nbsp; Email
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
