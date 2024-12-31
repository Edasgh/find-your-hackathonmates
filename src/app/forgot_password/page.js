"use client";

import Footer from "@/components/Footer";
import { getToken } from "@/lib/verifyToken";
import { redirect } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  useLayoutEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      redirect("/");
    }
  }, []);

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
      <ToastContainer position="top-center" theme="dark" />
      <div className="main-div w-1/3 max-[900px]:w-full p-7 m-auto mt-10 flex flex-col gap-3 justify-center items-center">
        <h1 className="text-center section-title text-textPrimary poppins-semibold text-[28px]">
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
              Email Address *
            </label>
          </div>
          <button
            className="verify-email-submit text-textPrimary hover:bg-textBgPrimaryHv hover:text-black hover:text-center px-3 py-2 w-auto border-[1px] rounded-md border-textBgPrimaryHv"
            type="submit"
            id="verify-email-btn"
          >
            Send Verification Link
          </button>
        </form>
      </div>
      <Footer/>
    </>
  );
}
