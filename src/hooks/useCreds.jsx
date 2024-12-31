"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context for user credentials
const CredsContext = createContext();

export const CredsProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialUser) {
      // Fetch only if user is not preloaded
      const fetchUser = async () => {
        try {
          const response = await fetch("/api/profile");

          if (response.status !== 200) {
            throw new Error("Failed to fetch user");
          }

          const userData = await response.json();
          setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            bio: userData.bio,
            githubID: userData.githubID,
            country: userData.country,
            skills: [...userData.skills],
            teams: [...userData.teams],
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [initialUser]);


  return (
    <CredsContext.Provider
      value={{ user, isLoading, error }}
    >
      {children}
    </CredsContext.Provider>
  );
};

// Hook to access the context
export const useCreds = () => {
  const context = useContext(CredsContext);
  if (!context) {
    throw new Error("useCreds must be used within a CredsProvider");
  }
  return context;
};
