import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import useTogglePassword from "../hooks/useState";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    emailOrUsername: "",
    newPassword: "",
    confirmPassword: "",
  });

  const {
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
  } = useTogglePassword();

  const valideValue = Object.values(data).every((el) => el);

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }

    if (location?.state?.emailOrUsername) {
      setData((prev) => ({
        ...prev,
        emailOrUsername: location?.state?.emailOrUsername,
      }));
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Yeni şifreler eşleşmelidir.");
      return;
    }

    try {
      const response = await Axios.put("/api/user/reset-password", {
        ...SummaryApi.resetPassword,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          emailOrUsername: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2 ">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow-2xl">
        <p className="font-semibold text-lg ">Enter Your Password</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center outline-none border-gray-300 focus-within:border-amber-300">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full outline-none"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              <div onClick={togglePassword} className="cursor-pointer">
                {showPassword ? (
                  <FaRegEye size={20} color="red" />
                ) : (
                  <FaRegEyeSlash size={22} color="green" />
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center outline-none border-gray-300 focus-within:border-amber-300">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your confirm password"
              />
              <div onClick={toggleConfirmPassword} className="cursor-pointer">
                {showConfirmPassword ? (
                  <FaRegEye size={20} color="red" />
                ) : (
                  <FaRegEyeSlash size={22} color="green" />
                )}
              </div>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-green-600 font-semibold hover:text-green-700 "
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
