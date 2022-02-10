import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import Meta from "../common/Meta";

function ThemeSwitch() {
  const [theme, setTheme] = useState("");
  const isDark = theme === "dark";

  useEffect(() => {
    if (!("theme" in localStorage)) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.theme = "dark";
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        localStorage.theme = "light";
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    } else {
      if (localStorage.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (localStorage.theme === "light") {
        document.documentElement.classList.remove("dark");
      }
      setTheme(localStorage.theme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
    localStorage.theme = theme;
  }, [theme]);

  return (
    <button
      className="p-2 cursor-pointer form-check-label hover:dark:bg-orange-700 hover:bg-orange-300 rounded-xl"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <MdDarkMode /> : <MdLightMode />}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 dark:text-slate-100">
      <Meta />
      <div className="flex flex-col max-w-3xl min-h-screen p-5 mx-auto">
        <nav className="flex items-center justify-between mb-5">
          <Image
            src={"/favicon.ico"}
            alt="who's the biggest workaholic icon"
            layout="fixed"
            height={"25"}
            width={"25"}
          />
          <ThemeSwitch />
        </nav>
        {children}
        <footer className="opacity-60">
          <span className="font-semibold">
            © ? Who&apos;s the biggest workaholic
          </span>
        </footer>
      </div>
    </div>
  );
}
