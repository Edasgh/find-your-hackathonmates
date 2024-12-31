"use client";

import NotFoundUser from "@/components/not-found-user";

import { useLayoutEffect, useState } from "react";
import LoadingComponent from "../loading";
import TeamMate from "@/components/TeamMate";
import Footer from "@/components/Footer";
import {useCreds} from "@/hooks/useCreds";

export default function teamMatesPage() {
  const [loading, setLoading] = useState(false);
  const [teamMates, setTeamMates] = useState([]);
  const { user, isLoading, error } = useCreds();
 
   
  const res = async () => {
   
    if(!isLoading && user!==null)
    {
      setLoading(true);
       try {
         const resp = await fetch(`/api/teamMates`,{
          method:"POST",
          body:JSON.stringify({
            id:user._id
          })
         });
           const data = await resp.json();
           setTeamMates(data.users);
           setLoading(false);
          
       } catch (err) {
         setTeamMates([]);
         setLoading(false);
       }
    }
  };
  useLayoutEffect(() => {
    res();
  }, []);

  return (
    <>
      {loading && <LoadingComponent />}
      {!loading && user !== null ? (
        <>
          <h1 className="text-center section-title my-12 text-textPrimary poppins-semibold text-4xl">
            Connect with Teammates
          </h1>
          <div className="w-full flex flex-wrap gap-3 justify-center items-center">
            {teamMates.length != 0 ? (
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
              <>
                <h1 className="text-center w-full m-auto text-gray-500 flex justify-center items-center text-xl poppins-semibold">
                  No teammates to show
                </h1>
              </>
            )}
          </div>
          <div className="mt-[30vh]">
            <Footer />
          </div>
        </>
      ) : (
        <>
          <NotFoundUser />
          <Footer />
        </>
      )}
    </>
  );
}
