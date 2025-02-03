"use client";

import ChatBotUI from "@/components/ChatBotUI";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="m-auto max-w-screen p-7 flex flex-wrap flex-row justify-between items-center gap-3 ">
        <div className="flex-1 flex flex-col gap-4 max-w-[25rem] h-fit">
          <p className="text-textPrimary text-5xl leading-normal ">
            Build Your Perfect Team for Hackathons
          </p>
          <p className="text-gray-500 text-lg font-medium">
            Find Team mates, Find Teams, Chat with Team members & more.
          </p>
          <Link
            href="/teams"
            className="w-fit border-[1px]  border-textBgPrimaryHv hover:bg-textBgPrimaryHv text-textSecondary hover:text-black  px-8 py-3 rounded-md"
          >
            Get Started
          </Link>
        </div>
        <Image
          src="/hero-img.png" // Path relative to the 'public' folder
          alt="Description of the image"
          width={650}
          height={885}
        />
      </div>
      <ChatBotUI />
      <Footer />
    </>
  );
}
