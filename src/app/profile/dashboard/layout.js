import React from "react";

const dashboardLayout = ({ children }) => {
  return (
    <div className="mt-12 border-t-[2.5px] border-bgSecondary flex w-screen h-full bg-bgSecondary">
      <div className="pt-5 px-5 w-full flex flex-col justify-start items-center gap-5">
        {children}
      </div>
    </div>
  );
};

export default dashboardLayout;
