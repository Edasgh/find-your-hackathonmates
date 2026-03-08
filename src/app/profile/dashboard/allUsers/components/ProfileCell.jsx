"use client";

import CustomAvatar from "@/components/CustomAvatar";
import SkillsCloud from "@/components/SkillsCloud";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPeopleGroup,
  faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function ProfileCell({ user, open, setOpen }) {
  return (
    <>
      {user !== null ? (
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
          <div className="h-fit w-fit m-auto">
            <div
              className="relative bg-bgSecondary mx-4 p-6 border-[1px] border-textSecondary rounded-2xl flex flex-col items-start gap-3"
              suppressHydrationWarning
            >
              <div
                className="flex gap-3 justify-center items-center"
                suppressHydrationWarning
              >
                <CustomAvatar name={user.name} />
                <p className="text-textPrimary text-xl">{user.name}</p>
                <p className="text-textPrimary font-light text-xs bg-black p-2 rounded-md">
                  {user.country}
                </p>
                <span
                  className="text-textPrimary text-2xl font-semibold absolute top-1 right-1 cursor-pointer"
                  onClick={setOpen}
                >
                  <FontAwesomeIcon icon={faXmarkSquare} />
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`https://github.com/${user.githubID}`}
                  target="_blank"
                >
                  <p className="text-textPrimary underline flex gap-2 justify-center items-center text-xs px-2 py-1">
                    <FontAwesomeIcon className="text-2xl" icon={faGithub} />
                    {`https://github.com/${user.githubID}`}
                  </p>
                </Link>
                <Link
                  href={`mailTo:${user.email}`}
                  target="_blank"
                  className="flex gap-2 justify-center items-center"
                >
                  <p className="text-textPrimary flex gap-2 justify-center items-center text-xs px-2 py-1">
                    <FontAwesomeIcon
                      className="text-2xl text-textPrimary"
                      icon={faEnvelope}
                    />
                    {user.email}
                  </p>
                </Link>
                <p className="text-textPrimary flex gap-2 justify-center items-center text-center text-xs">
                  &nbsp;
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    className={"text-textPrimary text-lg"}
                  />
                  &nbsp; Teams : &nbsp;{user.teams.length}
                </p>
              </div>

              <p className="flex gap-1.5 flex-wrap justify-start items-center text-textBgPrimaryHv font-light text-sm">
                <span className="text-textPrimary font-normal text-[1rem]">
                  Bio :{" "}
                </span>
                {user.bio}
              </p>
              <div className="flex gap-1.5 flex-wrap justify-start items-start">
                <p className="text-textPrimary">Skills : </p>
                <SkillsCloud skilsArr={user.skills} />
              </div>
            </div>
          </div>
        </div>
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
            cursor: "default",
          }}
          suppressHydrationWarning
        >
          <div
            className="mx-4 p-6 flex flex-1 flex-col items-start gap-3"
            suppressHydrationWarning
          >
            <div
              className="flex justify-center items-center m-auto text-4xl text-center"
              suppressHydrationWarning
            >
              <span className="loader m-auto"></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
