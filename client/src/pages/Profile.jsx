import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  return (
    <div>
      {/* *PROFILE UPLOAD  AND DISPLAY IMAGE*/}
      <div className="w-20 h-20 bg-red-400 flex items-center justify-center rounded-full overflow-hidden drop-shadow-2xl">
        {user.avatar ? (
          <img alt={user.name} src={user.avatar} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button
        onClick={() => setOpenProfileAvatarEdit(true)}
        className="cursor-pointer text-sm min-w-20 border border-amber-300 hover:border-amber-400
      hover:bg-amber-400 hover:text-white px-3 py-1 rounded-full mt-3"
      >
        Edit
      </button>
      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
      )}

      {/* *NAME MOBILE EMAIL CHANGE PASSWORD */}
      <form className="my-4 grid gap-4">
        <div className="grid">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
            value={userData.name}
            name="name"
            onChange={handleOnChange}
          />
        </div>

        <div className="grid">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Enter email"
            className="p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
            value={userData.email}
            name="email"
            onChange={handleOnChange}
          />
        </div>

        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter Mobile"
            className="p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
            value={userData.mobile}
            name="email"
            onChange={handleOnChange}
          />
        </div>

        <button
          className="border px-4 py-2 font-semibold rounded  border-amber-300 hover:border-amber-400
      hover:bg-amber-400 hover:text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Profile;
