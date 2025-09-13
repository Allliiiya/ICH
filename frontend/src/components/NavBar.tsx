import logoImg from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);


  const tabs = [
    ["Resources", "/resources"],
    ["Program", null], // Dropdown for Program
    ["Workshop", "/workshops"],
    ["Brands", "/brands"],
    ["About", "/about"],
  ];

  const programDropdown = [
    ["Start a Chapter", "/chapter"],
    ["Volunteer", "/volunteer"],
  ];

  // const iconTabs = [[<ShoppingCart />, "#"]];


  return (
    <>
      <nav
        className="bg-[#FBF2DA] w-full flex flex-row items-center justify-between px-12 py-4 fixed top-0 left-0 z-50 border-b border-[#e3dfd7]"
        style={{ minHeight: 56 }}
      >
        {/* Left: Heritage logo */}
        <button
          className="p-0 bg-transparent border-none flex items-center justify-center"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
          aria-label="Home"
        >
          <img
            src={logoImg}
            alt="CCHeritage Logo"
            className="h-8 w-8 md:h-10 md:w-10 object-contain"
            style={{ minWidth: 80, minHeight: 80 }}
          />
        </button>
        {/* Center: Navigation Tabs */}
        <div className="flex flex-row items-center gap-8 text-base font-serif text-black">
          {tabs.map((tab) =>
            tab[0] === "Program" ? (
              <div key="Program" className="relative group px-2">
                <button className="hover:underline hover:text-red-700 transition-colors px-2 font-serif text-base text-black focus:outline-none">
                  Program
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
                  {programDropdown.map(([name, path]) => (
                    <Link
                      key={name}
                      to={path}
                      className="block px-4 py-2 text-black hover:bg-gray-100 font-serif text-base"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={tab[0]}
                className="hover:underline hover:text-red-700 transition-colors px-2"
              >
                {tab[1] ? (
                  <Link to={tab[1]}>{tab[0]}</Link>
                ) : (
                  <span>{tab[0]}</span>
                )}
              </div>
            ),
          )}
        </div>
        {/* Right: Login and Donate */}
        <div className="flex flex-row items-center gap-4">
          <Link
            to="/login"
            className="text-black font-serif text-base hover:underline"
          >
            Login
          </Link>
          <Link to="/donate">
            <button
              className="bg-red-700 text-white font-serif text-base font-semibold px-6 py-2 rounded-full shadow hover:bg-red-800 transition-colors"
              style={{ minWidth: 90 }}
            >
              Donate
            </button>
          </Link>
        </div>
      </nav>
      <div className="bg-[#FBF2DA] py-[56px]" />
    </>
  );
}
