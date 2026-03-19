// Import utility function that converts custom date format to JavaScript Date
import { parseCustomDate } from "@/lib/dateOperations";

// Import React hooks
import React, { useEffect, useState } from "react";
import { ProfileCell } from "../allUsers/components/ProfileCell";
import TeamEl from "../../joinRequests/components/TeamEl";

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
  // State to store status of profile details modal and team details modal : show/hide
  const [openProfile, setOpenProfile] = useState(null);
  const [openTeam, setOpenTeam] = useState(null);

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
        sender: msg.sender.id,
        team,
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
      user,
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
      team,
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
      sender: a.sender.id,
      team: a.team.id,
      message: `${a.sender.id.name} sent ${
        a.message.includes("invited") ? "an invitation" : "a request"
      } to join "${a.team.id.name}"`,
      action: a.message.includes("invited")
        ? "sent an invitation"
        : "sent a request",

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
    // console.log(allActivities);

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
    <div
      className="recent-activities text-white flex flex-col gap-4 relative"
      onClick={() => {
        setOpenProfile(null);
        setOpenTeam(null);
      }}
    >
      {/* Section Title */}
      <h3 className="font-semibold text-2xl">Recent Activities</h3>

      {/* Render each activity */}
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div>
            {activity.type === "team"
              ? "👥"
              : activity.type === "message"
                ? "💬"
                : activity.type === "request"
                  ? "✉"
                  : "👤"}{" "}
            <p>
              {activity.type === "request" ? (
                <>
                  <span
                    className="text-blue-400 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenProfile(activity.sender);
                    }}
                  >
                    {activity.sender.name}
                  </span>{" "}
                  {activity.action} to join{" "}
                  <span
                    className="text-green-400 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTeam(activity.team);
                    }}
                  >
                    "{activity.team.name}"
                  </span>
                </>
              ) : activity.type === "message" ? (
                <>
                  <span
                    className="text-blue-400 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenProfile(activity.sender);
                    }}
                  >
                    {activity.sender.name}
                  </span>{" "}
                  sent a message in{" "}
                  <span
                    className="text-green-400 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTeam(activity.team);
                    }}
                  >
                    "{activity.team.name}"
                  </span>
                </>
              ) : activity.type === "user" ? (
                <>
                  <span
                    className="text-blue-400 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenProfile(activity.user);
                    }}
                  >
                    {activity.user.name}
                  </span>{" "}
                  joined the platform
                </>
              ) : activity.type === "team" ? (
                <>
                  Team{" "}
                  <span
                    className="text-green-400 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTeam(activity.team);
                    }}
                  >
                    {activity.team.name}
                  </span>{" "}
                  was created
                </>
              ) : null}
            </p>
          </div>

          <small className="text-gray-400 italic">
            {activity?.date?.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </small>
        </div>
      ))}

      <ProfileCell
        user={openProfile}
        open={openProfile !== null}
        setOpen={() => setOpenProfile(null)}
      />

      <TeamEl team={openTeam} open={openTeam !== null} />
    </div>
  );
};

export default Recents;
