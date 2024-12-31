"use client";

import NotFoundUser from "@/components/not-found-user";

import { useLayoutEffect, useState } from "react";
import LoadingComponent from "../loading";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";

export default function Teams() {
  const {user, isLoading,error} = useCreds();
  const [loading, setLoading] = useState(isLoading);
  const [teamsData, setTeamsData] = useState([]);
  const userDetails= user;
  
  const res = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`/api/createTeam?id=${user._id}`);
      const data = await resp.json();

      setTeamsData(data.teams);
      setLoading(false);
    } catch (err) {
      setTeamsData([]);
      setLoading(false);
    }
  };
  useLayoutEffect(() => {
    if(userDetails!==null)
    {
      res();
    }
  }, []);

  return (
    <>
      {loading ? (
        <>
          <LoadingComponent />
        </>
      ) : (
        <>
          {userDetails !== null ? (
            <>
              <h1 className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl">
                Join new Teams
              </h1>
              <div className="w-full flex flex-wrap gap-3">
                {teamsData.length !== 0 ? (
                  teamsData.map((t, index) => (
                    <Team
                      key={index}
                      id={t._id}
                      index={index}
                      desc={t.description}
                      email={t.email}
                      githubLink={t.links[0].link}
                      members={t.members}
                      admin={t.admin}
                      name={t.name}
                      skills={t.skills}
                    />
                  ))
                ) : (
                  <>
                    <h1 className="text-center w-full m-auto text-gray-500 flex justify-center items-center text-xl poppins-semibold">
                      No teams to show
                    </h1>
                  </>
                )}
              </div>
              <div className="mt-[30vh]">
               <Footer/>
              </div>
            </>
          ) : (
            <>
              <NotFoundUser />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  );
}
