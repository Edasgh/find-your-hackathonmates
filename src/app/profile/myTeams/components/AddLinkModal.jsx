"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const AddLinkModal = ({ open, setOpen, handleAddLink }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const handleClose = () => {
    setOpen(null);
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
        visibility: open==="addLinks" ? "visible" : "hidden",
        zIndex: open==="addLinks" ? "100" : "-1",
      }}
    >
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
          <h1 className="text-textPrimary font-semibold text-2xl">
            Add a new Link
          </h1>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <form
          className="flex flex-col gap-3 w-full"
          onSubmit={(e) => {
            handleAddLink(e);
            setLink("");
            setName("");
            setOpen(false);
          }}
        >
          <input
            type="text"
            value={name}
            name="linkName"
            id="linkName"
            placeholder="Type the link name here..."
            className="px-2 py-1 rounded-sm bg-bgSecondary"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            suppressContentEditableWarning
            required
          />
          <input
            type="text"
            name="link"
            id="link"
            value={link}
            placeholder="Type the link here..."
            className="px-2 py-1 rounded-sm bg-bgSecondary"
            onChange={(e) => setLink(e.target.value)}
            autoComplete="off"
            suppressContentEditableWarning
            required
          />
          <button
            className="add-link bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;
