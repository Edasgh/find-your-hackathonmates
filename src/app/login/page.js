"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingComponent from "../loading";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import FacebookLoginObj from "@/components/FacebookLogin";

export default function Login() {
  const { user, isLoading } = useCreds();
  //router
  const router = useRouter();
  const params = useSearchParams();

  useLayoutEffect(() => {
    if (!isLoading && user) {
      router.push("/teams");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const error = params.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      toast.error("User not found. Redirecting to signup...");
      setTimeout(() => router.push("/signup"), 1500);
    }
  }, [params]);


  //to show floating labels if focused on input fields
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  // to show / hide the password
  const [isShown, setIsShown] = useState(false);

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
    const data = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: data.get("emailLogin"),
      password: data.get("passwordLogin"),
      redirect: false,
    });

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Logged in!");
      router.refresh();
      setTimeout(() => {
        router.push("/teams");
      }, 1800)
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <LoadingComponent />
        </>
      ) : (
        <>
          <div className="main-div w-1/3 max-[900px]:w-full p-7 m-auto mt-10 flex flex-col gap-2 justify-center items-center">
            <h1 title="login" className="section-title poppins-semibold text-textPrimary text-[28px]">
              Welcome Back!
            </h1>
            <form
              onSubmit={handleSubmit}
              className="login-signup-form"
              id="login"
            >
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
                  id="emailLogin"
                  name="emailLogin"
                  aria-describedby="emailLogin"
                  className="text-textPrimary"
                  suppressHydrationWarning
                  required
                />
                <label
                  htmlFor="emailLogin"
                  className="labelLine"
                  style={getStyle(isEmailFocus)}
                >
                  Email
                </label>
              </div>
              <div className="input-div">
                <input
                  type={isShown ? "text" : "password"}
                  className="form-control text-textPrimary"
                  onFocus={() => {
                    setIsPasswordFocus(true);
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setIsPasswordFocus(false);
                    } else {
                      setIsPasswordFocus(true);
                    }
                  }}
                  name="passwordLogin"
                  id="passwordLogin"
                  minLength={8}
                  suppressHydrationWarning
                  required
                />
                <span
                  className={
                    "absolute top-2 left-[72%] w-[6.5rem] bg-transparent cursor-pointer z-10"
                  }
                >
                  <FontAwesomeIcon
                    icon={isShown ? faEyeSlash : faEye}
                    onClick={() => {
                      setIsShown(!isShown);
                      document.getElementById("passwordLogin").focus();
                    }}
                  />
                </span>
                <label
                  htmlFor="passwordLogin"
                  className="labelLine"
                  style={getStyle(isPasswordFocus)}
                >
                  Password
                </label>
              </div>

              <div className="form-flex">
                <Link
                  href="/forgot_password"
                  className="text-sm underline text-textSecondary"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                className="login-submit w-[90%] px-4 py-2 rounded-lg text-sm 
                      bg-gradient-to-r from-purple-500 to-indigo-500 
                      text-white font-medium 
                      hover:scale-105 active:scale-95 
                      shadow-lg shadow-purple-800/20 transition-all text-center"
                type="submit"
                id="login-btn"
                suppressHydrationWarning
              >
                Log In
              </button>
              <div className="form-flex mt-5 relative">
                <hr
                  style={{
                    borderBlockColor: "gray",
                  }}
                />
                <p
                  style={{
                    left: "70px",
                    top: "-24px",
                  }}
                  className="text-sm absolute bg-bgSecondary px-1 font-medium text-gray-400 my-4"
                >
                  Or Continue With
                </p>

                <div className="flex gap-4 justify-center items-center my-3 mt-8">
                  <button
                    type="button"
                    className="flex justify-start items-center rounded-sm hover:ring-2 ring-[#555658]"
                    onClick={() => signIn("google")}
                  >
                    <FontAwesomeIcon
                      className="text-black text-2xl bg-white py-1.5 px-2 rounded-sm"
                      icon={faGoogle}
                    />
                  </button>
                  <button
                    type="button"
                    className="flex justify-start items-center rounded-sm hover:ring-2 ring-[#555658]"
                    onClick={() => signIn("github")}
                  >
                    <FontAwesomeIcon
                      className="text-black text-2xl bg-white py-1.5 px-2 rounded-sm"
                      icon={faGithub}
                    />
                  </button>
                  <FacebookLoginObj />
                </div>

                <p className="text-sm mt-10 text-textPrimary">
                  Don't have an account ?{" "}
                  <Link href="/signup" className="text-textSecondary underline">
                    Create here
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
