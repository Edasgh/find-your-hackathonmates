"use client";

import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faMessage,
  faPeopleGroup,
  faRobot,
  faRocket,
  faUserPlus,
  faUsersBetweenLines,
} from "@fortawesome/free-solid-svg-icons";
import Reveal from "@/components/Reveal";
import HeroDiv from "@/components/HeroDiv";
import ParallaxImage from "@/components/ParallaxImage";


export default function Home() {
  return (
    <>
      <HeroDiv/>
        <section
          id="features"
          className="relative py-2 overflow-hidden bg-[#141414] flex flex-col items-center gap-20 "
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute left-1/2 top-0 h-full w-[70%] -translate-x-1/2 
                  bg-purple-500/10 blur-[120px] rounded-full overflow-hidden"
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
          <Reveal className="m-auto max-w-screen flex flex-wrap flex-row-reverse justify-between items-center gap-10 py-5 pb-8">
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
              <ParallaxImage className="rounded-md transition-transform duration-300 hover:scale-105">
                <Image
                  src="/create-team.png" // Path relative to the 'public' folder
                  alt="Create new team"
                  width={585}
                  height={585}
                  className="rounded-md transition-transform duration-300 hover:scale-105"
                />
              </ParallaxImage>
            </div>
            </Reveal>
            {/* Find Teammates page */}
          <Reveal className="m-auto max-w-screen flex flex-wrap flex-row justify-between items-center gap-10 py-5 pb-8">
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
              <ParallaxImage className="rounded-md transition-transform duration-300 hover:scale-105">
                <Image
                  src="/teammates.png" // Path relative to the 'public' folder
                  alt="Find teammates"
                  width={685}
                  height={1085}
                  className="rounded-md transition-transform duration-300 hover:scale-105"
                />
             </ParallaxImage>
            </div>
           </Reveal>
            {/* Teams page */}
          <Reveal className="m-auto max-w-screen flex flex-wrap flex-row-reverse justify-between items-center gap-10 py-5 pb-8">
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
              <ParallaxImage className="rounded-md transition-transform duration-300 hover:scale-105">

              <Image
                src="/teams.png" // Path relative to the 'public' folder
                alt="teams"
                width={685}
                height={1085}
                className="rounded-md transition-transform duration-300 hover:scale-105"
                />
                </ParallaxImage>
            </div>
            </Reveal>
            {/* My Team page */}
          <Reveal className="m-auto max-w-screen flex flex-wrap flex-row justify-between items-center gap-10 py-5 pb-8">
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
              <ParallaxImage className="rounded-md transition-transform duration-300 hover:scale-105">
              <Image
                src="/myTeam-2.png" // Path relative to the 'public' folder
                alt="myTeams"
                width={685}
                height={1085}
                className="rounded-md transition-transform duration-300 hover:scale-105"
              />
              </ParallaxImage>
            </div>
            </Reveal>
            {/* Devbot */}
          <Reveal className="m-auto max-w-screen flex flex-wrap flex-row-reverse justify-between items-center gap-10 py-5 pb-8">
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
              <ParallaxImage className="rounded-md transition-transform duration-300 hover:scale-105">
              <Image
                src="/devbot.png" // Path relative to the 'public' folder
                alt="Devbot-Assistant"
                width={250}
                height={250}
                className="rounded-md transition-transform duration-300 hover:scale-105"
              />
              </ParallaxImage>
            </div>
           </Reveal>
          </div>
        </section>
    

      <Reveal className="flex-1 flex flex-col gap-5 max-w-screen h-fit p-10 items-center overflow-hidden">
        <div className="flex-1 flex flex-col gap-5 max-w-screen h-fit p-10 items-center overflow-hidden">
          <p className="text-textPrimary text-5xl leading-normal ">
            ⭐ Start Building Your Hackathon Team Today
          </p>
          <p className="text-gray-500 text-lg font-medium">
            Team up faster and focus on building.
          </p>

          <Link
            href="/teams"
            className="px-8 py-3 rounded-lg font-medium
                      bg-gradient-to-r from-purple-500 to-indigo-500 
                     text-white
                      hover:scale-105 active:scale-95 
                      shadow-lg shadow-purple-800/20  text-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
      </Reveal>
      <ChatBot />
      <Footer />
    </>
  );
}
