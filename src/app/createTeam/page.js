"use client";

import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "@/app/loading";
import Footer from "@/components/Footer";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";
import { useRouter } from "next/navigation";

const urlRegex = /^(https?:\/\/[^\s< >\{\}\[\]]+)$/;

export default function createTeam() {
  const router = useRouter();
  const { user, isLoading, error } = useCreds();
  const userDetails = user;

  // to show floating labels if focused on input fields
  const [focusObj, setFocusObj] = useState({
    nameFocus: false,
    hkNmFocus: false,
    emailFocus: false,
    ghFocus: false,
    descFocus: false,
    skillsFocus: false,
  });

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
    const name = data.get("TeamName");
    const hkNm = data.get("hkNm");
    const desc = data.get("desc");
    const github = data.get("github");
    const skills = data.get("TeamSkills");
    const email = data.get("TeamEmail");

    const skillsArr = [...skills.split(",")];

    let tId = toast.loading("Please wait....");

    try {
      let members = [{ name: userDetails.name, id: userDetails._id }];
      try {
        if (!urlRegex.test(github)) {
          throw new Error("Invalid github link");
        }

        if (!github.includes("github.com")) {
          throw new Error("Not a GitHub link.");
        }

        if (skills.includes(",") && skillsArr.length >= 5) {
          const response = await fetch("/api/createTeam", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              hackathonName: hkNm,
              email: email,
              members: members,
              admin: userDetails._id,
              links: [{ name: "Github Link", link: github }],
              description: desc,
              skills: skillsArr,
            }),
          });

          if (response.status === 201) {
            toast.update(tId, {
              render: "Team Created Successsfully!",
              type: "success",
              isLoading: false,
              autoClose: 1000,
              closeButton: true,
            });
            router.push("/profile/myTeams");
            setTimeout(() => {
              window.location.reload();
            }, 300);
          } else {
            throw new Error("Something went wrong!");
          }
        } else {
          toast.update(tId, {
            render:
              "Skills should be ',' separated and Atleast 5 skills should be added!",
            type: "error",
            isLoading: false,
            autoClose: 2000,
            closeButton: true,
          });
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
    } catch (error) {
      toast.update(tId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    }
  };

  if (error) {
    return (
      <>
        <div className="w-screen h-screen">
          <NotFoundUser />
        </div>
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {userDetails !== null && (
            <>
              <ToastContainer position="top-center" theme="dark" />
              <div className="main-div w-1/3 max-[900px]:w-full  p-7 m-auto mt-10 flex flex-col gap-2 justify-center items-center">
                <h1 className="text-center mb-2 section-title text-textPrimary poppins-semibold text-[28px]">
                  Create a new Team
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="login-signup-form"
                  id="create-team"
                >
                  <div className="flex flex-wrap gap-2">
                    <div className="input-div">
                      <input
                        type="text"
                        onFocus={() => {
                          setFocusObj((prev) => ({
                            ...prev,
                            nameFocus: true,
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setFocusObj((prev) => ({
                              ...prev,
                              nameFocus: false,
                            }));
                          } else {
                            setFocusObj((prev) => ({
                              ...prev,
                              nameFocus: true,
                            }));
                          }
                        }}
                        id="TeamName"
                        name="TeamName"
                        aria-describedby="TeamName"
                        className="text-textPrimary"
                        suppressHydrationWarning
                        required
                      />
                      <label
                        htmlFor="TeamName"
                        className="labelLine"
                        style={getStyle(focusObj.nameFocus)}
                      >
                        Name
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="input-div">
                      <input
                        type="text"
                        onFocus={() => {
                          setFocusObj((prev) => ({
                            ...prev,
                            hkNmFocus: true,
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setFocusObj((prev) => ({
                              ...prev,
                              hkNmFocus: false,
                            }));
                          } else {
                            setFocusObj((prev) => ({
                              ...prev,
                              hkNmFocus: true,
                            }));
                          }
                        }}
                        id="hkNm"
                        name="hkNm"
                        aria-describedby="hkNm"
                        className="text-textPrimary"
                        suppressHydrationWarning
                        required
                      />
                      <label
                        htmlFor="hkNm"
                        className="labelLine"
                        style={getStyle(focusObj.hkNmFocus)}
                      >
                        Hackathon Name
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="input-div">
                      <input
                        type="email"
                        onFocus={() => {
                          setFocusObj((prev) => ({
                            ...prev,
                            emailFocus: true,
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setFocusObj((prev) => ({
                              ...prev,
                              emailFocus: false,
                            }));
                          } else {
                            setFocusObj((prev) => ({
                              ...prev,
                              emailFocus: true,
                            }));
                          }
                        }}
                        id="TeamEmail"
                        name="TeamEmail"
                        aria-describedby="TeamEmail"
                        className="text-textPrimary"
                        autoComplete="off"
                        suppressHydrationWarning
                        required
                      />
                      <label
                        htmlFor="TeamEmail"
                        className="labelLine"
                        style={getStyle(focusObj.emailFocus)}
                      >
                        Contact Email
                      </label>
                    </div>
                    <div className="input-div">
                      <input
                        type="text"
                        onFocus={() => {
                          setFocusObj((prev) => ({
                            ...prev,
                            ghFocus: true,
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setFocusObj((prev) => ({
                              ...prev,
                              ghFocus: false,
                            }));
                          } else {
                            setFocusObj((prev) => ({
                              ...prev,
                              ghFocus: true,
                            }));
                          }
                        }}
                        id="github"
                        name="github"
                        aria-describedby="github"
                        className="text-textPrimary"
                        autoComplete="off"
                        suppressHydrationWarning
                        required
                      />
                      <label
                        htmlFor="github"
                        className="labelLine"
                        style={getStyle(focusObj.ghFocus)}
                      >
                        Github Link
                      </label>
                    </div>
                  </div>
                  <span className="text-xs mb-2.5 text-textBgPrimaryHv hidden min-[480px]:block w-auto max-[480px]:max-w-56">
                    *Skills should be ',' separated. Eg.: React.js, Node.js,
                    Docker,MongoDB*
                    <br />
                    <br />
                    *Atleast 5 skills should be added*
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <div className="input-div">
                      <textarea
                        onFocus={() => {
                          setFocusObj((prev) => ({
                            ...prev,
                            descFocus: true,
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setFocusObj((prev) => ({
                              ...prev,
                              descFocus: false,
                            }));
                          } else {
                            setFocusObj((prev) => ({
                              ...prev,
                              descFocus: true,
                            }));
                          }
                        }}
                        id="desc"
                        name="desc"
                        aria-describedby="desc"
                        className="text-textPrimary"
                        maxLength={100}
                        autoComplete="off"
                        suppressHydrationWarning
                        required
                      ></textarea>
                      <label
                        htmlFor="desc"
                        className="labelLine"
                        style={
                          focusObj.descFocus
                            ? { ...onFocusStyle }
                            : { display: "inherit" }
                        }
                      >
                        Description
                      </label>
                    </div>
                    <span className="text-xs mb-2.5 text-textBgPrimaryHv hidden max-[480px]:block w-auto max-[500px]:max-w-56">
                      *Skills should be ',' separated. Eg.: React.js, Node.js,
                      Docker,MongoDB*
                      <br />
                      <br />
                      *Atleast 5 skills should be added*
                    </span>
                    <div className="input-div">
                      <textarea
                        onFocus={() => {
                          setFocusObj((prev) => ({
                            ...prev,
                            skillsFocus: true,
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setFocusObj((prev) => ({
                              ...prev,
                              skillsFocus: false,
                            }));
                          } else {
                            setFocusObj((prev) => ({
                              ...prev,
                              skillsFocus: true,
                            }));
                          }
                        }}
                        id="TeamSkills"
                        name="TeamSkills"
                        aria-describedby="TeamSkills"
                        className="text-textPrimary"
                        autoComplete="off"
                        title="Atleast 5 Skills should be added!"
                        suppressHydrationWarning
                        required
                      ></textarea>
                      <label
                        htmlFor="TeamSkills"
                        className="labelLine"
                        style={getStyle(focusObj.skillsFocus)}
                      >
                        Skills
                      </label>
                    </div>
                  </div>

                  <button
                    suppressHydrationWarning
                    className="submit text-textPrimary hover:bg-textBgPrimaryHv hover:text-black hover:text-center px-1 py-2 w-[10rem] border-[1px] rounded-md border-textBgPrimaryHv"
                    type="submit"
                    id="create-team-submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </>
          )}
          <div className="mt-[30vh]">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
