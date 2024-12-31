"use client";

import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "@/app/loading";
import Footer from "@/components/Footer";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";

export default function createTeam() {
  const { user, isLoading, error } = useCreds();
  const [loading, setLoading] = useState(isLoading);
  const userDetails = user;

  // to show floating labels if focused on input fields
  const [isNameFocus, setIsNameFocus] = useState(false);
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isghFocus, setIsghFocus] = useState(false);
  const [isDescFocus, setIsDescFocus] = useState(false);
  const [isSkillsFocus, setIsSkillsFocus] = useState(false);

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
    const desc = data.get("desc");
    const github = data.get("github");
    const skills = data.get("TeamSkills");
    const email = data.get("TeamEmail");

    const skillsArr = [...skills.split(",")];

    let tId = toast.loading("Please wait....");

    try {
      let members = [{ name: userDetails.name, id: userDetails._id }];
      try {
        if (skills.includes(",") && skillsArr.length >= 5) {
          const response = await fetch("/api/createTeam", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              name: name,
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
            setInterval(() => {
              window.location.reload();
            }, 500);
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
          render: "Something went wrong!",
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

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {userDetails !== null ? (
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
                          setIsNameFocus(true);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setIsNameFocus(false);
                          } else {
                            setIsNameFocus(true);
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
                        style={getStyle(isNameFocus)}
                      >
                        Name
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        style={getStyle(isEmailFocus)}
                      >
                        Contact Email
                      </label>
                    </div>
                    <div className="input-div">
                      <input
                        type="text"
                        onFocus={() => {
                          setIsghFocus(true);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setIsghFocus(false);
                          } else {
                            setIsghFocus(true);
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
                        style={getStyle(isghFocus)}
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
                          setIsDescFocus(true);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setIsDescFocus(false);
                          } else {
                            setIsDescFocus(true);
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
                          isDescFocus
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
                          setIsSkillsFocus(true);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setIsSkillsFocus(false);
                          } else {
                            setIsSkillsFocus(true);
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
                        style={getStyle(isSkillsFocus)}
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
          ) : (
            <>
              <NotFoundUser />
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
