import React from 'react'

const StatCard = ({ name, count, onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className="bg-bgPrimary relative w-[15rem] p-5 border-none rounded-md text-start hover:shadow-xl hover:-translate-y-1 transition"
    >
      <p className="text-white font-semibold text-xl">{name}</p>
      <p className="text-gray-400 font-semibold text-sm">{count}+</p>
      {label && label.length > 0 && (
        <span className="absolute top-1 right-1 p-1 rounded-sm bg-blue-500 text-xs cursor-pointer hover:underline">
          {label}
        </span>
      )}
    </div>
  );
};

export default StatCard