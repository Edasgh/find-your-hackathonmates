"use client";

import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";
import { redirect } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const {user} = useCreds();
  useLayoutEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  const [isEmailFocus, setIsEmailFocus] = useState(false);

  const onFocusStyle = {
    padding: "0 0.5rem",
    color: " var(--text-secondary)",
    transform: " translate(-10px, -17px) scale(0.8)",
    zIndex: "8",
  };

  const getStyle = (isFocus) => {
    return isFocus ? onFocusStyle : { display: "inherit" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tId;

    try {
      const data = new FormData(e.currentTarget);
      const email = data.get("email");
      tId = toast.loading("Please wait....");

      const response = await fetch("/api/forgot_password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      if (response.status === 200) {
        toast.update(tId, {
          render: "Verification Link Sent!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(tId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="main-div w-1/3 max-[900px]:w-full p-7 m-auto mt-10 mb-20 flex flex-col gap-3 justify-center items-center">
        <h1 title="forgot password" className="text-center section-title text-textPrimary poppins-semibold text-[28px]">
          Verify Email
        </h1>
        <form className="login-signup-form" onSubmit={handleSubmit}>
          <div className="input-div">
            <input
              type="email"
              onFocus={() => {
                setIsEmailFocus(true);
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setIsEmailFocus(false);
                } else {
                  setIsEmailFocus(true);
                }
              }}
              id="email"
              name="email"
              aria-describedby="emailSignup"
              className="text-textPrimary"
              required
            />
            <label
              htmlFor="email"
              className="labelLine"
              style={getStyle(isEmailFocus)}
            >
              Email Address
            </label>
          </div>
          <button
            className="verify-email-submit w-auto px-4 py-2 rounded-lg text-sm 
                      bg-gradient-to-r from-purple-500 to-indigo-500 
                      text-white font-medium 
                      hover:scale-105 active:scale-95 
                      shadow-lg shadow-purple-800/20 transition-all text-center"
            type="submit"
            id="verify-email-btn"
          >
            Send Verification Link
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
