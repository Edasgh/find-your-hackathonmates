// Import utility function that converts custom date format to JavaScript Date
import { parseCustomDate } from "@/lib/dateOperations";

// Import React hooks
import React, { useEffect, useState } from "react";

/**
 * Recents Component
 *
 * Displays the latest activities in the system such as:
 * - Messages sent in teams
 * - New users joining
 * - Teams being created
 * - Join requests / invitations
 *
 * Props:
 * applications → all join requests / invitations
 * allUsers → all registered users
 * allTeams → all teams and their messages
 */
const Recents = ({ applications, allUsers, allTeams }) => {
  // State to store final list of recent activities
  const [activities, setActivities] = useState([]);

  /**
   * useEffect
   * Runs whenever allUsers or allTeams changes.
   * It collects all activities, merges them, sorts them,
   * and keeps only the 10 most recent.
   */
  useEffect(() => {
    // ------------------------------------------------------
    // MESSAGE ACTIVITIES
    // ------------------------------------------------------
    // Convert team messages into activity objects
    const messageActivities = allTeams.flatMap((team) =>
      (team.messages || []).map((msg) => ({
        // Activity type used for icon display
        type: "message",

        // Message displayed in activity list
        message: `${msg.sender.name} sent a message in "${team.name}"`,

        // Convert custom message date to JS Date
        date: parseCustomDate(msg.sentOn.toUpperCase().trim()),
      })),
    );

    // ------------------------------------------------------
    // USER ACTIVITIES
    // ------------------------------------------------------
    // Track when users join the platform
    const userActivities = allUsers.map((user) => ({
      type: "user",

      message: `${user.name} joined the platform`,

      // createdAt already in standard date format
      date: new Date(user.createdAt),
    }));

    // ------------------------------------------------------
    // TEAM ACTIVITIES
    // ------------------------------------------------------
    // Track team creation
    const teamActivities = allTeams.map((team) => ({
      type: "team",

      message: `Team "${team.name}" was created`,

      date: new Date(team.createdAt),
    }));

    // ------------------------------------------------------
    // APPLICATION / REQUEST ACTIVITIES
    // ------------------------------------------------------
    // Track invitations or join requests
    const reqsActivities = applications.map((a) => ({
      type: "request",

      // Determine if message contains "invited"
      // If yes → show invitation message
      // Otherwise → show join request message
      message: `${a.sender.name} sent ${
        a.message.includes("invited") ? "an invitation" : "a request"
      } to join "${a.team.name}"`,

      date: new Date(a.createdAt),
    }));

    // ------------------------------------------------------
    // MERGE ALL ACTIVITIES INTO ONE ARRAY
    // ------------------------------------------------------
    const allActivities = [
      ...messageActivities,
      ...userActivities,
      ...teamActivities,
      ...reqsActivities,
    ];

    // ------------------------------------------------------
    // SORT ACTIVITIES BY MOST RECENT DATE
    // ------------------------------------------------------
    allActivities.sort((a, b) => b.date - a.date);

    // Debug log
    console.log(allActivities);

    // ------------------------------------------------------
    // KEEP ONLY THE 10 MOST RECENT ACTIVITIES
    // ------------------------------------------------------
    setActivities(allActivities.slice(0, 10));
  }, [allUsers, allTeams]); // runs when users or teams change

  // ------------------------------------------------------
  // COMPONENT UI
  // ------------------------------------------------------
  return (
    // Container for recent activities
    <div className="recent-activities text-white flex flex-col gap-4">
      {/* Section Title */}
      <h3 className="font-semibold text-2xl">Recent Activities</h3>

      {/* Render each activity */}
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          {/* Activity message with icon */}
          <p>
            {/* Select icon based on activity type */}
            {activity.type === "team"
              ? "👥" // Team created
              : activity.type === "message"
                ? "💬" // Message sent
                : activity.type === "request"
                  ? "✉" // Invitation / request
                  : "👤"}{" "}
            // User joined {activity.message}
          </p>

          {/* Activity date/time */}
          <small
            className="text-gray-400 font-light"
            style={{ fontStyle: "italic" }}
          >
            {activity?.date?.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Recents;
