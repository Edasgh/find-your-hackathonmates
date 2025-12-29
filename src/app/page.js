"use client";

import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowRightArrowLeft,
  faMessage,
  faPeopleGroup,
  faRobot,
  faRocket,
  faUserPlus,
  faUsersBetweenLines,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <div className="m-auto max-w-screen p-7 flex flex-wrap flex-row justify-between items-center gap-3 ">
        <div className="flex-1 flex flex-col gap-4 max-w-[30rem] h-fit">
          <p className="text-textPrimary text-5xl leading-normal ">
            Build Your Perfect Hackathon Team — Faster
          </p>
          <p className="text-gray-500 text-lg font-medium">
            Turn ideas into winning hackathon teams — faster and smarter.
          </p>
          <div className="flex flex-wrap items-start gap-5">
            <Link
              href="/teams"
              className="w-fit border-[1px] border-none bg-textBgPrimaryHv  text-black px-5 py-3 rounded-md"
            >
              <FontAwesomeIcon icon={faRocket} />
              &nbsp; Get Started Free
            </Link>
            <Link
              href="#features"
              className="w-fit border-[1px]  border-textBgPrimaryHv hover:bg-textBgPrimaryHv text-textSecondary hover:text-black  px-5 py-3 rounded-md"
            >
              Explore Features &nbsp;
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            ✅ Free to use • ⚡ Built for hackathons • 🤝 Real-time
            collaboration
          </p>
          <p className="text-sm text-gray-400 mt-2">
            👥 Trusted by 25+ early users
          </p>
        </div>
        <Image
          src="/hero-img.png" // Path relative to the 'public' folder
          alt="Description of the image"
          width={650}
          height={885}
          style={{
            background:
              "radial-gradient(circle at center,rgba(168, 85, 247, 0.15),transparent 70%)",
          }}
        />
      </div>
      <section
        id="features"
        className="relative py-2 overflow-hidden bg-[#141414] flex flex-col items-center gap-20"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-full w-[70%] -translate-x-1/2 
                  bg-purple-500/10 blur-[120px] rounded-full"
          />
        </div>
        {/* Heading */}
        <div className="flex-1 flex flex-col items-center gap-4 w-fit h-fit">
          <p className="bg-clip-text bg-gradient-to-tr from-textSecondary via-textBgPrimaryHv to-textPrimary text-transparent text-4xl font-semibold leading-normal ">
            Powerful Features Built for Hackathons
          </p>
          <p className="text-gray-500 text-lg font-medium">
            Everything you need to build your hackathon team — find teammates,
            join teams, and collaborate efficiently in one platform.
          </p>
        </div>
        {/* Features container */}
        <div className="flex flex-col gap-36 items-center">
          {/* Create Team page */}
          <div className="m-auto max-w-screen flex flex-wrap flex-row-reverse justify-between items-center gap-10 py-5 pb-8">
            <div className="flex-1 flex flex-col gap-4 max-w-[25rem] h-fit">
              <p className="text-textPrimary text-4xl font-semibold leading-normal ">
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  className="px-3 text-6xl"
                />
                Create Your Hackathon Team in Minutes
              </p>

              <p className="text-gray-500 text-lg font-medium">
                Set up your team and define the skills you’re looking for.
              </p>
            </div>
            <Image
              src="/create-team.png" // Path relative to the 'public' folder
              alt="Description of the image"
              width={585}
              height={585}
              className="rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Find Teammates page */}
          <div className="m-auto max-w-screen flex flex-wrap flex-row justify-between items-center gap-10 py-5 pb-8">
            <div className="flex-1 flex flex-col gap-4 max-w-[25rem] h-fit">
              <p className="text-textPrimary text-4xl font-semibold leading-normal ">
                <FontAwesomeIcon icon={faUserPlus} className="px-3 text-6xl" />
                Find Teammates to build your dream team
              </p>
              <p className="text-gray-500 text-lg font-medium">
                Discover teammates based on skills and interests.
              </p>
            </div>
            <Image
              src="/teammates.png" // Path relative to the 'public' folder
              alt="Description of the image"
              width={685}
              height={1085}
              className="rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Teams page */}
          <div className="m-auto max-w-screen flex flex-wrap flex-row-reverse justify-between items-center gap-10 py-5 pb-8">
            <div className="flex-1 flex flex-col gap-4 max-w-[25rem] h-fit">
              <p className="text-textPrimary text-4xl font-semibold leading-normal ">
                <FontAwesomeIcon
                  icon={faUsersBetweenLines}
                  className="px-3 text-6xl"
                />
                Join or Discover Hackathon Teams
              </p>
              <p className="text-gray-500 text-lg font-medium">
                Explore teams and apply to those that match your skills.
              </p>
            </div>
            <Image
              src="/teams.png" // Path relative to the 'public' folder
              alt="Description of the image"
              width={685}
              height={1085}
              className="rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* My Team page */}
          <div className="m-auto max-w-screen flex flex-wrap flex-row justify-between items-center gap-10 py-5 pb-8">
            <div className="flex-1 flex flex-col gap-4 max-w-[25rem] h-fit">
              <p className="text-textPrimary text-4xl font-semibold leading-normal ">
                <FontAwesomeIcon icon={faMessage} className="px-3 text-6xl" />
                Collaborate with Your Team in Real Time
              </p>
              <p className="text-gray-500 text-lg font-medium">
                Chat, collaborate, and manage your team in one place.
              </p>
            </div>
            <Image
              src="/myTeam-2.png" // Path relative to the 'public' folder
              alt="Description of the image"
              width={685}
              height={1085}
              className="rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Devbot */}
          <div className="m-auto max-w-screen flex flex-wrap flex-row-reverse justify-between items-center gap-10 py-5 pb-8">
            <div className="flex-1 flex flex-col gap-4 max-w-[25rem] h-fit">
              <p className="text-textPrimary text-4xl font-semibold leading-normal ">
                <FontAwesomeIcon icon={faRobot} className="px-3 text-6xl" />
                AI-Powered Assistance with DevBot
              </p>

              <p className="text-gray-500 text-lg font-medium">
                Get instant help while building your hackathon team.
              </p>
            </div>
            <Image
              src="/devbot.png" // Path relative to the 'public' folder
              alt="Description of the image"
              width={250}
              height={250}
              className="rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <div className="flex-1 flex flex-col gap-5 max-w-screen h-fit p-10 items-center">
        <p className="text-textPrimary text-5xl leading-normal ">
          ⭐ Start Building Your Hackathon Team Today
        </p>
        <p className="text-gray-500 text-lg font-medium">
          Team up faster and focus on building.
        </p>

        <Link
          href="/teams"
          className="w-fit border-[1px] border-none bg-textBgPrimaryHv  text-black px-5 py-3 rounded-md"
        >
          <FontAwesomeIcon icon={faRocket} />
          &nbsp; Join Free Today
        </Link>
        <p className="text-sm text-gray-400 mt-2">
          ✅ Free to use • ⚡ Built for hackathons • 🤝 Real-time collaboration
        </p>
        <p className="text-sm text-gray-400 mt-2">
          👥 25+ early users already on board
        </p>
      </div>
      <ChatBot />
      <Footer />
    </>
  );
}
