import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border border-gray-300 p-1 overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-amber-300 ">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-2 m-1  cursor-pointer group-focus-within:text-amber-300 bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3  cursor-pointer group-focus-within:text-amber-300">
            <IoSearch size={22} />
          </button>
        )}
      </div>

      <div className="w-full h-full  ">
        {!isSearchPage ? (
          // Not in search page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
                1000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          // When i was search page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for atta dal and more."
              className="bg-transparent w-full h-full outline-none border-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
