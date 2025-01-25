"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import Link from "next/link";

import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingComponent from "../loading";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";

export default function Login() {
  const { user, isLoading, error } = useCreds();
  //router
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isLoading && user) {
      router.push("/teams");
      setTimeout(() => {
        window.location.reload();
      }, 80);
    }
  }, [isLoading, user, router]);

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
    let tId;

    try {
      const data = new FormData(e.currentTarget);
      const email = data.get("emailLogin");
      const password = data.get("passwordLogin");

      tId = toast.loading("Logging you in....");

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.update(tId, {
          render: "Logged in Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        router.push(`/teams`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Wrong email or password!");
      }
    } catch (error) {
      toast.update(tId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
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
          <ToastContainer position="top-center" theme="dark" />
          <div className="main-div w-1/3 max-[900px]:w-full p-7 m-auto mt-10 flex flex-col gap-2 justify-center items-center">
            <h1 className="section-title poppins-semibold text-textPrimary text-[28px]">
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
                <p className="text-sm my-2 text-textPrimary">
                  Don't have an account ?{" "}
                  <Link href="/signup" className="text-textSecondary underline">
                    Create here
                  </Link>
                </p>
              </div>
              <button
                className="login-submit hover:bg-textBgPrimaryHv text-textPrimary hover:text-black hover:text-center px-1 py-2 w-[10rem] border-[1px] rounded-md border-textBgPrimaryHv"
                type="submit"
                id="login-btn"
                suppressHydrationWarning
              >
                Log In
              </button>
            </form>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
