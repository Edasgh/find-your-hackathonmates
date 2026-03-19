"use client"; // Ensures this component runs on the client side in Next.js

// Importing required components and utilities
import LoadingComponent from "@/app/loading"; // Loading screen component
import NotFoundUser from "@/components/not-found-user"; // Shown if user is not admin or not found
import { useCreds } from "@/hooks/useCreds"; // Custom hook to get logged-in user credentials

import { useRouter } from "next/navigation";

// Importing chart components from Recharts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Importing dashboard UI components
import StatCard from "./components/StatCard";
import Recents from "./components/Recents";
import UsersPieChart from "./components/UsersPieChart";
import MessagesChart from "./components/MessagesChart";
import { useAdminData } from "@/hooks/useAdminData";

const Dashboard = () => {
  // Getting logged-in user info from custom hook
  const { user, isLoading, error } = useCreds();
  const {
    allReqs,
    allTeams,
    allUsers,
    top5Skills,
    userGrowth,
    teamGrowth,
    noOfMessages,
    teamsCreatedThisWeek,
    avgTeamSize,
    activeTeams,
    adminError,
    adminDataLoading
  } = useAdminData();

  //router
  const router = useRouter();


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
      <div about="admin_dashboard" className="w-screen h-screen">
        <NotFoundUser />
      </div>
    );
  }

  // --------------------------------------------------
  // Dashboard UI
  // --------------------------------------------------
  return (
    <>
      {/* Dashboard Title */}
      <h2 className="text-white font-bold text-4xl">Admin Dashboard</h2>
      {/* Statistic Cards */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <StatCard
          onClick={() => {
            router.push("/profile/dashboard/allUsers");
          }}
          name={"Users"}
          count={allUsers?.length || 0}
          label={"View Users"}
        />
        <StatCard
          onClick={() => {
            router.push("/profile/dashboard/allTeams");
          }}
          label={"View Teams"}
          name={"Teams"}
          count={allTeams?.length || 0}
        />
        <StatCard name={"Applications"} count={allReqs?.length || 0} />
        <StatCard name={"Messages"} count={noOfMessages} />
      </div>
      <div className="flex max-[1024px]:flex-col flex-row gap-5 justify-center items-center max-[1024px]:w-full w-[67.5%]">
        {/* User Growth Chart */}
        <div className="bg-bgPrimary max-[1024px]:p-3 p-6 rounded-xl w-full flex-1">
          <h2 className="text-xl font-semibold mb-4 text-white">User Growth</h2>
          {userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No user data yet</p>
          )}
        </div>
        {/* Popular Skills Chart */}
        <div className="bg-bgPrimary max-[1024px]:p-3 p-6 rounded-xl w-full flex-1">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Most Popular Skills
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top5Skills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Users Pie Chart */}
      {/* Messages Chart */}
      <div className="flex flex-wrap justify-between gap-5 p-6 rounded-xl max-[1024px]:w-full w-[70.58%]">
        <UsersPieChart allTeams={allTeams} allUsers={allUsers} />
        <MessagesChart allTeams={allTeams} />
      </div>
      <div className="max-[1024px]:w-full w-[67.5%] flex flex-wrap justify-between gap-5">
        <div className="bg-bgPrimary p-6 rounded-md text-white flex-1 hover:shadow-xl hover:-translate-y-1 transition">
          {teamsCreatedThisWeek > 0 ? (
            <p className="font-semibold">
              {" "}
              {teamsCreatedThisWeek} Team(s) created this week
            </p>
          ) : (
            <p style={{ fontStyle: "italic" }} className="text-gray-400">
              No Team created this week
            </p>
          )}
        </div>
        <div className="bg-bgPrimary flex-1 p-5 border-none rounded-md text-start hover:shadow-xl hover:-translate-y-1 transition">
          <p className="text-white font-semibold text-xl">Average Team Size</p>
          <p className="text-gray-400 font-semibold text-sm">{avgTeamSize}+</p>
        </div>
        <div className="bg-bgPrimary flex-1 p-5 border-none rounded-md text-start hover:shadow-xl hover:-translate-y-1 transition">
          <p className="text-white font-semibold text-xl">
            Active Teams (Last 7 Days)
          </p>
          {activeTeams.length > 0 ? (
            <ul>
              {activeTeams.map((team) => (
                <li className="text-gray-300 font-light" key={team._id}>
                  {team.name}
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{ fontStyle: "italic" }}
              className="text-gray-400 text-sm"
            >
              No Active Team this week
            </p>
          )}
        </div>
      </div>
      {/* Teams Growth Chart */}
      <div className="bg-bgPrimary p-6 rounded-xl max-[1024px]:w-full w-[67.5%]">
        <h2 className="text-xl font-semibold mb-4 text-white">Teams Created</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="teams" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Recent Activity */}
      <div className="bg-bgPrimary p-6 rounded-xl max-[1024px]:w-full w-[67.5%]">
        <Recents
          applications={allReqs}
          allTeams={allTeams}
          allUsers={allUsers}
        />
      </div>
    </>
  );
};

export default Dashboard;
