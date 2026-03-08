"use client";
import LoadingComponent from "@/app/loading";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";
import { faArrowLeft, faArrowRight, faEye, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { ProfileCell } from "./components/ProfileCell";
import { DeleteUserAlert } from "./components/DeleteUserAlert";
import Link from "next/link";


const AllUsers = () => {
  // Getting logged-in user info from custom hook
  const { user, isLoading, error } = useCreds();
  // Stores all users
  const [allUsers, setAllUsers] = useState([]);

  // Total number of users
  const [noOfUsers, setNoOfUsers] = useState(0);

  //selected profile to view
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectDelUser, setSelectDelUser] = useState(null);

  // Delete an user
  const deleteUser = async (userId) => {
    try {
      const reqBody = { admin: user._id, userId };
      const resp = await fetch("/api/admin/users_growth", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      if (resp.status !== 200) {
        throw new Error("Something went wrong!");
      }
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.log(error.message);
    }
  };


  // --------------------------------------------------
  // Fetch All Users (POST request with admin id)
  // --------------------------------------------------
  const fetchUsers = async () => {
    try {
      const resp = await fetch(`/api/admin/users_growth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Send admin id
        body: JSON.stringify({ admin: user?._id }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch all users: ${resp.statusText}`);
      }

      const data = await resp.json();

      // Store users
      setAllUsers(data.users || []);

      // Save count
      setNoOfUsers(data.users?.length || 0);
    } catch (error) {
      // Reset if failed
      setAllUsers([]);
      setNoOfUsers(0);
    }
  };

  // --------------------------------------------------
  // Run API call once user is loaded
  // --------------------------------------------------
  useEffect(() => {
    // Ensure user exists and is admin
    if (user && user.isAdmin === true && !isLoading) {
      fetchUsers();
    }
  }, [user, isLoading]);

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------
  if (isLoading) {
    return (
      <div className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-screen">
        <LoadingComponent />
      </div>
    );
  }

  // --------------------------------------------------
  // Unauthorized or Not Found
  // --------------------------------------------------
  if (error || user === null || user.isAdmin === false) {
    return (
      <div about="admin_dashboard_users" className="w-screen h-screen">
        <NotFoundUser />
      </div>
    );
  }

  // --------------------------------------------------
  // Dashboard UI
  // --------------------------------------------------

  return (
    <div className="w-full max-w-7xl shadow-xl relative">
      <Link href={"/profile/dashboard"}>
        <FontAwesomeIcon icon={faArrowLeft} className="absolute text-white text-3xl font-semibold left-0 top-0 cursor-pointer" />
      </Link>
      <h2 className="text-white text-2xl font-semibold text-center mb-6">
        All Users ({noOfUsers})
      </h2>

      <div className="bg-bgPrimary rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-bgSecondary/80 text-gray-200 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Country</th>
              <th className="px-6 py-3">GitHub</th>
              <th className="px-6 py-3">Skills</th>
              <th className="px-6 py-3">Teams</th>
              <th className="px-6 py-3">Admin</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.length > 0 ? (
              allUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium text-white">{u.name}</td>

                  <td className="px-6 py-4">{u.email}</td>

                  <td className="px-6 py-4">{u.country}</td>

                  <td className="px-6 py-4">
                    <a
                      href={`https://github.com/${u.githubID}`}
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      {u.githubID}
                    </a>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {u.skills?.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">{u.teams?.length || 0}</td>

                  <td className="px-6 py-4">
                    {u.isAdmin ? (
                      <span className="text-green-400 font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="text-red-400">User</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 flex flex-wrap gap-3">
                    <button onClick={() => setSelectedUser(u)} suppressHydrationWarning suppressContentEditableWarning >
                      <FontAwesomeIcon
                        className="text-sm"
                        icon={faEye}
                      />
                      <ProfileCell
                        user={selectedUser}
                        open={selectedUser !== null}
                        setOpen={() => setSelectedUser(null)}
                      />
                    </button>

                    {/* <button>
                      <FontAwesomeIcon
                        className="text-sm text-purple-500"
                        icon={faPenToSquare}
                      />
                    </button> */}

                    <button onClick={() => {
                      setSelectDelUser(u)
                    }}
                      suppressHydrationWarning
                      suppressContentEditableWarning
                    >
                      <FontAwesomeIcon
                        className="text-sm text-red-500"
                        icon={faTrashCan}
                      />

                      <DeleteUserAlert
                        userId={selectDelUser?._id || null}
                        userName={selectDelUser?.name || null}
                        open={selectDelUser !== null}
                        setOpen={() => setSelectDelUser(null)}
                        deleteUser={deleteUser}
                      />


                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-400">
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
