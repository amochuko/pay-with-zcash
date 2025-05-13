"use client";

type ThemeToggleProps = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeToggle = (props: ThemeToggleProps) => {
  return (
    <button
      onClick={props.toggleTheme}
      className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 hover:cursor-pointer"
    >
      Switch to {props.theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;
