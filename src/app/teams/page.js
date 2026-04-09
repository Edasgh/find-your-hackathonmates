"use client";

import NotFoundUser from "@/components/not-found-user";
import { useEffect, useState } from "react";
import LoadingComponent from "../loading";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";

export default function Teams() {
  const { user, isLoading } = useCreds();
  const [teamsData, setTeamsData] = useState([]);
  const [allTeamsData, setAllTeamsData] = useState([]);
  const [loading, setLoading] = useState(isLoading || true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teams data
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`/api/createTeam?id=${user.id}`, {
        method: "GET",
      });
      if (resp.status !== 200) throw new Error("Failed to fetch teams data.");
      const data = await resp.json();
      setTeamsData(data.teams);
      setAllTeamsData(data.teams);
    } catch (err) {
      setTeamsData([]);
      setAllTeamsData([]);
      console.error("Error fetching teams:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      if(allTeamsData.length===0||teamsData.length===0){
        fetchTeams();
      }
    }

    if(!user && loading){
         setLoading(false)
    }
  }, [isLoading, user]);

  if (isLoading || loading) {
    return <LoadingComponent />;
  }

  if (!user) {
    return (
      <>
        <NotFoundUser />
        <Footer />
      </>
    );
  }

  const searchTeam = async (ev, value) => {
    ev.preventDefault();

    const data = [...allTeamsData];

    if (value === "") {
      await fetchTeams();
      return;
    }

    // Filter teamMates based on the input value (case-insensitive)
    const filteredTeam = data.filter(
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
      <h1 title="teams" className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl">
        Join new Teams
      </h1>
      <form
        id="teams_form"
        className="flex flex-wrap gap-2 justify-center items-center mb-10"
        onSubmit={(e) => searchTeam(e, searchTerm)}
      >
        <input
          type="text"
          className={`w-fit text-textPrimary py-2 px-5 border-[1px] border-textPrimary/40 rounded-md outline-none ${teamsData.length === 0
            ? "bg-bgPrimary"
            : " bg-black"}`

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
          className={`px-6 py-2 w-fit rounded-lg font-medium
                      bg-gradient-to-r from-purple-500 to-indigo-500
                     text-white
                      hover:scale-105 active:scale-95
                      shadow-lg shadow-purple-800/20  text-center gap-2 hover:shadow-xl transition-all duration-300 ${teamsData.length === 0
              ? "cursor-not-allowed"
              : "cursor-pointer"}`

          }
        >
          Search
        </button>
        <button
          onClick={() => fetchTeams()}
          type="button"
          className="border border-textBgPrimaryHv text-textSecondary px-6 py-2 w-fit rounded-lg hover:shadow-lg hover:shadow-purple-600/20  text-center gap-2 transition-all duration-300"
        >
          Reset
        </button>
      </form>

      <div className="w-full flex flex-wrap gap-5">
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
