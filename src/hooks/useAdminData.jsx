"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useCreds } from "./useCreds";
import { parseCustomDate } from "@/lib/dateOperations";

// Create a context for user credentials
const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  // Getting logged-in user info from custom hook
  const { user, isLoading } = useCreds();
  // ---------------- STATE VARIABLES ----------------

  const [adminError, setAdminError] = useState(false);
  const [adminDataLoading, setAdminDataLoading] = useState(true);

  // Stores monthly user growth data for line chart
  const [userGrowth, setUserGrowth] = useState([]);

  // Stores monthly team growth data
  const [teamGrowth, setTeamGrowth] = useState([]);

  // Stores top 5 skills used by users
  const [top5Skills, setTop5Skills] = useState([]);

  // Stores all users
  const [allUsers, setAllUsers] = useState([]);

  // Stores all teams
  const [allTeams, setAllTeams] = useState([]);

  // Stores all applications/requests
  const [allReqs, setAllReqs] = useState([]);

  // Total number of messages
  const [noOfMessages, setNoOfMessages] = useState(0);

  // --------------------------------------------------
  // Fetch All Dashboard Data [top 5 skills, monthly users growth , teams growth, total no. of messages]
  // (GET request)
  // --------------------------------------------------
  const getDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/admin_data");

      // Throw error if request fails
      if (!res.ok) {
        throw new Error(`Failed to fetch data : ${res.statusText}`);
      }

      const data = await res.json();
      const { top_skills, monthlyUsersData, teams, totalMessages } = data;
      setTop5Skills(top_skills || []);
      setUserGrowth(monthlyUsersData || []);
      setTeamGrowth(teams || []);
      setNoOfMessages(totalMessages || 0);
    } catch (err) {
      setAdminError(true);
      console.error("Error fetching admin dashboard data : ", err);
      setTop5Skills([]);
      setUserGrowth([]);
      setTeamGrowth([]);
      setNoOfMessages(0);
    }
  };
  // --------------------------------------------------
  // Fetch All Users, All Teams,Number of Applications (POST request with admin id)
  // --------------------------------------------------
  const fetchAdminDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/admin_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ admin: user?.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await res.json();
      const { users, teams, applications } = data;

      setAllReqs(applications || []);

      setAllTeams(teams || []);

      setAllUsers(users || []);
    } catch (err) {
      setAdminError(true);
      console.error("Error whilte getting dashboard data via post req : ", err);
      setAllReqs([]);

      setAllTeams([]);

      setAllUsers([]);
    }
  };
  // --------------------------------------------------
  // Run all dashboard API calls once user is loaded
  // --------------------------------------------------
  useEffect(() => {
    const fetchAll = async () => {
      setAdminDataLoading(true);
      try {
        await Promise.all([getDashboardData(), fetchAdminDashboardData()]);
      } catch (err) {
        setAdminError(true);
      } finally {
        setAdminDataLoading(false);
      }
    };

    // Ensure user exists and is admin
    if (user && user.isAdmin === true && !isLoading) {
      fetchAll();
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

    setAvgTeamSize(
      allTeams.length ? (totalMembers / allTeams.length).toFixed(2) : 0,
    );
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

  return (
    <AdminDataContext.Provider
      value={{
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
        setAllTeams,
        setAllUsers,
        adminError,
        adminDataLoading,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

// Hook to access the context
export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within a AdminDataProvider");
  }
  return context;
};
