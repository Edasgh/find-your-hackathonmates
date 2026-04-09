"use client";

import NotFoundUser from "@/components/not-found-user";

import Link from "next/link";
import { useRouter } from "next/navigation";

import LoadingComponent from "../loading";
import CustomAvatar from "@/components/CustomAvatar";
import {
  faEnvelope,
  faPenToSquare,
  faPeopleGroup,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditProfile from "@/components/EditProfile";
import { useCreds } from "@/hooks/useCreds";
import { signOut } from "next-auth/react";

export default function Profile() {
  const { user, isLoading } = useCreds();
  const router = useRouter();


  const handleLogOut = async () => {
    signOut();
    setTimeout(() => {
      router.refresh();
    }, 1800)
  }


  return (
    <>
      {isLoading ? (
        <>
          <div className="w-screen">
            <LoadingComponent />
          </div>
        </>
      ) : (
        <>
          {user === null ? (
            <div className="w-screen">
              <NotFoundUser />
            </div>
          ) : (
            <div
              className="w-screen mt-12 bg-bgPrimary flex justify-between gap-4 flex-wrap px-10"
              suppressHydrationWarning>
              {/* Profile Card */}
              <div className="flex-1 h-fit 
            bg-white/5 backdrop-blur-xl border border-white/10 
            rounded-2xl shadow-xl shadow-black/30 
            p-6 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex gap-4 items-center">
                  <div className="scale-110">
                    <CustomAvatar name={user.name} />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-white text-xl font-semibold">{user.name}</p>
                    <span className="text-xs px-2 py-1 mt-1 w-fit rounded-full 
                  bg-purple-500/20 text-purple-300 border border-purple-400/20">
                      {user.country}
                    </span>
                  </div>
                </div>

                {/* Links Section */}
                <div className="flex flex-wrap gap-3 text-sm text-white/70">
                  <Link
                    href={`https://github.com/${user.githubID}`}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-1 rounded-md 
                  bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                    {user.githubID}
                  </Link>

                  <Link
                    href={`mailTo:${user.email}`}
                    className="flex items-center gap-2 px-3 py-1 rounded-md 
                  bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                    {user.email}
                  </Link>

                  <Link
                    href="/profile/myTeams"
                    className="flex items-center gap-2 px-3 py-1 rounded-md 
                  bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <FontAwesomeIcon icon={faPeopleGroup} />
                    {user.teams.length} Teams
                  </Link>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2">
                  <p className="text-white/80 font-medium">Bio</p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {user.bio || "No bio added yet."}
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-2">
                  <p className="text-white/80 font-medium">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(
                      user.skills
                        ?.map(skill => skill.trim())
                        .filter(skill => skill !== "")
                    )]?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                        text-white text-xs px-3 py-1 rounded-full 
                        border border-white/10 hover:scale-105 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex mt-3 gap-3 flex-wrap">
                  <button
                    onClick={handleLogOut}
                    className="px-4 py-2 rounded-lg text-slate-400 text-sm 
                    bg-white/5 border border-white/10 
                    hover:bg-red-500/20 hover:text-red-300 
                    transition-all duration-300 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Log Out
                  </button>

                  <Link href={`/reset_password?id=${user._id}`}>
                    <button className="px-4 py-2 rounded-lg text-sm 
                      bg-gradient-to-r from-purple-500 to-indigo-500 
                      text-white font-medium 
                      hover:scale-105 active:scale-95 
                      shadow-lg shadow-purple-800/20 transition-all flex items-center gap-2">
                      <FontAwesomeIcon icon={faPenToSquare} />
                      Change Password
                    </button>
                  </Link>
                </div>
              </div>

              {/* Edit Profile */}
              <div className="flex-1 min-w-[320px] max-w-[500px] 
              bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-2xl shadow-xl shadow-black/30 
              p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300"
              >
                <h1 className="text-white text-xl font-semibold mb-2">
                  Edit Profile
                </h1>

                <EditProfile
                  UserId={user._id}
                  UserName={user.name}
                  UserEmail={user.email}
                  UserCountry={user.country}
                  UserBio={user.bio}
                  UserGithubID={user.githubID}
                  UserSkills={user.skills}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
