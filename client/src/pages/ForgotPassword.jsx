import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "./../utils/AxiosToastError";

const ForgotPassword = () => {
  const [data, setData] = useState({
    emailOrUsername: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: {
          emailOrUsername: data.emailOrUsername,
          data: data,
        },
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", {
          state: data,
        });
        setData({
          emailOrUsername: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2 ">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow-2xl">
        <p className="font-semibold text-lg ">Forgot Password</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="emailOrUsername">Email veya Username :</label>
            <input
              type="text"
              id="emailOrUsername"
              className="bg-blue-50 p-2 border rounded outline-none border-gray-300 focus-within:border-amber-300"
              name="emailOrUsername"
              value={data.emailOrUsername}
              onChange={handleChange}
              placeholder="Email veya Username girin"
            />
          </div>

          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send to Email
          </button>
        </form>

        <p>
          Already have account?{" "}
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

export default ForgotPassword;
