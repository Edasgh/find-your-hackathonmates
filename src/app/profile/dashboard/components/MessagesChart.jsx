// Import utility function that converts custom message date format into JavaScript Date
import { parseCustomDate } from "@/lib/dateOperations";

// Import React hooks
import React, { useEffect, useState } from "react";

// Import required chart components from Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * MessagesChart Component
 *
 * Displays a bar chart showing how many messages were sent
 * in the last 7 days across all teams.
 *
 * Props:
 * allTeams → list of all teams including their messages
 */
const MessagesChart = ({ allTeams }) => {
  // State to store processed chart data
  const [messageChartData, setMessageChartData] = useState([]);

  /**
   * useEffect
   * Runs whenever the list of teams changes.
   * It calculates how many messages were sent per day
   * in the last 7 days.
   */
  useEffect(() => {
    // Object used to store message counts by date
    // Example:
    // {
    //   "2026-03-01": 5,
    //   "2026-03-02": 8,
    //   ...
    // }
    const counts = {};

    // ---------------------------------------------------
    // Initialize last 7 days with 0 messages
    // ---------------------------------------------------
    // This ensures every day appears in the chart
    for (let i = 6; i >= 0; i--) {
      // Create a new date object
      const d = new Date();

      // Move back i days
      d.setDate(d.getDate() - i);

      // Convert to ISO date format (YYYY-MM-DD)
      const key = d.toISOString().split("T")[0];

      // Initialize message count for that day
      counts[key] = 0;
    }

    // ---------------------------------------------------
    // Count messages sent on each day
    // ---------------------------------------------------
    allTeams.forEach((team) => {
      // Loop through messages in each team
      team.messages?.forEach((msg) => {
        // Convert message date to ISO date format
        const date = parseCustomDate(msg.sentOn).toISOString().split("T")[0];

        // If message date is within the last 7 days
        if (counts[date] !== undefined) {
          // Increase message count for that date
          counts[date]++;
        }
      });
    });

    // ---------------------------------------------------
    // Convert counts object into chart-friendly array
    // ---------------------------------------------------
    const data = Object.entries(counts).map(([date, count]) => ({
      // Date for X-axis
      date,

      // Number of messages
      messages: count,
    }));

    // Save processed data into state
    setMessageChartData(data);
  }, [allTeams]); // Recalculate when team data changes

  // ---------------------------------------------------
  // COMPONENT UI
  // ---------------------------------------------------
  return (
    // Card container
    <div className="bg-bgPrimary p-6 rounded-xl w-full flex-1">
      {/* Chart Title */}
      <h2 className="text-xl font-semibold text-white mb-4">
        Message Activity (Last 7 Days)
      </h2>

      {/* ResponsiveContainer makes chart responsive */}
      <ResponsiveContainer width="100%" height={250}>
        {/* Bar chart displaying message activity */}
        <BarChart data={messageChartData}>
          {/* X-axis shows the days of the week */}
          <XAxis
            dataKey="date"
            // Convert ISO date to weekday name (Mon, Tue, Wed...)
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-IN", {
                weekday: "short",
              })
            }
            stroke="#ccc"
          />

          {/* Y-axis shows number of messages */}
          <YAxis stroke="#ccc" />

          {/* Tooltip shown when hovering over bars */}
          <Tooltip
            // Display full date inside tooltip
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-IN")
            }
          />

          {/* Gradient color definition for bars */}
          <defs>
            <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
              {/* Top color */}
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />

              {/* Bottom fade */}
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* Bar representing message count */}
          <Bar
            dataKey="messages"
            fill="url(#msgGradient)" // Apply gradient
            radius={[6, 6, 0, 0]} // Rounded top corners
          />

          {/* Alternative simple color bar */}
          {/* <Bar dataKey="messages" fill="#4ade80" radius={[6, 6, 0, 0]} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MessagesChart;
