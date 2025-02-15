"use client";

import { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useChat from "@/hooks/useChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function EditTeam({
  open,
  setOpen,
  name,
  hackathonName,
  email,
  description,
}) {
  const { teamId } = useChat();
  //without link & skills
  // to show floating labels if focused on input fields
  const [focusObj, setFocusObj] = useState({
    nameFocus: true,
    hkNmFocus: true,
    emailFocus: true,
    descFocus: true,
  });

  const [teamObj, setTeamObj] = useState({
    name,
    hackathonName,
    email,
    description,
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
    const nm = teamObj.name;
    const hackathonNm = teamObj.hackathonName;
    const desc = teamObj.description;
    const eml = teamObj.email;

    let tId = toast.loading("Please wait....");

    if (nm === "" || hackathonNm === "" || desc === "" || eml === "") {
      toast.update(tId, {
        render: "One or more fields are empty!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });

      return;
    }

    try {
      const response = await fetch("/api/createTeam", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          name: nm,
          hackathonName: hackathonNm,
          email: eml,
          description: desc,
        }),
      });

      if (response.status === 200) {
        toast.update(tId, {
          render: "Team Updated Successsfully!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
        });

        setOpen(false);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      } else {
        throw new Error("Something went wrong!");
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
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: " #0a0b0cba",
          display: "grid",
          placeItems: "center",
          visibility: open === "edit-team" ? "visible" : "hidden",
          zIndex: open === "edit-team" ? "100" : "-1",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0.4rem",
          }}
          className="bg-bgPrimary text-textPrimary p-7 w-[400px]"
        >
          <div className="flex gap-2 justify-between items-center w-full">
            <h1 className="text-center mb-2 section-title text-textPrimary poppins-semibold text-[28px]">
              Edit Team
            </h1>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-xl cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="login-signup-form"
            id="update-team"
          >
            <div className="flex flex-wrap gap-4">
              <div className="input-div">
                <input
                  type="text"
                  style={{
                    fontSize: ".9rem",
                    maxWidth: "30rem",
                  }}
                  onFocus={(e) => {
                    setFocusObj((prev) => ({
                      ...prev,
                      nameFocus: true,
                    }));
                    setTeamObj((prev) => ({
                      ...prev,
                      name: e.target.value,
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
                      setTeamObj((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }
                  }}
                  value={teamObj.name}
                  onChange={(e) => {
                    setTeamObj((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  id="EditTeamName"
                  name="EditTeamName"
                  aria-describedby="EditTeamName"
                  className="text-textPrimary"
                  suppressHydrationWarning
                  required
                />
                <label
                  htmlFor="EditTeamName"
                  className="labelLine"
                  style={getStyle(focusObj.nameFocus)}
                >
                  Name
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="input-div">
                <input
                  type="text"
                  style={{
                    fontSize: "1rem",
                    maxWidth: "30rem",
                  }}
                  onFocus={(e) => {
                    setFocusObj((prev) => ({
                      ...prev,
                      hkNmFocus: true,
                    }));

                    setTeamObj((prev) => ({
                      ...prev,
                      hackathonName: e.target.value,
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
                      setTeamObj((prev) => ({
                        ...prev,
                        hackathonName: e.target.value,
                      }));
                    }
                  }}
                  value={teamObj.hackathonName}
                  onChange={(e) => {
                    setTeamObj((prev) => ({
                      ...prev,
                      hackathonName: e.target.value,
                    }));
                  }}
                  id="EdithkNm"
                  name="EdithkNm"
                  aria-describedby="EdithkNm"
                  className="text-textPrimary"
                  suppressHydrationWarning
                  required
                />
                <label
                  htmlFor="EdithkNm"
                  className="labelLine"
                  style={getStyle(focusObj.hkNmFocus)}
                >
                  Hackathon Name
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="input-div">
                <input
                  type="email"
                  style={{
                    fontSize: "1rem",
                    maxWidth: "40rem",
                  }}
                  onFocus={(e) => {
                    setFocusObj((prev) => ({
                      ...prev,
                      emailFocus: true,
                    }));
                    setTeamObj((prev) => ({
                      ...prev,
                      email: e.target.value,
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
                      setTeamObj((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }
                  }}
                  value={teamObj.email}
                  onChange={(e) => {
                    setTeamObj((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                  id="EditTeamEmail"
                  name="EditTeamEmail"
                  aria-describedby="EditTeamEmail"
                  className="text-textPrimary"
                  autoComplete="off"
                  suppressHydrationWarning
                  required
                />
                <label
                  htmlFor="EditTeamEmail"
                  className="labelLine"
                  style={getStyle(focusObj.emailFocus)}
                >
                  Contact Email
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="input-div">
                <textarea
                  style={{
                    fontSize: "1rem",
                    maxWidth: "30rem",
                  }}
                  onFocus={(e) => {
                    setFocusObj((prev) => ({
                      ...prev,
                      descFocus: true,
                    }));

                    setTeamObj((prev) => ({
                      ...prev,
                      description: e.target.value,
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
                      setTeamObj((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }
                  }}
                  value={teamObj.description}
                  onChange={(e) => {
                    setTeamObj((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                  id="Editdesc"
                  name="Editdesc"
                  aria-describedby="Editdesc"
                  className="text-textPrimary"
                  maxLength={100}
                  autoComplete="off"
                  suppressHydrationWarning
                  required
                ></textarea>
                <label
                  htmlFor="Editdesc"
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
            </div>

            <button
              style={{
                maxWidth: "30rem",
              }}
              suppressHydrationWarning
              className="submit text-textPrimary hover:bg-textBgPrimaryHv hover:text-black hover:text-center px-1 py-2 w-[10rem] border-[1px] rounded-md border-textBgPrimaryHv"
              type="submit"
              id="edit-team-submit"
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
