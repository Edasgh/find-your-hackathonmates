import { useEffect, useState } from "react";

function CustomAvatar({ name }) {
  const elements = document.querySelectorAll(".random-bg");
  const [color, setColor] = useState("");
  const [brightness, setBrightness] = useState(0);
  const [parsedCol, setParsedCol] = useState("");

  // Function to generate a random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  // Function to calculate brightness of a color
  function getBrightness(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Formula to calculate brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  useEffect(() => {
    const savedColor = getRandomColor();
    setColor(savedColor);
    const b = getBrightness(savedColor);
    if (b > 128) {
      setParsedCol("black");
    } else {
      setParsedCol("white");
    }
    setBrightness(b);
  }, []);

  return (
    <>
      <span suppressHydrationWarning>
        <span className="w-[2rem] h-[2rem] lg:w-[4rem] lg:h-[4rem] rounded-full font-medium  text-lg md:text-lg lg:text-2xl text-center flex justify-center bg-gray-600 text-gray-300 items-center border-[1px] border-textSecondary">
          {" "}
          {name.charAt(0).toUpperCase()}
        </span>
      </span>
    </>
  );
}

export default CustomAvatar;
