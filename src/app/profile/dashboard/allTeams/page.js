"use client";
import LoadingComponent from "@/app/loading";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";
import { faArrowLeft, faEnvelope, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import DelAlert from "../../myTeams/components/delAlert";
import Link from "next/link";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useAdminData } from "@/hooks/useAdminData";
import { ProfileCell } from "../allUsers/components/ProfileCell";

const AllTeams = () => {
  // Getting logged-in user info from custom hook
  const { user, isLoading } = useCreds();


  const {
    allTeams,
    adminError,
    adminDataLoading
  } = useAdminData();


  const [selectDelTeam, setSelectDelTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [openIdx, setOpenIdx] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 6;


  // --------------------------------------------------
  // Delete a Team by id
  // --------------------------------------------------
  const DeleteTeam = async (teamId) => {
    try {
      const reqBody = { teamId: teamId };
      const resp = await fetch("/api/createTeam", {
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

  const filteredTeams = allTeams.filter((team) => {
    const query = search.toLowerCase();

    return (
      team.name?.toLowerCase().includes(query) ||
      team.hackathonName?.toLowerCase().includes(query) ||
      team.email?.toLowerCase().includes(query) ||
      team.skills?.some((skill) =>
        skill.toLowerCase().includes(query)
      ) ||
      team.members?.some((m) =>
        m.name.toLowerCase().includes(query)
      )
    );
  });

  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  const indexOfLast = currentPage * teamsPerPage;
  const indexOfFirst = indexOfLast - teamsPerPage;

  const currentTeams = filteredTeams.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


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
  if (adminError || user === null || user.isAdmin === false) {
    return (
      <div about="admin_dashboard_teams" className="w-screen h-screen">
        <NotFoundUser />
      </div>
    );
  }

  // --------------------------------------------------
  // Dashboard UI
  // --------------------------------------------------

  return (
    <div className="w-full max-w-7xl pb-48 relative">
      <Link href={"/profile/dashboard"}>
        <FontAwesomeIcon icon={faArrowLeft} className="absolute text-white text-3xl font-semibold left-0 top-0 cursor-pointer" />
      </Link>
      <h2 className="text-white text-2xl font-semibold text-center mb-6">
        All Teams ({allTeams?.length || 0})
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-md bg-bgSecondary text-white outline-none w-full max-w-sm"
        />
      </div>

      <p className="text-sm text-gray-400 mb-2">
        {search ? (
          <>
            Showing {currentTeams.length} of {filteredTeams.length} results for{" "}
            <span className="text-white">"{search}"</span>
          </>
        ) : (
          <>
            Showing {currentTeams.length} of {allTeams.length} teams
          </>
        )}
      </p>

      <div className="bg-bgPrimary rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-bgSecondary/80 text-gray-200 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3">Team Name</th>
              <th className="px-6 py-3">Hackathon</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Skills</th>
              <th className="px-6 py-3">Members</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Last Active</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentTeams.length > 0 ? (
              currentTeams.map((team) => (
                <tr
                  key={team._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {team.name}
                  </td>

                  <td className="px-6 py-4">{team.hackathonName}</td>

                  <td className="px-6 py-4 flex flex-col gap-5 justify-end items-center">
                    <Link href={`mailTo:${team.email}`} target="_blank">

                      <FontAwesomeIcon icon={faEnvelope} /> {team.email}</Link>
                    <Link href={team.links[0].link} className="hover:underline flex gap-1 justify-center items-center text-wrap whitespace-nowrap" target="_blank">
                      <FontAwesomeIcon icon={faGithub} />
                      {team.links[0].link}
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(
                        team.skills
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

                  <td className="py-4 px-2 text-xs flex flex-wrap gap-2">{team.members?.length === 0 ? (<span style={{ fontStyle: "italic" }} className="text-xs text-gray-400">
                    {`Nobody joined team ${team.name} yet`}
                  </span>) : (
                    <>
                      {team.members.map((t) => (
                        <span key={t.id._id} onClick={() => {
                          if (selectedUser !== null) {
                            setSelectedUser(null)
                          } else {
                            setSelectedUser(t.id)
                          }
                        }} className="underline hover:text-blue-500 font-semibold text-xs cursor-pointer">
                          {t.id.name}
                        </span>
                      ))}
                    </>
                  )}</td>

                  <td className="px-6 py-4 max-w-xs truncate">
                    {team.description}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex flex-wrap gap-2 justify-center items-center">
                    <span className="flex gap-1 justify-center items-center  cursor-pointer" onClick={() => {
                      setOpenIdx("delTeam");
                      setSelectDelTeam(team);
                    }}
                      suppressHydrationWarning
                      suppressContentEditableWarning
                    >
                      <FontAwesomeIcon
                        className="text-sm text-red-500"
                        icon={faTrashCan}
                      />

                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-400">
                  No Teams Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">

        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1
              ? "bg-textBgPrimaryHv text-black"
              : "bg-gray-700"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <DelAlert
        open={openIdx}
        setOpen={setOpenIdx}
        teamId={selectDelTeam?._id}
        teamName={selectDelTeam?.name}
        deleteTeam={() => DeleteTeam(selectDelTeam?._id)}
      />
      <ProfileCell
        user={selectedUser}
        open={selectedUser !== null}
        setOpen={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default AllTeams;
