"use client";

import CustomAvatar from "@/components/CustomAvatar";
import SkillsCloud from "@/components/SkillsCloud";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useMemo } from "react";

export const ProfileEl = ({ user, open }) => {
  const userDetails = useMemo(() => {
    if (!user) return null;
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      githubID: user.githubID,
      country: user.country,
      skills: [...user.skills],
      teams: [...user.teams],
    };
  }, [user]);

  return (
    <>
      {userDetails !== null ? (
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
          <div className="h-fit w-fit m-auto">
            <div
              className="bg-bgSecondary mx-4 p-6 border-[1px] border-textSecondary rounded-2xl flex flex-col items-start gap-3"
              suppressHydrationWarning
            >
              <div
                className="flex gap-3 justify-center items-center"
                suppressHydrationWarning
              >
                <CustomAvatar name={userDetails.name} />
                <p className="text-textPrimary text-xl">{userDetails.name}</p>
                <p className="text-textPrimary font-light text-xs bg-black p-2 rounded-md">
                  {userDetails.country}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`https://github.com/${userDetails.githubID}`}
                  target="_blank"
                >
                  <p className="text-textPrimary underline flex gap-2 justify-center items-center text-xs px-2 py-1">
                    <FontAwesomeIcon className="text-2xl" icon={faGithub} />
                    {`https://github.com/${userDetails.githubID}`}
                  </p>
                </Link>
                <Link
                  href={`mailTo:${userDetails.email}`}
                  target="_blank"
                  className="flex gap-2 justify-center items-center"
                >
                  <p className="text-textPrimary flex gap-2 justify-center items-center text-xs px-2 py-1">
                    <FontAwesomeIcon
                      className="text-2xl text-textPrimary"
                      icon={faEnvelope}
                    />
                    {userDetails.email}
                  </p>
                </Link>
                <p className="text-textPrimary flex gap-2 justify-center items-center text-center text-xs">
                  &nbsp;
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    className={"text-textPrimary text-lg"}
                  />
                  &nbsp; Teams : &nbsp;{userDetails.teams.length}
                </p>
              </div>

              <p className="flex gap-3 flex-col text-textBgPrimaryHv font-light text-sm">
                <span className="text-textPrimary font-normal text-[1rem]">
                  Bio{" "}
                </span>
                {userDetails.bio}
              </p>
              <div className="flex gap-3 flex-col">
                <p className="text-textPrimary">Skills </p>
                <SkillsCloud skilsArr={userDetails.skills} />
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
};
