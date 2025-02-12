"use client";
import React from "react";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FacebookLogin from "@greatsumini/react-facebook-login";

const FacebookLoginObj = ({ oauthLogin }) => {
  return (
    <FacebookLogin
      style={{
        marginBottom:"-4px"
      }}
      children={
        <FontAwesomeIcon
          className="text-blue-900 text-2xl bg-white py-1.5 px-2 rounded-sm hover:ring-2 ring-[#555658]"
          icon={faFacebook}
        />
      }
      appId={`${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
      onSuccess={() => {
        console.log("Login Success!");
      }}
      onFail={(error) => {
        console.log("Login Failed!", error);
      }}
      onProfileSuccess={async (response) => {
        await oauthLogin({
          provider: "facebook",
          email: response.email,
        });
      }}
    />
  );
};

export default FacebookLoginObj;
