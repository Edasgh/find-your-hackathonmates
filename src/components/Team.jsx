"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import CustomAvatar from "./CustomAvatar";
import SkillsCloud from "./SkillsCloud";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Team({
  id,
  name,
  desc,
  skills,
  members,
  githubLink,
  admin,
  email,
  index,
}) {
  const handleApply = async () => {
    let tId = toast.loading("Sending Application...");
    const data = {
      recieverId: admin,
      teamName: name,
      teamId: id,
      teamEmail: email,
    };
    try {
      const resp = await fetch("/api/applyToJoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (resp.status === 200) {
        toast.update(tId, {
          render: "Applied Successfully!!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        throw new Error("Failed to Apply");
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.update(tId, {
        render: "Failed to Apply",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      <div
        key={index}
        className="team-card max-[800px]:h-[26rem] min-[800.1px]:h-[28rem] w-[19rem] backdrop-blur-md m-auto"
      >
        <div className="team-card-inner py-7 px-4 flex flex-col gap-4 justify-center items-center border-[1px] border-textSecondary rounded-2xl">
          <div className="team-card-front flex flex-col gap-4 justify-center items-center">
            <CustomAvatar name={name} />
            <p className="text-textBgPrimaryHv font-semibold text-lg">{name}</p>
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
                <FontAwesomeIcon className="text-2xl" icon={faEnvelope} />
                &nbsp;&nbsp; Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
