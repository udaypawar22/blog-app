import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { motion } from "framer-motion";
import Search from "./Search";

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrolling, setScrolling] = useState(false);
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function toggleIsOpen(ev) {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  return (
    <header
      className={
        "fixed w-full z-10 " +
        (scrolling ? "bg-white transition" : "transition bg-transparent")
      }
    >
      <div className="my-3 py-2 mx-12 lg:mx-36 flex justify-between font-semibold text-lg">
        <div className="flex gap-8">
          <Link to={"/"} className="my-auto font-serif text-xl">
            blogger
          </Link>
          {windowWidth > 1024 && (
            <div className="flex md:gap-2 lg:gap-4">
              <Link
                to={"/trends/sports"}
                className="my-auto hover:text-darkblue"
              >
                Sports
              </Link>
              <Link
                to={"/trends/lifestyle"}
                className="my-auto hover:text-darkblue"
              >
                Lifestyle
              </Link>
              <Link
                to={"/trends/entertainment"}
                className="my-auto hover:text-darkblue"
              >
                Entertainment
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-5 items-center">
          <Search />
          <Link to={user ? "/profile" : "/login"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>

          {windowWidth <= 1024 && (
            <div className="relative flex items-center">
              <button
                onClick={toggleIsOpen}
                className={isOpen ? "text-darkblue" : ""}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 14 12"
                  fill="none"
                >
                  <path
                    d="M3.5 11H13M1 1H13M6 6H13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isOpen && (
                <motion.div
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="flex flex-col w-[250px] gap-2 absolute top-full mt-5 right-0 bg-gray-50 shadow-lg text-gray-600 px-4 pt-3 pb-8 rounded-xl text-sm"
                >
                  <Link
                    to={"/trends/sports"}
                    className="border-b py-2 flex gap-2"
                    onClick={toggleIsOpen}
                  >
                    Sports
                  </Link>
                  <Link
                    to={"/trends/lifestyle"}
                    className="border-b py-2"
                    onClick={toggleIsOpen}
                  >
                    Lifestyle
                  </Link>
                  <Link
                    to={"/trends/entertainment"}
                    className="border-b py-2"
                    onClick={toggleIsOpen}
                  >
                    Entertainment
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
