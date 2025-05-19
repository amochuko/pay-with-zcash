"use client";

type ThemeToggleProps = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeToggle = (props: ThemeToggleProps) => {
  return (
    <label
      htmlFor="toggle-theme"
      className="relative inline-flex items-center cursor-pointer w-12 h-12 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
    >
      <input
        name="toggle-theme"
        type="checkbox"
        checked={props.theme === "dark"}
        onChange={props.toggleTheme}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />

      <span className="ml-3 text-sm text-gray-900 dark:text-gray-300">
        {props.theme === "dark" ? (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-amber-50"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Central circle (the sun core) */}
            <circle cx="12" cy="12" r="5" fill="currentColor" />

            {/* Rays around the sun */}
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </span>
    </label>
  );
};

export default ThemeToggle;
