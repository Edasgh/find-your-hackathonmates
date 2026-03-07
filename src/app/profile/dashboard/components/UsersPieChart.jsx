// Importing utility function to parse custom date formats
import { parseCustomDate } from "@/lib/dateOperations";

// Importing React hooks
import React, { useEffect, useState } from "react";

// Importing Pie Chart components from Recharts library
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * UsersPieChart Component
 *
 * This component displays a pie chart showing:
 * - Active users (users who sent messages in last 7 days)
 * - Inactive users
 *
 * Props:
 * allTeams → list of all teams including their messages
 * allUsers → list of all registered users
 */
const UsersPieChart = ({ allTeams, allUsers }) => {
  // -------------------------------
  // STATE VARIABLES
  // -------------------------------

  // Stores pie chart data (active vs inactive users)
  const [userEngagement, setUserEngagement] = useState([]);

  // Stores percentage of active users
  const [engagementRate, setEngagementRate] = useState(0);

  // ------------------------------------------------------
  // useEffect → Calculates user engagement whenever
  // allUsers or allTeams changes
  // ------------------------------------------------------
  useEffect(() => {
    // If users or teams are empty, exit early
    if (!allUsers.length || !allTeams.length) return;

    // Get date for 7 days ago
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    // Set to store unique active user IDs
    // Using Set prevents duplicate users
    const activeUserIds = new Set();

    // ------------------------------------------------------
    // Loop through all teams and their messages
    // ------------------------------------------------------
    allTeams.forEach((team) => {
      // Loop through messages of each team
      team.messages?.forEach((msg) => {
        // Convert custom date format to JS Date object
        const msgDate = parseCustomDate(msg.sentOn.toUpperCase().trim());

        // If message was sent within last 7 days
        if (msgDate >= last7Days) {
          // Add sender ID to active user set
          activeUserIds.add(msg.sender._id);
        }
      });
    });

    // Total number of active users
    const activeUsers = activeUserIds.size;

    // Total registered users
    const totalUsers = allUsers.length;

    // Calculate inactive users
    const inactiveUsers = totalUsers - activeUsers;

    // ------------------------------------------------------
    // Calculate engagement rate
    // Formula:
    // (activeUsers / totalUsers) * 100
    // ------------------------------------------------------
    setEngagementRate(
      totalUsers ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
    );

    // ------------------------------------------------------
    // Prepare data for Pie Chart
    // ------------------------------------------------------
    setUserEngagement([
      { name: "Active Users", value: activeUsers },
      { name: "Inactive Users", value: inactiveUsers },
    ]);
  }, [allUsers, allTeams]);

  // ------------------------------------------------------
  // Colors for pie chart sections
  // ------------------------------------------------------
  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];

  // ------------------------------------------------------
  // COMPONENT UI
  // ------------------------------------------------------

  return (
    // Card container
    <div className="bg-bgPrimary p-6 rounded-xl w-full flex-1">
      {/* Chart Title */}
      <h2 className="text-xl font-semibold mb-4 text-white">User Engagement</h2>

      {/* Responsive container ensures chart adjusts to screen size */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* Pie Chart */}
          <Pie
            data={userEngagement} // Data for chart
            dataKey="value" // Value used for slice size
            nameKey="name" // Label name
            cx="50%" // Horizontal center
            cy="50%" // Vertical center
            outerRadius={100} // Radius of pie
            label // Show labels
          >
            {/* Generate colored slices dynamically */}
            {userEngagement.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* Tooltip shown when hovering on slices */}
          <Tooltip formatter={(value) => `${value} users`} />

          {/* Legend showing labels */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Engagement Percentage */}
      <p className="text-white text-lg mt-2 text-center">
        {engagementRate}% User Engagement
      </p>

      {/* Detailed active user information */}
      <p className="text-gray-400 text-sm mt-2 text-center">
        {userEngagement[0]?.value} of {allUsers?.length} users active this week
      </p>
    </div>
  );
};

export default UsersPieChart;
