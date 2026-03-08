"use client"; // Ensures this component runs on the client side in Next.js

// Importing required components and utilities
import LoadingComponent from "@/app/loading"; // Loading screen component
import NotFoundUser from "@/components/not-found-user"; // Shown if user is not admin or not found
import { useCreds } from "@/hooks/useCreds"; // Custom hook to get logged-in user credentials
import { parseCustomDate } from "@/lib/dateOperations"; // Utility to parse custom date formats
import { useEffect, useState } from "react";

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

const Dashboard = () => {
  // Getting logged-in user info from custom hook
  const { user, isLoading, error } = useCreds();

  //router
  const router = useRouter();

  // ---------------- STATE VARIABLES ----------------

  // Stores monthly user growth data for line chart
  const [userGrowth, setUserGrowth] = useState([]);

  // Stores monthly team growth data
  const [teamGrowth, setTeamGrowth] = useState([]);

  // Stores top 5 skills used by users
  const [top5Skills, setTop5Skills] = useState([]);

  // Stores all users
  const [allUsers, setAllUsers] = useState([]);

  // Total number of users
  const [noOfUsers, setNoOfUsers] = useState(0);

  // Stores all teams
  const [allTeams, setAllTeams] = useState([]);

  // Total number of teams
  const [noOfTeams, setNoOfTeams] = useState(0);

  // Stores all applications/requests
  const [allReqs, setAllReqs] = useState([]);

  // Total applications
  const [noOfReqs, setNoOfReqs] = useState(0);

  // Total number of messages
  const [noOfMessages, setNoOfMessages] = useState(0);

  // --------------------------------------------------
  // Fetch Top 5 Skills
  // --------------------------------------------------
  const topSkills = async () => {
    try {
      const res = await fetch("/api/admin/top_skills");

      // Throw error if request fails
      if (!res.ok) {
        throw new Error(`Failed to fetch top skills : ${res.statusText}`);
      }

      const data = await res.json();

      // Save skills data
      setTop5Skills(data.skills || []);
    } catch (error) {
      // If error occurs, reset state
      setTop5Skills([]);
    }
  };

  // --------------------------------------------------
  // Fetch Monthly User Growth
  // --------------------------------------------------
  const monthlyUsers = async () => {
    try {
      const res = await fetch("/api/admin/users_growth");

      if (!res.ok) {
        throw new Error(`Failed to fetch users per month: ${res.statusText}`);
      }

      const data = await res.json();

      // Set user growth data
      setUserGrowth(data.data || []);
    } catch (error) {
      setUserGrowth([]);
    }
  };

  // --------------------------------------------------
  // Fetch All Users (POST request with admin id)
  // --------------------------------------------------
  const fetchUsers = async () => {
    try {
      const resp = await fetch(`/api/admin/users_growth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // Send admin id
        body: JSON.stringify({ admin: user?._id }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch all users: ${resp.statusText}`);
      }

      const data = await resp.json();

      // Store users
      setAllUsers(data.users || []);

      // Save count
      setNoOfUsers(data.users?.length || 0);
    } catch (error) {
      // Reset if failed
      setAllUsers([]);
      setNoOfUsers(0);
    }
  };

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

      setAllTeams(data.teams || []);
      setNoOfTeams(data.teams?.length || 0);
    } catch (error) {
      setAllTeams([]);
      setNoOfTeams(0);
    }
  };

  // --------------------------------------------------
  // Fetch Team Growth Data (for chart)
  // --------------------------------------------------
  const fetchTeamGrowth = async () => {
    try {
      const res = await fetch("/api/admin/teams_growth");

      if (!res.ok) {
        throw new Error("Failed to fetch teams growth");
      }

      const data = await res.json();

      setTeamGrowth(data.teams || []);
    } catch (error) {
      setTeamGrowth([]);
    }
  };

  // --------------------------------------------------
  // Fetch Number of Applications
  // --------------------------------------------------
  const fetchNoOfApplications = async () => {
    try {
      const res = await fetch("/api/admin/no_of_reqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ admin: user?._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await res.json();

      setAllReqs(data.applications || []);
      setNoOfReqs(data.applications?.length || 0);
    } catch (error) {
      setAllReqs([]);
      setNoOfReqs(0);
    }
  };

  // --------------------------------------------------
  // Fetch Total Messages
  // --------------------------------------------------
  const fetchNoOfMessages = async () => {
    try {
      const res = await fetch("/api/admin/total_messages");

      if (!res.ok) {
        throw new Error("Failed to fetch messages!");
      }

      const data = await res.json();

      setNoOfMessages(data.totalMessages || 0);
    } catch (error) {
      setNoOfMessages(0);
    }
  };

  // --------------------------------------------------
  // Run all dashboard API calls once user is loaded
  // --------------------------------------------------
  useEffect(() => {
    // Ensure user exists and is admin
    if (user && user.isAdmin === true && !isLoading) {
      monthlyUsers();
      topSkills();
      fetchTeamGrowth();
      fetchUsers();
      fetchTeams();
      fetchNoOfApplications();
      fetchNoOfMessages();
    }
  }, [user, isLoading]);

  // --------------------------------------------------
  // Additional Dashboard Statistics
  // --------------------------------------------------

  const [teamsCreatedThisWeek, setTeamsCreatedThisWeek] = useState(0);
  const [avgTeamSize, setAvgTeamSize] = useState(0);

  useEffect(() => {
    const now = new Date();

    // Find start of current week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Count teams created this week
    const count = allTeams.filter((team) => {
      const created = new Date(team.createdAt);
      return created >= startOfWeek;
    }).length;

    setTeamsCreatedThisWeek(count);

    // Calculate average team size
    const totalMembers = allTeams.reduce(
      (sum, team) => sum + team.members.length,
      0,
    );

    setAvgTeamSize((totalMembers / allTeams.length).toFixed(2));
  }, [allTeams]);

  // --------------------------------------------------
  // Active Teams (Teams with messages in last 7 days)
  // --------------------------------------------------

  const [activeTeams, setActiveTeams] = useState([]);

  useEffect(() => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const activeTeams = allTeams.filter((team) =>
      team.messages?.some((msg) => {
        const sentDate = parseCustomDate(msg.sentOn);
        return sentDate >= last7Days;
      }),
    );

    setActiveTeams(activeTeams);
  }, [allTeams]);

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
          count={noOfUsers}
          label={"View Users"}
        />
        <StatCard
          onClick={() => {
            router.push("/profile/dashboard/allTeams");
          }}
          label={"View Teams"}
          name={"Teams"}
          count={noOfTeams}
        />
        <StatCard name={"Applications"} count={noOfReqs} />
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
