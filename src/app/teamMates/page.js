"use client";

import { useEffect, useState } from "react";
import LoadingComponent from "../loading";
import TeamMate from "@/components/TeamMate";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";
import NotFoundUser from "@/components/not-found-user";

export default function TeamMatesPage() {
  const { user, isLoading } = useCreds();
  const [loading, setLoading] = useState(isLoading||true);
  const [teamMates, setTeamMates] = useState([]);
  const [allTeamMates,setAllTeamMates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeammates = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/teamMates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?.id }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch teammates: ${resp.statusText}`);
      }

      const data = await resp.json();
      setTeamMates(data.users || []);
      setAllTeamMates(data.users||[])
    } catch (err) {
      setTeamMates([]);
       setAllTeamMates([]);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      if(allTeamMates.length===0||teamMates.length===0){
        fetchTeammates();
      }
    }

    if (!user && loading) {
      setLoading(false)
    }
    
  }, [isLoading, user]);

  if (isLoading || loading) {
    return <LoadingComponent />;
  }

  if (!user) {
    return (
      <>
        <div about="teammates" className="w-screen h-screen">
          <NotFoundUser />
        </div>
      </>
    );
  }

  const searchTeamMates = async (ev, value) => {
    ev.preventDefault();

    const data = [...allTeamMates];

    if (value === "") {
      await fetchTeammates();
      return;
    }

    // Filter teamMates based on the input value (case-insensitive)
    const filteredTeamMate = data.filter(
      (e) =>
        (e.skills &&
          e.skills.some(
            (m) => m.toString().trim().toUpperCase() === value.toUpperCase().trim()
          ))
    );


    // Set the filtered result as the new teamMates state
    setTeamMates(filteredTeamMate);
  };

  return (
    <>
      <h1
        about="teammates"
        className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl"
      >
        Connect with Teammates
      </h1>

      <form
        id="team_mates_form"
        className="flex flex-wrap justify-center gap-2 items-center mb-10"
        onSubmit={(e) => searchTeamMates(e, searchTerm)}
      >
        <input
          type="text"
          className={`w-fit text-textPrimary py-2 px-5 border-[1px] border-textPrimary/40 rounded-md outline-none ${teamMates.length === 0
            ? "bg-bgPrimary"
            : " bg-black"}`

          }
          name="search_teamMates"
          id="search_teamMates"
          placeholder="Search by skill..."
          onKeyUp={(e) => {
            setSearchTerm(e.target.value);
          }}
          disabled={teamMates.length === 0}
        />
        <button
          type="submit"
          disabled={teamMates.length === 0}
          className={
            `px-6 py-2 w-fit rounded-lg font-medium
                      bg-gradient-to-r from-purple-500 to-indigo-500
                     text-white
                      hover:scale-105 active:scale-95
                      shadow-lg shadow-purple-800/20  text-center gap-2 hover:shadow-xl transition-all duration-300 ${teamMates.length === 0
              ? "cursor-not-allowed"
              : "cursor-pointer"}`
          }
        >
          Search
        </button>
        <button
          onClick={() => fetchTeammates()}
          type="button"
          className="border border-textBgPrimaryHv text-textSecondary px-6 py-2 w-fit rounded-lg hover:shadow-lg hover:shadow-purple-600/20  text-center gap-2 transition-all duration-300"
        >
          Reset
        </button>
      </form>

      <div className="w-full flex flex-wrap gap-7 justify-center items-center">
        {teamMates.length > 0 ? (
          teamMates.map((t, index) => (
            <TeamMate
              key={index}
              index={index}
              userId={t._id}
              name={t.name}
              bio={t.bio}
              email={t.email}
              githubID={t.githubID}
              skills={t.skills}
              country={t.country}
              joinedOn={t.createdAt}
            />
          ))
        ) : (
          <h1 className="text-center w-full m-auto text-gray-500 flex justify-center items-center text-xl poppins-semibold">
            No teammates to show
          </h1>
        )}
      </div>
      <div className="mt-[30vh]">
        <Footer />
      </div>
    </>
  );
}
