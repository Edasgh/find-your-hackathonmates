import React from "react";

const FirstList = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
  );
};

const ListEl = () => {
  return (
    <div className="flex items-center justify-between pt-4">
      <div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
  );
};

const TeamsLoader = () => {
  return (
    <div className="p-4 z-[-1] max-[750px]:w-screen min-[750.1px]:w-1/4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
      <FirstList />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
      <ListEl />
    </div>
  );
};

export default TeamsLoader;
