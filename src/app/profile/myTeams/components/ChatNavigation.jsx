"use client";
import CustomAvatar from "@/components/CustomAvatar";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEllipsisVertical,
  faPlus,
  faUser,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LinksModal from "./LinksModal";
import AddLinkModal from "./AddLinkModal";
import ViewMembersModal from "./ViewMembersModal";


const ChatNavigation = ({
  name,
  description,
  links,
  email,
  members,
  userId,
  adminId,
  handleAddLink,
  handleRemoveMember,
}) => {
  const [opened, setOpened] = useState(false);
  const [openLinks, setOpenLinks] = useState(false);
  const [openAddLinks, setOpenAddLinks] = useState(false);
  const [openMembersModal, setOpenMembersModal] = useState(false);

  const isAdmin = userId === adminId;

  const [over2, setOver2] = useState(false);
  const [over3, setOver3] = useState(false);
  const [over4, setOver4] = useState(false);

  return (
    <div className="relative">
      <ViewMembersModal
        members={members}
        userId={userId}
        isAdmin={isAdmin}
        open={openMembersModal}
        setOpen={setOpenMembersModal}
        handleRemoveMember={handleRemoveMember}
      />
      <AddLinkModal
        open={openAddLinks}
        setOpen={setOpenAddLinks}
        handleAddLink={handleAddLink}
      />
      <LinksModal links={links} open={openLinks} setOpen={setOpenLinks} />
      <div
        className={`absolute top-0 -right-[15rem] bg-gray-800 text-white w-[14rem] h-fit overflow-y-auto transition-transform transform ${
          opened && "-translate-x-[15rem]"
        }  ease-in-out duration-200 `}
        id="sidebar"
      >
        <div className="p-4">
          <p className="text-2xl flex flex-col gap-2 mt-8 font-semibold">
            <CustomAvatar name={name} />
            {name}
            <Link
              href={`mailTo:${email}`}
              className="text-xs font-normal hover:underline"
            >
              {" "}
              {email}{" "}
            </Link>
          </p>
          <ul className="mt-4">
            <li className="mb-3">
              <p className="text-sm text-textPrimary">{description}</p>
            </li>
            <li className="mb-3">
              <p className="relative mb-2 font-semibold">
                Links &nbsp;&nbsp;
                <button
                  className="cursor-pointer bg-transparent"
                  onMouseOver={() => {
                    setOver2(true);
                  }}
                  onMouseOut={() => {
                    setOver2(false);
                  }}
                  onClick={() => {
                    setOpenAddLinks(true);
                  }}
                >
                  <FontAwesomeIcon className="cursor-pointer" icon={faPlus} />{" "}
                </button>
                <span
                  className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 left-7 ${
                    over2 ? "flex" : "hidden"
                  } `}
                >
                  Add new link
                </span>
                &nbsp;&nbsp; &nbsp;
                <button
                  className="cursor-pointer bg-transparent"
                  onMouseOver={() => {
                    setOver3(true);
                  }}
                  onMouseOut={() => {
                    setOver3(false);
                  }}
                  onClick={() => {
                    setOpenLinks(true);
                  }}
                >
                  <FontAwesomeIcon className="text-textPrimary" icon={faEye} />
                </button>
                <span
                  className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 left-7 ${
                    over3 ? "flex" : "hidden"
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
                    setOver4(true);
                  }}
                  onMouseOut={() => {
                    setOver4(false);
                  }}
                  onClick={() => {
                    setOpenMembersModal(true);
                  }}
                >
                  <FontAwesomeIcon className="text-textPrimary" icon={faEye} />
                </button>
                <span
                  className={`bg-slate-500 text-textPrimary px-2 py-1 text-xs rounded-md absolute bottom-6 left-7 ${
                    over4 ? "flex" : "hidden"
                  } `}
                >
                  View all Members
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-[999999999px]">
        <div className="bg-bgPrimary shadow">
          <div className="container mx-auto">
            <div className="flex gap-2 py-1 px-2">
              <button
                className="text-gray-500 hover:text-gray-600 p-1 px-2"
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
