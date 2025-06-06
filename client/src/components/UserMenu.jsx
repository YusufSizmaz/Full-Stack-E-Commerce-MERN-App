import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import { AxiosToastError } from "../utils/AxiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Önce localStorage'ı temizle
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redux state'i temizle
      dispatch(logout());

      // Menüyü kapat
      if (close) {
        close();
      }

      // Logout API'sini çağır
      await Axios.get(SummaryApi.logout.url);

      // Başarılı mesajını göster
      toast.success("Başarıyla çıkış yapıldı");

      // Sayfayı yenile ve ana sayfaya yönlendir
      setTimeout(() => {
        window.location.replace("/");
      }, 100);
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <div>
      <div className="font-semibold">Hesabım</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{" "}
          <span className="text-medium text-red-600">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-primary-200"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
          >
            Kategoriler
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
          >
            Alt Kategoriler
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
          >
            Ürün Yükle
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
          >
            Ürünler
          </Link>
        )}

        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
        >
          Siparişlerim
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
        >
          Adreslerim
        </Link>
        <button
          onClick={handleLogout}
          className="text-left cursor-pointer px-2 hover:bg-orange-400 py-1 rounded hover:text-white"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
