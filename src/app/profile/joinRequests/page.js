"use client";
import LoadingComponent from "@/app/loading";

import React, { useLayoutEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertEl from "./components/AlertEl";

const JoinRequests = () => {
  const [loading, setLoading] = useState(true);
  const [reqs, setReqs] = useState([]);
  const getJoinRequests = async () => {
    try {
      const resp = await fetch("/api/joinRequests");
      const data = await resp.json();
      if (resp.status === 200) {
        setReqs(data);
        setInterval(() => {
          setLoading(false);
        }, 900);
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      setReqs([]);
      setInterval(() => {
        setLoading(false);
      }, 900);
    }
  };

  useLayoutEffect(() => {
    getJoinRequests();
  }, []);


  const handleAccept = async (
    message,
    senderName,
    senderId,
    teamId,
    recieverName,
    recieverId,
    reqId
  ) => {
    let tId = toast.loading("Please wait...");

    try {
      const data = {
        message,
        senderName,
        senderId,
        teamId,
        recieverName,
        recieverId,
        reqId,
      };
      const resp = await fetch("/api/invitationAccept", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (resp.status === 200) {
        toast.update(tId, {
          render: "Accepted!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
        setInterval(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.update(tId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  const handleReject = async (reqId) => {
    const data = { reqId };
    let tId = toast.loading("Please wait...");
    try {
      const resp = await fetch("/api/invitationReject", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (resp.status === 200) {
        toast.update(tId, {
          render: "Rejected!",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
        setInterval(() => {
          window.location.reload();
        }, 800);
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.update(tId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      {loading ? (
        <div className="w-screen">
          <LoadingComponent />
        </div>
      ) : (
        <>
          <div className="flex mt-12 w-screen h-screen py-12 flex-col gap-3 justify-start bg-bgSecondary items-center">
            <h1 className="text-center section-title mb-5 text-textPrimary poppins-semibold text-3xl">
              Join Requests
            </h1>
            {reqs.length !== 0 ? (
              <>
                {reqs.map((r, i) => (
                  <AlertEl
                    key={i}
                    index={i}
                    r={r}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                  />
                ))}
              </>
            ) : (
              <p className="text-gray-400">No Join Requests Here!</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default JoinRequests;
