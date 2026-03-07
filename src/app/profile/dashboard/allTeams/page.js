"use client";
import LoadingComponent from "@/app/loading";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";
import React, { useEffect, useState } from "react";

const AllTeams = () => {
  // Getting logged-in user info from custom hook
  const { user, isLoading, error } = useCreds();
  // Stores all teams
  const [allTeams, setAllTeams] = useState([]);

  // Total number of teams
  const [noOfTeams, setNoOfTeams] = useState(0);
  // --------------------------------------------------
  // Fetch All Teams
  // --------------------------------------------------
  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/admin/teams_growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Send admin id
        body: JSON.stringify({ admin: user?._id }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch teams: ${res.statusText}`);
      }

      const data = await res.json();
console.log(data);

      setAllTeams(data.teams || []);
      setNoOfTeams(data.teams?.length || 0);
    } catch (error) {
      setAllTeams([]);
      setNoOfTeams(0);
    }
  };

  // --------------------------------------------------
  // Run API call once user is loaded
  // --------------------------------------------------
  useEffect(() => {
    // Ensure user exists and is admin
    if (user && user.isAdmin === true && !isLoading) {
      fetchTeams();
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
        <div about="admin_dashboard_teams" className="w-screen h-screen">
          <NotFoundUser />
        </div>
      );
    }
  
    // --------------------------------------------------
    // Dashboard UI
    // --------------------------------------------------

 return (
   <div className="w-full max-w-7xl">
     <h2 className="text-white text-2xl font-semibold text-center mb-6">
       All Teams ({noOfTeams})
     </h2>

     <div className="bg-bgPrimary rounded-lg shadow-md overflow-x-auto">
       <table className="w-full text-sm text-left text-gray-300">
         <thead className="bg-bgSecondary/80 text-gray-200 border-b border-gray-700">
           <tr>
             <th className="px-6 py-3">Team Name</th>
             <th className="px-6 py-3">Hackathon</th>
             <th className="px-6 py-3">Email</th>
             <th className="px-6 py-3">Skills</th>
             <th className="px-6 py-3">Members</th>
             <th className="px-6 py-3">Description</th>
             <th className="px-6 py-3">Created</th>
           </tr>
         </thead>

         <tbody>
           {allTeams.length > 0 ? (
             allTeams.map((team) => (
               <tr
                 key={team._id}
                 className="border-b border-gray-700 hover:bg-gray-800 transition"
               >
                 <td className="px-6 py-4 font-medium text-white">
                   {team.name}
                 </td>

                 <td className="px-6 py-4">{team.hackathonName}</td>

                 <td className="px-6 py-4">{team.email}</td>

                 <td className="px-6 py-4">
                   <div className="flex flex-wrap gap-2">
                     {team.skills?.map((skill, i) => (
                       <span
                         key={i}
                         className="bg-gray-700 px-2 py-1 rounded text-xs"
                       >
                         {skill.trim()}
                       </span>
                     ))}
                   </div>
                 </td>

                 <td className="px-6 py-4">{team.members?.length || 0}</td>

                 <td className="px-6 py-4 max-w-xs truncate">
                   {team.description}
                 </td>

                 <td className="px-6 py-4">
                   {new Date(team.createdAt).toLocaleDateString()}
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="7" className="text-center py-6 text-gray-400">
                 No Teams Found
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
   </div>
 );
};

export default AllTeams;
