import Logout from "./logout";
import { useState, useEffect, useRef } from "react";

export default function Nav({
  title,
  isLoggedIn,
}: {
  title: string;
  isLoggedIn: boolean;
}) {
  const [isNavOpen, setNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setNavOpen(true);
  };

  const handleDropdownBlur = (
    event: React.FocusEvent<HTMLDivElement | HTMLUListElement>
  ) => {

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.relatedTarget as Node)
    ) {
      setNavOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
  
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setNavOpen(false);
      }
    };

    if (isNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }


    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavOpen]);

  return (
    <nav className="bg-base-300 shadow-sm h-fit navbar">
      <div className="navbar-start">
        {/* <label
          htmlFor="my-drawer-2"
          className="lg:hidden m-0 px-1 btn btn-ghost drawer-button"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 -0.5 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M6.5 11.75C6.08579 11.75 5.75 12.0858 5.75 12.5C5.75 12.9142 6.08579 13.25 6.5 13.25V11.75ZM18.5 13.25C18.9142 13.25 19.25 12.9142 19.25 12.5C19.25 12.0858 18.9142 11.75 18.5 11.75V13.25ZM6.5 15.75C6.08579 15.75 5.75 16.0858 5.75 16.5C5.75 16.9142 6.08579 17.25 6.5 17.25V15.75ZM18.5 17.25C18.9142 17.25 19.25 16.9142 19.25 16.5C19.25 16.0858 18.9142 15.75 18.5 15.75V17.25ZM6.5 7.75C6.08579 7.75 5.75 8.08579 5.75 8.5C5.75 8.91421 6.08579 9.25 6.5 9.25V7.75ZM18.5 9.25C18.9142 9.25 19.25 8.91421 19.25 8.5C19.25 8.08579 18.9142 7.75 18.5 7.75V9.25ZM6.5 13.25H18.5V11.75H6.5V13.25ZM6.5 17.25H18.5V15.75H6.5V17.25ZM6.5 9.25H18.5V7.75H6.5V9.25Z"
                fill="currentColor"
              ></path>{" "}
            </g>
          </svg>
        </label> */}
        <h1>
          <a className="text-xl btn btn-ghost" href="/">
            {title}
          </a>
        </h1>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <div className={"nav-list hidden md:block"}>
          <a className="btn btn-ghost" href="/about">
            About
          </a>
        </div>
        <div className={"md:hidden"} ref={dropdownRef}>
          <div className="dropdown-bottom dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              aria-label="Nav links opener"
              className="m-1 btn btn-ghost"
              onFocus={handleDropdownFocus}
              onBlur={handleDropdownBlur}
              onClick={() => setNavOpen(!isNavOpen)}
            >
              <ChevronRight isOpen={isNavOpen} />
            </div>
            <ul
              tabIndex={0}
              className="z-1 bg-base-200 shadow-sm mt-4 p-2 rounded-box w-48 menu dropdown-content"
              onBlur={handleDropdownBlur}
            >
              <li>
                <a className="btn btn-ghost" href="/about">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
        {isLoggedIn && <Logout />}
      </div>
    </nav>
  );
}

function ChevronRight({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-chevron-right transition-transform duration-300 ${
        isOpen ? "rotate-90" : ""
      }`}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
