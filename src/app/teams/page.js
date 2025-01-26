"use client";

import NotFoundUser from "@/components/not-found-user";
import { useEffect, useState } from "react";
import LoadingComponent from "../loading";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";
import NotFound from "@/components/not-found";

export default function Teams() {
  const { user, isLoading, error } = useCreds();
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teams data
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`/api/createTeam?id=${user._id}`);
      if (resp.status !== 200) throw new Error("Failed to fetch teams data.");
      const data = await resp.json();
      setTeamsData(data.teams);
    } catch (err) {
      setTeamsData([]);
      console.error("Error fetching teams:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      fetchTeams();
    }
  }, [isLoading, user]);

  if (isLoading || loading) {
    return <LoadingComponent />;
  }

  if (error || user === null) {
    return (
      <>
        <NotFoundUser />
        <Footer />
      </>
    );
  }

  const searchTeam = async (ev, value) => {
    ev.preventDefault();

    if (value === "") {
      await fetchTeams();
      return;
    }

    // Filter teamMates based on the input value (case-insensitive)
    const filteredTeam = teamsData.filter(
      (e) =>
        e.skills &&
        e.skills.some(
          (m) =>
            m.toString().trim().toUpperCase() === value.toUpperCase().trim()
        )
    );

    // Set the filtered result as the new teamMates state
    setTeamsData(filteredTeam);
  };
  return (
    <>
      <h1 className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl">
        Join new Teams
      </h1>
      <form
        id="teams_form"
        className="flex gap-2 justify-center items-center mb-10"
        onSubmit={(e) => searchTeam(e, searchTerm)}
      >
        <input
          type="text"
          className={
            teamsData.length === 0
              ? "w-fit text-textPrimary bg-bgPrimary py-2 px-5 border-[1px] border-textPrimary rounded-md outline-none"
              : "w-fit text-textPrimary bg-black py-2 px-5 border-[1px] border-textPrimary rounded-md outline-none"
          }
          name="search_teams"
          id="search_teams"
          placeholder="Search by skill..."
          onKeyUp={(e) => {
            setSearchTerm(e.target.value);
          }}
          disabled={teamsData.length === 0}
        />
        <button
          type="submit"
          disabled={teamsData.length === 0}
          className={
            teamsData.length === 0
              ? "w-fit border-[1px] border-textBgPrimaryHv bg-textBgPrimaryHv text-black px-6 py-2 rounded-md cursor-not-allowed"
              : "w-fit border-[1px] border-textBgPrimaryHv bg-textBgPrimaryHv text-black px-6 py-2 rounded-md cursor-pointer"
          }
        >
          Search
        </button>
        <button
          onClick={() => fetchTeams()}
          type="button"
          className="w-fit border-[1px] border-textBgPrimaryHv bg-textBgPrimaryHv text-black px-6 py-2 rounded-md cursor-pointer"
        >
          Reset
        </button>
      </form>

      <div className="w-full flex flex-wrap gap-3">
        {teamsData.length ? (
          teamsData.map((t, index) => (
            <Team
              key={index}
              id={t._id}
              hkNm={t.hackathonName}
              index={index}
              desc={t.description}
              email={t.email}
              githubLink={t.links[0]?.link || ""}
              members={t.members}
              admin={t.admin}
              name={t.name}
              skills={t.skills}
            />
          ))
        ) : (
          <h1 className="text-center w-full m-auto text-gray-500 flex justify-center items-center text-xl poppins-semibold">
            No teams to show
          </h1>
        )}
      </div>
      <div className="mt-[30vh]">
        <Footer />
      </div>
    </>
  );
}
