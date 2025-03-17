import React from "react";
import UserMenu from "../components/UserMenu";
import { IoClose } from "react-icons/io5";

const UserMenuMobile = () => {
  return (
    <section className="bg-white h-full w-full py-2">
      <button
        onClick={() => window.history.back()}
        className="text-neutral-800 block w-fit ml-auto  hover:bg-amber-400 mr-6 hover:text-white rounded "
      >
        <IoClose size={25} />
      </button>
      <div className="container mx-auto px-3 pb-8">
        <UserMenu />
      </div>
    </section>
  );
};

export default UserMenuMobile;
