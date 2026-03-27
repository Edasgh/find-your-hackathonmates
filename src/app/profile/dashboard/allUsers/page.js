"use client";
import LoadingComponent from "@/app/loading";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";
import { faArrowLeft, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { ProfileCell } from "./components/ProfileCell";
import { DeleteUserAlert } from "./components/DeleteUserAlert";
import Link from "next/link";
import { useAdminData } from "@/hooks/useAdminData";
import TeamEl from "../../joinRequests/components/TeamEl";


const AllUsers = () => {
  // Getting logged-in user info from custom hook
  const { user, isLoading, error } = useCreds();

  // fetching users, error-status from the custom hook
  const {
    allUsers,
    adminError,
    adminDataLoading
  } = useAdminData();

  //selected profile to view
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectDelUser, setSelectDelUser] = useState(null);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

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

  const filteredUsers = allUsers.filter((u) => {
    const query = search.toLowerCase();

    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.country?.toLowerCase().includes(query) ||
      u.githubID?.toLowerCase().includes(query) ||
      u.skills?.some((skill) =>
        skill.toLowerCase().includes(query)
      )
      ||
      u.teams?.some((team) =>
        team.name.toLowerCase().includes(query)
      )
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );


  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------
  if (isLoading || adminDataLoading) {
    return (
      <div className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-screen">
        <LoadingComponent />
      </div>
    );
  }

  // --------------------------------------------------
  // Unauthorized or Not Found
  // --------------------------------------------------
  if (error || adminError || user === null || user.isAdmin === false) {
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
        All Users ({allUsers?.length || 0})
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="px-4 py-2 rounded-md bg-bgSecondary text-white outline-none w-full max-w-sm"
        />
      </div>
      {search.trim().length > 0 ? (
        <p className="mb-4 flex justify-between items-center text-center text-xs font-semibold text-slate-300">
          Showing {currentUsers.length} matching results for "{search.toLowerCase()}"
        </p>
      ) : (
        <p className="mb-4 flex justify-between items-center text-center text-xs font-semibold text-slate-300">
          Showing {currentUsers.length} users of  {allUsers.length} users
        </p>
      )}

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
            {currentUsers.length > 0 ? (
              currentUsers.map((u) => (
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
                      {[...new Set(
                        u.skills
                          ?.map(skill => skill.trim())
                          .filter(skill => skill !== "")
                      )]
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="bg-gray-700/80 text-gray-200 px-2 py-1 rounded-md text-xs border border-white/10"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </td>

                  <td className={`${u.teams?.length === 0 ? "py-4 text-xs" : "py-4 px-2 text-xs flex flex-wrap gap-2"}`}>{u.teams?.length === 0 ? (<span style={{ fontStyle: "italic" }} className="text-xs text-gray-400">
                    {`${u.name} hasn't join any team yet`}
                  </span>) : (
                    <>
                      {u.teams.map((t) => (
                        <span key={t._id} onClick={() => {
                          if (selectedTeam !== null) {
                            setSelectedTeam(null)
                          } else {
                            setSelectedTeam(t)
                          }
                        }} className="bg-gray-700 px-2 py-1 rounded text-xs cursor-pointer">
                          {t.name}
                          <TeamEl open={selectedTeam !== null} team={selectedTeam} />
                        </span>
                      ))}
                    </>
                  )}</td>

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

                    </button>
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
      <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">

        <button
          onClick={() => {
            setCurrentPage((p) => Math.max(p - 1, 1));
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentPage(i + 1)
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className={`px-3 py-1 rounded ${currentPage === i + 1
              ? "bg-textBgPrimaryHv text-black"
              : "bg-gray-700"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => {
            setCurrentPage((p) => Math.min(p + 1, totalPages))
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }

          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <DeleteUserAlert
        userId={selectDelUser?._id || null}
        userName={selectDelUser?.name || null}
        open={selectDelUser !== null}
        setOpen={() => setSelectDelUser(null)}
        deleteUser={deleteUser}
      />
      <ProfileCell
        user={selectedUser}
        open={selectedUser !== null}
        setOpen={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default AllUsers;
