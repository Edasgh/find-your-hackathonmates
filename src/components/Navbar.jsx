"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  faBell,
  faMessage,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faCircleUser as hoverUser,
  faMessage as msgIcon,
  faPlus,
  faPeopleGroup,
  faUserPlus,
  faXmark,
  faBell as bellIcon,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useCreds } from "@/hooks/useCreds";
import { socket } from "@/lib/socket";

const UserNav = ({ menuItems, opened }) => {
  return (
    <ul
      className={`navbar-ul z-50 ${
        !opened ? "max-[1023.9px]:hidden" : "visible"
      } `}
    >
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-textPrimary text-[1rem] hover:text-indigo-400 flex gap-4 items-center px-1 py-2"
        >
          <FontAwesomeIcon
            icon={item.icon}
            className={`text-xl hover:text-indigo-400 max-[1023.9px]:visible min-[1024px]:hidden`}
          />
          {item.label}
        </Link>
      ))}
    </ul>
  );
};

export default function Navbar() {
  const { user, isLoading, error } = useCreds();
  const router = useRouter();

  const [opened, setOpened] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [over, setOver] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const handleLogOut = async () => {
    const response = await fetch("/api/logout");
    if (response.status === 200) {
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  useEffect(() => {
    if (user) {
      socket.emit("get_alerts", { userId: user._id });
      socket.on("get_alerts", ({ data }) => {
        setAlerts([...data]);
      });
    }
  }, [user]);

  // console.log(alerts);

  const menuItems = [
    { href: "/createTeam", icon: faPlus, label: "Create your Team" },
    { href: "/teamMates", icon: faUserPlus, label: "Find Teammates" },
    { href: "/teams", icon: faPeopleGroup, label: "Join a Team" },
  ];

  const userMenuItems = [
    {
      href: "/profile",
      icon: faCircleUser,
      hoverIcon: hoverUser,
      name: "Profile",
    },
    {
      href: "/profile/myTeams",
      icon: faMessage,
      hoverIcon: msgIcon,
      name: "Teams",
    },
    {
      href: "/profile/joinRequests",
      icon: faBell,
      hoverIcon: bellIcon,
      name: "Notifications",
    },
  ];

  return (
    <>
      <nav className="navbar w-screen flex gap-2 flex-wrap justify-between items-center">
        <Link href="/">
          <p className="text-textPrimary font-semibold text-3xl flex flex-wrap gap-1 items-end cursor-pointer">
            <span className="text-lg font-extralight"> find</span>
            <span className="text-lg font-extralight">your</span>
            <span className="text-textSecondary">&nbsp;HackathonMates</span>
          </p>
        </Link>

        {!user ? (
          <Link
            href="/login"
            className="w-fit border-[1px] border-textBgPrimaryHv hover:bg-textBgPrimaryHv text-textPrimary hover:text-black px-8 py-3 rounded-md cursor-pointer"
          >
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <UserNav menuItems={menuItems} opened={opened} />
            <button
              onClick={handleLogOut}
              className="w-fit text-textPrimary hover:text-indigo-400 relative"
              onMouseOver={() => {
                setOver(true);
              }}
              onMouseOut={() => {
                setOver(false);
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-2xl" />
              <span
                className={`bg-slate-600 text-textPrimary px-2 py-1 text-sm rounded-md absolute bottom-[1.75rem] left-[-.9rem] ${
                  over ? "visible" : "hidden"
                }`}
              >
                LogOut
              </span>
            </button>
            {userMenuItems.map((m, i) => (
              <Link
                key={i}
                href={m.href}
                className={`relative text-textPrimary flex gap-4 items-center px-1 py-2 ${
                  m.name === "Notifications" && "w-16"
                }`}
                onMouseOver={() => setHoverIndex(i)}
                onMouseOut={() => setHoverIndex(null)}
              >
                <FontAwesomeIcon
                  icon={hoverIndex === i ? m.hoverIcon : m.icon}
                  className={`text-[1.75rem] ${
                    hoverIndex === i ? "text-indigo-400" : "text-textPrimary"
                  }`}
                />
                {m.name === "Notifications" && (
                  <span className="absolute -top-1 right-3 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {alerts.length}
                  </span>
                )}
                <span
                  className={`bg-slate-600 text-textPrimary px-2 py-1 text-sm rounded-md absolute bottom-[2.2rem] ${
                    m.name === "Notifications" ? "-left-11" : "-left-3"
                  } ${hoverIndex === i ? "visible" : "hidden"}`}
                >
                  {m.name}
                </span>
              </Link>
            ))}

            <FontAwesomeIcon
              icon={opened ? faXmark : faBars}
              className="text-textPrimary text-2xl border border-textPrimary p-1 rounded-md cursor-pointer max-[1023.9px]:visible min-[1024px]:hidden"
              onClick={() => setOpened(!opened)}
            />
          </div>
        )}
      </nav>
    </>
  );
}
