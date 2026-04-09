"use client";
import React from "react";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacebookLoginObj = () => {
  const router = useRouter();
  return (
    <FacebookLogin
      style={{ marginBottom: "-4px" }}
      appId={`${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
      children={
        <FontAwesomeIcon
          className="text-blue-900 text-2xl bg-white py-1.5 px-2 rounded-sm hover:ring-2 ring-[#555658]"
          icon={faFacebook}
        />
      }
      onSuccess={() => {
        toast.success("Login Success!");
      }}
      onFail={(error) => {
        toast.error("Login Failed!", error);
      }}
      onProfileSuccess={async (response) => {
        const email = response.email;

        const res = await signIn("credentials", {
          email,
          provider: "facebook",
          redirect: false,
        });

        if (res?.error) {
          console.log(res.error);
          toast.error("Login Failed!", error);
        } else {
          toast.success("Login Success!");
          setTimeout(() => {
            router.push("/teams");
          }, 1800);
        }
      }}
    />
  );
};

export default FacebookLoginObj;
