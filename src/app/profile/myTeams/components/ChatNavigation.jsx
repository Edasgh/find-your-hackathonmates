"use client";
import CustomAvatar from "@/components/CustomAvatar";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEllipsisVertical,
  faPlus,
  faUser,
  faEye,
  faRightFromBracket,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LinksModal from "./LinksModal";
import AddLinkModal from "./AddLinkModal";
import ViewMembersModal from "./ViewMembersModal";
import DelAlert from "./delAlert";
import useChat from "@/hooks/useChat";
import LeaveAlert from "./leaveAlert";
import { useRouter } from "next/navigation";
import EditSkillsModal from "./EditSkillsModal";
import EditTeam from "./EditTeam";

const ChatNavigation = ({
  name,
  description,
  links,
  hkNm,
  email,
  skills,
  members,
  userId,
  userName,
  adminId,
  handleAddLink,
  handleRemoveMember,
}) => {
  const { teamId } = useChat();
  const [openIdx, setOpenIdx] = useState(null);
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const isAdmin = userId === adminId;

  const [over, setOver] = useState({
    over1: false,
    over2: false,
    over3: false,
    over4: false,
    over5: false,
    over6: false,
  });

  const LeaveTeam = async () => {
    try {
      const reqBody = {
        myId: userId,
        myName: userName,
        teamId: teamId,
        adminId,
      };
      const resp = await fetch("/api/profile/myTeams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      if (resp.status !== 200) {
        throw new Error("Something went wrong!");
      }
      router.push("/profile/myTeams");
      setInterval(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.log(error.message);
    }
  };
  const DeleteTeam = async () => {
    try {
      const reqBody = { teamId: teamId };
      const resp = await fetch("/api/createTeam", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      if (resp.status !== 200) {
        throw new Error("Something went wrong!");
      }
      router.push("/profile/myTeams");
      setInterval(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative">
      <EditTeam
        open={openIdx}
        setOpen={setOpenIdx}
        name={name}
        hackathonName={hkNm}
        email={email}
        description={description}
      />
      <EditSkillsModal open={openIdx} setOpen={setOpenIdx} skillsArr={skills} />
      <ViewMembersModal
        members={members}
        userId={userId}
        isAdmin={isAdmin}
        open={openIdx}
        setOpen={setOpenIdx}
        handleRemoveMember={handleRemoveMember}
      />
      <AddLinkModal
        open={openIdx}
        setOpen={setOpenIdx}
        handleAddLink={handleAddLink}
      />
      <LinksModal links={links} open={openIdx} setOpen={setOpenIdx} />
      <DelAlert
        open={openIdx}
        setOpen={setOpenIdx}
        teamId={teamId}
        teamName={name}
        deleteTeam={DeleteTeam}
      />
      <LeaveAlert
        open={openIdx}
        setOpen={setOpenIdx}
        teamId={teamId}
        teamName={name}
        userId={userId}
        leaveTeam={LeaveTeam}
      />
      <div
        className={`absolute z-50 top-0 -right-[15rem] bg-gray-800 text-white w-[14rem] h-fit overflow-y-auto transition-transform transform ${
          opened && "-translate-x-[15rem]"
        }  ease-in-out duration-200 `}
        id="sidebar"
      >
        <div className="p-4">
          <div
            className="text-2xl flex flex-col gap-2 mt-8 font-semibold"
            suppressHydrationWarning
          >
            <CustomAvatar name={name} />
            <span className="flex gap-3 justify-start items-center">
              {name}
              {isAdmin && <FontAwesomeIcon className="cursor-pointer" onClick={()=>{
                setOpenIdx("edit-team");
              }} icon={faPenToSquare} />}
            </span>
            <p className="text-xs font-normal" suppressHydrationWarning>
              For the Hackathon :{" "}
              <span className="font-bold text-sm">{hkNm}</span>
            </p>
            <Link
              href={`mailTo:${email}`}
              className="text-xs font-normal hover:underline"
            >
              {" "}
              {email}{" "}
            </Link>
          </div>
          <ul className="mt-4">
            <li className="mb-3" style={{ width: "12rem" }}>
              <p className="text-sm text-textPrimary">{description}</p>
            </li>
            <li className="mb-3">
              <p className="relative mb-2 font-semibold">
                Links &nbsp;&nbsp;
                <button
                  className="cursor-pointer bg-transparent"
                  onMouseOver={() => {
                    setOver((prev) => ({ ...prev, over1: true }));
                  }}
                  onMouseOut={() => {
                    setOver((prev) => ({ ...prev, over1: false }));
                  }}
                  onClick={() => {
                    setOpenIdx("addLinks");
                  }}
                >
                  <FontAwesomeIcon className="cursor-pointer" icon={faPlus} />{" "}
                </button>
                <span
                  className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 left-7 ${
                    over.over1 ? "flex" : "hidden"
                  } `}
                >
                  Add new link
                </span>
                &nbsp;&nbsp; &nbsp;
                <button
                  className="cursor-pointer bg-transparent"
                  onMouseOver={() => {
                    setOver((prev) => ({ ...prev, over2: true }));
                  }}
                  onMouseOut={() => {
                    setOver((prev) => ({ ...prev, over2: false }));
                  }}
                  onClick={() => {
                    setOpenIdx("openLinks");
                  }}
                >
                  <FontAwesomeIcon className="text-textPrimary" icon={faEye} />
                </button>
                <span
                  className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 left-7 ${
                    over.over2 ? "flex" : "hidden"
                  } `}
                >
                  View all links
                </span>
              </p>
              <Link
                className="text-sm  flex gap-2 text-textPrimary hover:underline"
                href={`${links[0].link}`}
                target="_blank"
              >
                <FontAwesomeIcon className="text-lg" icon={faGithub} />
                Github
              </Link>
            </li>

            <li className="mb-3">
              <p className="relative mb-2 font-semibold">
                <FontAwesomeIcon icon={faUser} />
                &nbsp; {members.length} &nbsp;
                {members.length === 1 ? "Member" : "Members"}
                &nbsp;&nbsp;
                <button
                  className="cursor-pointer bg-transparent"
                  onMouseOver={() => {
                    setOver((prev) => ({ ...prev, over3: true }));
                  }}
                  onMouseOut={() => {
                    setOver((prev) => ({ ...prev, over3: false }));
                  }}
                  onClick={() => {
                    setOpenIdx("members");
                  }}
                >
                  <FontAwesomeIcon className="text-textPrimary" icon={faEye} />
                </button>
                <span
                  className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 left-7 ${
                    over.over3 ? "flex" : "hidden"
                  } `}
                >
                  View all Members
                </span>
              </p>
            </li>
            <li className="mb-3">
              <button
                className="cursor-pointer bg-transparent flex gap-3 justify-center items-start"
                onMouseOver={() => {
                  setOver((prev) => ({ ...prev, over6: true }));
                }}
                onMouseOut={() => {
                  setOver((prev) => ({ ...prev, over6: false }));
                }}
                onClick={() => {
                  setOpenIdx("skills");
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="text-xl" />
                <p className="relative mb-2 font-semibold hover:underline cursor-pointer">
                  View Skills
                </p>
              </button>
            </li>
          </ul>
        </div>
        <div
          className="flex p-5 relative gap-3 flex-wrap"
          suppressHydrationWarning
        >
          <button
            className="w-fit border-[1px] text-sm text-textPrimary border-textBgPrimaryHv hover:bg-textBgPrimaryHv hover:text-black  px-5 py-3 rounded-md"
            onMouseOver={() => {
              setOver((prev) => ({ ...prev, over4: true }));
            }}
            onMouseOut={() => {
              setOver((prev) => ({ ...prev, over4: false }));
            }}
            onClick={() => {
              setOpenIdx("leaveTeam");
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
          <span
            className={`bg-slate-500 text-textPrimary px-2 py-1 text-sm rounded-md absolute -top-3 left-1 ${
              over.over4 ? "flex" : "hidden"
            } `}
          >
            Leave
          </span>

          {isAdmin && (
            <>
              <button
                className="w-fit border-[1px] text-sm text-textPrimary border-textBgPrimaryHv hover:bg-textBgPrimaryHv hover:text-black  px-5 py-3 rounded-md"
                onMouseOver={() => {
                  setOver((prev) => ({ ...prev, over5: true }));
                }}
                onMouseOut={() => {
                  setOver((prev) => ({ ...prev, over5: false }));
                }}
                onClick={() => {
                  setOpenIdx("delTeam");
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <span
                className={`bg-slate-500 text-textPrimary px-2 py-1 text-sm rounded-md absolute -top-3 right-14 ${
                  over.over5 ? "flex" : "hidden"
                } `}
              >
                Delete
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-[999999999px]">
        <div className="bg-bgPrimary shadow">
          <div className="container mx-auto">
            <div className="flex gap-2 py-1 px-2">
              <button
                className="text-gray-500 relative z-50 hover:text-gray-600 p-1 px-2"
                id="open-sidebar"
                onClick={() => {
                  setOpened(!opened);
                }}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNavigation;
