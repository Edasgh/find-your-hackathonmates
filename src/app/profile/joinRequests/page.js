"use client";
import LoadingComponent from "@/app/loading";

import React, { useEffect, useLayoutEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertEl from "./components/AlertEl";
import { useCreds } from "@/hooks/useCreds";
import { socket } from "@/lib/socket";
import NotFoundUser from "@/components/not-found-user";

const JoinRequests = () => {
  const { user, isLoading, error } = useCreds();
  const [loading, setLoading] = useState(isLoading);
  const [reqs, setReqs] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit("get_alerts", { userId: user._id });
      socket.on("get_alerts", ({ data }) => {
        setReqs([...data]);
        setLoading(false);
      });
    }
  }, [user]);

  if (error || user === null) {
    return (
      <>
        <div title="join requests" className="w-screen h-screen">
          <NotFoundUser />
        </div>
      </>
    );
  }

  const handleAccept = (
    message,
    senderName,
    senderId,
    teamId,
    recieverName,
    recieverId,
    reqId
  ) => {
    let tId = toast.loading("Please wait...");

    const data = {
      message,
      senderName,
      senderId,
      teamId,
      recieverName,
      recieverId,
      reqId,
    };

    socket.emit("accept-alert", { ...data });
    socket.on("accept-alert", (resp) => {
      if (resp.status === 200) {
        toast.update(tId, {
          render: "Accepted!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(tId, {
          render: resp.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    });
  };

  const handleReject = (reqId) => {
    const data = { reqId, myId: user._id };
    let tId = toast.loading("Please wait...");

    socket.emit("reject-alert", { ...data });
    socket.on("reject-alert", (resp) => {
      if (resp.status === 200) {
        toast.update(tId, {
          render: "Rejected!",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(tId, {
          render: "Something went wrong!",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    });
  };

  return (
    <>
      {loading ? (
        <div title="join requests" className="w-screen">
          <LoadingComponent />
        </div>
      ) : (
        <>
          <div
            title="join requests"
            className="flex mt-12 w-screen h-screen py-12 flex-col gap-3 justify-start bg-bgSecondary items-center"
            suppressHydrationWarning
          >
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
