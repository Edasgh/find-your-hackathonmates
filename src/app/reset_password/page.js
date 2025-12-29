"use client";

import NotFound from "@/components/not-found";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRouter } from "next/navigation";
import { useState, use } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../loading";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";

export default function ResetPassword({ searchParams }) {
  const { user, isLoading, error } = useCreds();
  const router = useRouter();
  const { id } = use(searchParams);
  // access password & confirm password value
  const [pwObj, setPwObj] = useState({
    password: "",
    confirmPassword: "",
  });

  // to get if the password & confirm password are the same
  const [checkObj, setCheckObj] = useState({
    isSame: true,
    isStrong: false,
  });

  // to show floating labels if focused on input fields
  const [focusObj, setFocusObj] = useState({
    isPasswordFocus: false,
    isCPasswordFocus: false,
  });

  // to show / hide the password
  const [showObj, setShowObj] = useState({
    isShown: false,
    isCPShown: false,
  });

  function matchWPassword(e) {
    if (e.target.value === pwObj.password) {
      setCheckObj((prev) => ({ ...prev, isSame: true }));
    } else {
      setCheckObj((prev) => ({ ...prev, isSame: false }));
    }
  }

  function matchWCPassword(e) {
    if (e.target.value === pwObj.confirmPassword) {
      setCheckObj((prev) => ({ ...prev, isSame: true }));
    } else {
      setCheckObj((prev) => ({ ...prev, isSame: false }));
    }
  }

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  function checkPasswordStrength(password = "") {
    if (passwordRegex.test(password)) {
      setCheckObj((prev) => ({ ...prev, isStrong: true }));
    } else {
      setCheckObj((prev) => ({ ...prev, isStrong: false }));
    }
  }

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
    let tId = toast.loading("Please wait....");

    if (checkObj.isStrong !== true) {
      toast.update(tId, {
        render: "Weak Password!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });

      return;
    }

    if (checkObj.isSame !== true) {
      toast.update(tId, {
        render: "Password & Confirm password should be same!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
      return;
    }

    try {
      const data = new FormData(e.currentTarget);
      const password = data.get("password");
      const Id = id.split(":");

      const response = await fetch("/api/reset_password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: Id[0],
          password,
        }),
      });

      if (response.status === 200) {
        toast.update(tId, {
          render: "Password updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        if (!user || error) {
          setTimeout(() => {
            router.push("/profile");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }, 3000);
        } else {
          setTimeout(() => {
            router.push("/login");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }, 3000);
        }
      }
    } catch (error) {
      toast.update(tId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });

      console.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      {id ? (
        <>
          <div className="main-div w-1/3 max-[900px]:w-full p-7 m-auto mt-10 flex flex-col gap-3 justify-center items-center">
            <h1 title="reset password" className="text-center section-title text-textPrimary poppins-semibold text-[28px]">
              Create new Password
            </h1>
            <form className="login-signup-form" onSubmit={handleSubmit}>
              <span
                className={
                  checkObj.isSame
                    ? "text-xs mb-3.5 text-textSecondary opacity-100 w-auto max-[480px]:max-w-56"
                    : "text-xs mb-3.5 text-[#fa6d6d] opacity-100 w-auto max-[480px]:max-w-56"
                }
              >
                *password & confirm password should be same*
              </span>
              {pwObj.password !== "" && (
                <span
                  className={
                    checkObj.isStrong
                      ? "text-xs mb-3.5 text-green-500 opacity-100 w-auto max-[480px]:max-w-56"
                      : "text-xs mb-3.5 text-[#fa6d6d] opacity-100 w-auto max-[480px]:max-w-56"
                  }
                >
                  {checkObj.isStrong
                    ? "*Password Strength : Strong*"
                    : "*Password Strength : Weak*"}
                </span>
              )}
              <div className="flex flex-col gap-2">
                <div className="input-div">
                  <input
                    type={showObj.isShown ? "text" : "password"}
                    className="form-control text-textPrimary"
                    value={pwObj.password}
                    onChange={(e) => {
                      setPwObj((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      matchWCPassword(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    onFocus={(e) => {
                      setFocusObj((prev) => ({
                        ...prev,
                        isPasswordFocus: true,
                      }));
                      matchWCPassword(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          isPasswordFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({
                          ...prev,
                          isPasswordFocus: true,
                        }));
                      }

                      matchWCPassword(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    name="password"
                    id="password"
                    minLength={8}
                    required
                  />
                  <span
                    className={
                      "absolute top-2 left-[62%] w-[6.5rem] bg-transparent z-10"
                    }
                  >
                    <FontAwesomeIcon
                      icon={showObj.isShown ? faEyeSlash : faEye}
                      className="cursor-pointer"
                      onClick={() => {
                        setShowObj((prev) => ({
                          ...prev,
                          isShown: !showObj.isShown,
                        }));
                        document.getElementById("password").focus();
                      }}
                    />
                  </span>
                  <label
                    htmlFor="password"
                    className="labelLine"
                    style={getStyle(focusObj.isPasswordFocus)}
                  >
                    Password
                  </label>
                </div>

                <div className="input-div">
                  <input
                    type={showObj.isCPShown ? "text" : "password"}
                    className="form-control text-textPrimary"
                    value={pwObj.confirmPassword}
                    onChange={(e) => {
                      setPwObj((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }));

                      matchWPassword(e);
                    }}
                    onFocus={(e) => {
                      setFocusObj((prev) => ({
                        ...prev,
                        isCPasswordFocus: true,
                      }));

                      matchWPassword(e);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          isCPasswordFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({
                          ...prev,
                          isCPasswordFocus: true,
                        }));
                      }

                      matchWPassword(e);
                    }}
                    name="confirmPassword"
                    id="confirmPassword"
                    minLength={8}
                    required
                  />
                  <span
                    className={
                      "absolute top-2 left-[62%] w-[6.5rem] bg-transparent z-10"
                    }
                  >
                    <FontAwesomeIcon
                      icon={showObj.isCPShown ? faEyeSlash : faEye}
                      className="cursor-pointer"
                      onClick={() => {
                        setShowObj((prev) => ({
                          ...prev,
                          isCPShown: !showObj.isCPShown,
                        }));
                        document.getElementById("confirmPassword").focus();
                      }}
                    />
                  </span>
                  <label
                    htmlFor="confirmPassword"
                    className="labelLine"
                    style={getStyle(focusObj.isCPasswordFocus)}
                  >
                    Confirm Password
                  </label>
                </div>
              </div>
              <button
                className="reset-password-submit text-textPrimary hover:bg-textBgPrimaryHv hover:text-black hover:text-center px-1 py-2 w-[10rem] border-[1px] rounded-md border-textBgPrimaryHv"
                type="submit"
                id="reset-password-btn"
              >
                Create
              </button>
            </form>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <NotFound />
          <Footer />
        </>
      )}
    </>
  );
}
