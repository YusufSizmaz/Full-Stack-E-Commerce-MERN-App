import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";

const Header = () => {
  const isMobile = useMobile(); // Hata düzeltildi
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);

  console.log("user from store", user);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-50 bg-white flex flex-col justify-center gap-1 ">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/* Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login and My Cart */}
          <div>
            {/* User icon (mobile only) */}
            <button className="text-neutral-600 lg:hidden">
              <FaRegCircleUser size={26} />
            </button>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-10">
              <button
                onClick={redirectToLoginPage}
                className="cursor-pointer text-lg px-2"
              >
                Login
              </button>

              <button className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-3 rounded text-white">
                {/* Add to cart icon */}
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold">
                  <p>My Cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
