"use client";
import useChat from "@/hooks/useChat";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSkillsModal = ({ open, setOpen, skillsArr }) => {
  const { teamId } = useChat();
  const [skills, SetSkills] = useState([...skillsArr]);
  const handleEditSkills = async () => {
    const obj = {
      teamId: teamId,
      skillsArr: skills.split(","),
    };
    try {
      const resp = await fetch("/api/updateSkills", {
        method: "POST",
        body: JSON.stringify(obj),
      });
      if (resp.status !== 200) {
        throw new Error("Something went wrong!");
      } else {
        toast.success("Skills updated successfully!", {
          containerId: "edit_skills",
        });
      }
    } catch (error) {
      toast.error(error.message, { containerId: "edit_skills" });
      console.log(error);
    } finally {
      setTimeout(() => {
        setOpen(false);
      }, 1800);
    }
  };

  return (
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
        visibility: open === "skills" ? "visible" : "hidden",
        zIndex: open === "skills" ? "100" : "-1",
      }}
    >
      <ToastContainer
        position="top-center"
        theme="dark"
        containerId={"edit_skills"}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.4rem",
        }}
        className="bg-bgPrimary text-textPrimary p-7 w-fit"
      >
        <div className="flex gap-2 justify-between items-center w-full">
          <span></span>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
        <form
          className="flex flex-col gap-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSkills(e);
          }}
        >
          <textarea
            className="bg-bgPrimary w-[20rem] h-[10rem] resize-none border-textPrimary border-[1.5px] outline-none rounded-md py-2 px-5"
            id="skills"
            name="skills"
            value={skills}
            onChange={(e) => {
              SetSkills(e.target.value);
            }}
          ></textarea>
          <button
            className="add-link bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            type="submit"
          >
            Update Skills
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSkillsModal;
