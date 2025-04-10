import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className="bg-white  ">
      {/* mt-24: Navbar yüksekliğine göre margin (navbar sabitse gerekli) */}
      <div className="flex h-full ">
        {/* Sol Panel - %30 */}
        <div className="w-full sticky  lg:w-[30%] top-24 max-h-[calc(100vh-96px)] border-r overflow-y-auto  border-gray-200 px-4 py-6 ">
          <UserMenu />
        </div>

        {/* Sağ Panel - %70 */}
        <div className="w-full min-h-[85vh] lg:w-[70%] px-1 py-1 ">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
