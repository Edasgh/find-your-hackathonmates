import React from 'react'

const StatCard = ({ name, count, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-bgPrimary w-[15rem] p-5 border-none rounded-md text-start hover:shadow-xl hover:-translate-y-1 transition"
    >
      <p className="text-white font-semibold text-xl">{name}</p>
      <p className="text-gray-400 font-semibold text-sm">{count}+</p>
    </div>
  );
};

export default StatCard