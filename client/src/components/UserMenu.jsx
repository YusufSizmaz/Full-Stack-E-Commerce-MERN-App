import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import { AxiosToastError, AxiosToastSuccess } from "../utils/AxiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      console.log("logout", response);
      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1 bg-green-200 rounded">
          {user.name || user.mobile}
        </span>
        <Link to={"/dashboard/profile"} className="hover:text-amber-400">
          <HiOutlineExternalLink size={20} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1">
        <Link
          to={"/dashboard/myorders"}
          className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
        >
          My Orders
        </Link>
        <Link
          to={"/dashboard/address"}
          className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
        >
          Save Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left cursor-pointer px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
