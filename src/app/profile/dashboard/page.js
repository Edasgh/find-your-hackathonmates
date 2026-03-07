"use client";

import LoadingComponent from "@/app/loading";
import NotFoundUser from "@/components/not-found-user";
import { useCreds } from "@/hooks/useCreds";
import { useEffect, useState } from "react";
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

const SmallCard = ({ name, count }) => {
  return (
    <div className="bg-bgPrimary w-[15rem] p-5 border-none rounded-md text-start hover:shadow-xl hover:-translate-y-1 transition">
      <p className="text-white font-semibold text-xl">{name}</p>
      <p className="text-gray-400 font-semibold text-sm">
        {count < 6 ? count : count - 5}+
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoading, error } = useCreds();
  const [userGrowth, setUserGrowth] = useState([]);
  const [teamGrowth, setTeamGrowth] = useState([]);
  const [top5Skills, setTop5Skills] = useState([]);
  const topSkills = async () => {
    try {
      const res = await fetch("/api/admin/top_skills");
      if (!res.ok) {
        throw new Error(`Failed to fetch top skills : ${res.statusText}`);
      }
      const data = await res.json();

      setTop5Skills(data.skills || []);
    } catch (error) {
      setTop5Skills([]);
    }
  };
  const monthlyUsers = async () => {
    try {
      const res = await fetch("/api/admin/users_growth");
      if (!res.ok) {
        throw new Error(`Failed to fetch teammates: ${res.statusText}`);
      }
      const data = await res.json();

      setUserGrowth(data.data || []);
    } catch (error) {
      setUserGrowth([]);
    }
  };
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
  useEffect(() => {
    if (user && !isLoading) {
      monthlyUsers();
      topSkills();
      fetchTeamGrowth();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-screen">
        <LoadingComponent />
      </div>
    );
  }

  if (error || user === null) {
    return (
      <>
        <div about="admin_dashboard" className="w-screen h-screen">
          <NotFoundUser />
        </div>
      </>
    );
  }

  return (
    <div className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-full bg-bgSecondary">
      <div className="pt-5 px-5 w-full flex flex-col justify-start items-center gap-5">
        <h2 className="text-white font-bold text-4xl">Admin Dashboard</h2>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <SmallCard name={"Users"} count={35} />
          <SmallCard name={"Teams"} count={35} />
          <SmallCard name={"Applications"} count={35} />
          <SmallCard name={"Messages"} count={35} />
        </div>
        <div className="flex max-[1024px]:flex-col flex-row gap-5 justify-center items-center max-[1024px]:w-full w-[67.5%]">
          <div className="bg-bgPrimary max-[1024px]:p-3 p-6 rounded-xl w-full flex-1">
            <h2 className="text-xl font-semibold mb-4 text-white">
              User Growth
            </h2>
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
          <div className="bg-bgPrimary max-[1024px]:p-3 p-6 rounded-xl w-full flex-1">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Top 5 Skills
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
        <div className="bg-bgPrimary p-6 rounded-xl max-[1024px]:w-full w-[67.5%]">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Teams Created
          </h2>
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
        
      </div>
    </div>
  );
};

export default Dashboard;
