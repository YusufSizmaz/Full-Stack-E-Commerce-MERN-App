import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { emailRegex, passwordRegex } from "../utils/Regex";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "./../utils/AxiosToastError";
import login from "./Login";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Şifre ve onay şifresi eşleşmiyor ise
    if (data.password !== data.confirmPassword) {
      toast.error("Şifreler uyuşmuyor.");
      return;
    }

    // E-posta geçerli değilse
    if (!emailRegex.test(data.email)) {
      toast.error("Geçerli bir email giriniz");
      return;
    }

    // Şifre geçerli değilse
    if (!passwordRegex.test(data.password)) {
      toast.error(
        "Şifre en az bir büyük harf, bir küçük harf, bir rakam içermeli ve en az 8 karakter uzunluğunda olmalıdır"
      );
      return;
    }

    // Kullanıcı adı boşsa
    if (!data.username) {
      toast.error("Kullanıcı adı zorunludur.");
      return;
    }

    try {
      const response = await Axios.post("/api/user/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000); // 1 saniye bekle

        console.log("response", response);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2 ">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow-2xl">
        <p className="font-semibold">Welcome to Binkeyit</p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              autoFocus
              className="bg-blue-50 p-2 rounded border outline-none border-gray-300 focus-within:border-amber-300"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="username">User Name :</label>
            <input
              type="text"
              id="username"
              autoFocus
              className="bg-blue-50 p-2 rounded border outline-none border-gray-300 focus-within:border-amber-300"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Enter your user name"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none border-gray-300 focus-within:border-amber-300"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center outline-none border-gray-300 focus-within:border-amber-300">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
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
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {/* {showConfirmPassword ? (
                  <FaRegEye size={20} color="red" />
                ) : (
                  <FaRegEyeSlash size={22} color="green" />
                )} */}
              </div>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Register
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

export default Register;
