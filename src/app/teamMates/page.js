"use client";

import { useEffect, useState } from "react";
import LoadingComponent from "../loading";
import TeamMate from "@/components/TeamMate";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";
import NotFoundUser from "@/components/not-found-user";
import ChatBot from "@/components/ChatBot";

export default function TeamMatesPage() {
  const { user, isLoading, error } = useCreds();
  const [loading, setLoading] = useState(false);
  const [teamMates, setTeamMates] = useState([]);
  const [allTeamMates,setAllTeamMates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeammates = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/teamMates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?._id }),
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
      fetchTeammates();
    }
  }, [isLoading, user]);

  if (isLoading || loading) {
    return <LoadingComponent />;
  }

  if (error || user === null) {
    return (
      <>
        <div className="w-screen h-screen">
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
      <h1 className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl">
        Connect with Teammates
      </h1>

      <form
        id="team_mates_form"
        className="flex flex-wrap justify-center gap-2 items-center mb-10"
        onSubmit={(e) => searchTeamMates(e, searchTerm)}
      >
        <input
          type="text"
          className={
            teamMates.length === 0
              ? "w-fit text-textPrimary bg-bgPrimary py-2 px-5 border-[1px] border-textPrimary rounded-md outline-none"
              : "w-fit text-textPrimary bg-black py-2 px-5 border-[1px] border-textPrimary rounded-md outline-none"
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
            teamMates.length === 0
              ? "w-fit border-[1px] border-textBgPrimaryHv bg-textBgPrimaryHv text-black px-6 py-2 rounded-md cursor-not-allowed"
              : "w-fit border-[1px] border-textBgPrimaryHv bg-textBgPrimaryHv text-black px-6 py-2 rounded-md cursor-pointer"
          }
        >
          Search
        </button>
        <button
          onClick={() => fetchTeammates()}
          type="button"
          className="w-fit border-[1px] border-textBgPrimaryHv bg-textBgPrimaryHv text-black px-6 py-2 rounded-md cursor-pointer"
        >
          Reset
        </button>
      </form>

      <div className="w-full flex flex-wrap gap-3 justify-center items-center">
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
            />
          ))
        ) : (
          <h1 className="text-center w-full m-auto text-gray-500 flex justify-center items-center text-xl poppins-semibold">
            No teammates to show
          </h1>
        )}
      </div>
      <ChatBot />
      <div className="mt-[30vh]">
        <Footer />
      </div>
    </>
  );
}
