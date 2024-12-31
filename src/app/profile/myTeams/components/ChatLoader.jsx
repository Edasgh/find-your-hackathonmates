import React from 'react'

const ChatLoader = () => {
  return (
    <>
      <div className="flex-1 flex flex-col overflow-x-hidden animate-pulse">
        {/* <!-- Chat Header Placeholder --> */}
        <div className="p-4 bg-gray-200 border-b rounded-md flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="mt-2 h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>

        {/* <!-- Messages Placeholder --> */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-start mb-4 mx-4">
            <div className="w-[12rem] h-[5rem] rounded-lg p-3 bg-gray-300"></div>
          </div>
          <div className="flex justify-end mb-4 mx-4">
            <div className="w-[12rem] h-[5rem] rounded-lg p-3 bg-gray-300"></div>
          </div>
          <div className="flex justify-start mb-4 mx-4">
            <div className="w-[12rem] h-[5rem] rounded-lg p-3 bg-gray-300"></div>
          </div>
          <div className="flex justify-end mb-4 mx-4">
            <div className="w-[12rem] h-[5rem] rounded-lg p-3 bg-gray-300"></div>
          </div>
        </div>

        {/* <!-- Message Input Placeholder --> */}
        <div className="p-4">
          <div className="h-10 mx-7 bg-gray-300 rounded"></div>
        </div>
      </div>
    </>
  );
}

export default ChatLoader