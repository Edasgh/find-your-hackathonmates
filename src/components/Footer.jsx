"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-[15rem] w-full overflow-x-hidden text-sm text-center poppins-light py-3 z-20 bg-footerBg text-textPrimary">
    {/* <footer className="fixed bottom-0 mt-2 w-full text-sm text-center poppins-light py-1 z-20 bg-footerBg text-textPrimary"> */}
      Copyright &copy; 2025 find your HackathonMates | Made with ❤️ by &nbsp;
      <Link href="https://github.com/Edasgh" target="_blank" className="underline">
        Eshita Das
      </Link>
    </footer>
  );
}
