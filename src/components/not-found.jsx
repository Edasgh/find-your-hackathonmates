
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="m-auto max-w-full h-[80%]  flex flex-col justify-center items-center gap-3 ">
        <Image
          src="/404-not-found.png" // Path relative to the 'public' folder
          alt="Description of the image"
          width={550}
          height={785}
        />
        <h1 className="text-2xl text-textPrimary">Page Not Found!</h1>
        <Link className="cursor-pointer text-textSecondary" href="/" >Go Back to Home</Link>
      </div>
    </>
  );
}
