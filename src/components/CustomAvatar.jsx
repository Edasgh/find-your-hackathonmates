function CustomAvatar({ name }) {
  return (
    <>
      <span suppressHydrationWarning>
        <span
         className="w-[2rem] h-[2rem] lg:w-[4rem] lg:h-[4rem] rounded-full font-medium  text-lg md:text-lg lg:text-2xl text-center flex justify-center bg-gray-600 text-gray-300 items-center border-[1px] border-textSecondary">
          {" "}
          {name.charAt(0).toUpperCase()}
        </span>
      </span>
    </>
  );
}

export default CustomAvatar;
