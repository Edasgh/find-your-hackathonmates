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

  // Fetch teams data
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`/api/createTeam?id=${user._id}`);
      if (resp.status!==200) throw new Error("Failed to fetch teams data.");
      const data = await resp.json();
      setTeamsData(data.teams);
    } catch (err) {
      console.error("Error fetching teams:", err.message);
      setTeamsData([]);
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

  if (error) {
    return (
      <NotFound/>
    );
  }

  if (!user) {
    return (
      <>
        <NotFoundUser />
        <Footer />
      </>
    );
  }

  return (
    <>
      <h1 className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl">
        Join new Teams
      </h1>
      <div className="w-full flex flex-wrap gap-3">
        {teamsData.length ? (
          teamsData.map((t, index) => (
            <Team
              key={index}
              id={t._id}
              hkNm = {t.hackathonName}
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
