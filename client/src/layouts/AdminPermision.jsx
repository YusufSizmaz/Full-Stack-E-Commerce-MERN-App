import React from "react";
import { useSelector } from "react-redux";
import isAdmin from "../utils/isAdmin";

const AdminPermision = ({ children }) => {
  const user = useSelector((state) => state.user);

  return (
    <>
      {isAdmin(user.role) ? (
        children
      ) : (
        <p className="text-red-600 w-full text-center font-semibold bg-red-100 p-4 rounded shadow-md">
          Bu sayfayı görüntüleme yetkiniz yok
        </p>
      )}
    </>
  );
};

export default AdminPermision;
