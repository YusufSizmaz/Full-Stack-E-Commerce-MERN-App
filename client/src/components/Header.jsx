import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const Header = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user._id) {
        try {
          const response = await Axios({
            ...SummaryApi.getCart,
          });
          if (response.data.success) {
            const items = response.data.data || [];
            const totalQuantity = items.reduce((sum, item) => {
              return sum + (item.quantity || 0);
            }, 0);
            setCartCount(totalQuantity);
          }
        } catch (error) {
          // Silently fail if cart fetch fails
          console.error("Cart fetch error:", error);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user._id, user.shopping_cart]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 bg-white flex flex-col justify-center gap-1 ">
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
            <button
              className="text-neutral-600 lg:hidden "
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>

                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="cursor-pointer text-lg px-2"
                >
                  Login
                </button>
              )}

              <button
                onClick={() => {
                  if (!user._id) {
                    navigate("/login");
                  } else {
                    navigate("/cart");
                  }
                }}
                className="relative flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-3 rounded text-white transition-colors"
              >
                <div className="relative">
                  <BsCart4 size={26} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
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
