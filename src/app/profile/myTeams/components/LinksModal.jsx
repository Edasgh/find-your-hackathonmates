"use client";
import { faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const LinksModal = ({ links, open , setOpen }) => {
    const handleClose = () => {
        setOpen(null);
    }
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
        visibility: open === "openLinks" ? "visible" : "hidden",
        zIndex: open === "openLinks" ? "100" : "-1",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem",
          padding: "0.5rem 0.9rem",
          justifyContent: "center",
          alignItems: "center",

          borderRadius: "0.4rem",
        }}
        className="bg-bgPrimary text-textPrimary p-2 w-fit"
      >
        <div className="flex justify-between w-full">
          <h1 className="text-textPrimary font-semibold text-2xl">Links</h1>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl cursor-pointer"
            onClick={handleClose}
          />
        </div>
        {open === "openLinks" && (
          <>
            {links.length !== 0 &&
              links.map((link, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center gap-2 text-textPrimary"
                >
                  <FontAwesomeIcon icon={faLink} />
                  <Link href={`${link.link}`} target="_blank">
                    {link.name} : {link.link}{" "}
                  </Link>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LinksModal;
