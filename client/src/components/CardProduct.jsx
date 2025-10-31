import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

const CardProduct = ({ data }) => {
  const url = `/${valideURLConvert(data.name)}-${data._id}`;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user._id) {
      toast.error("Lütfen önce giriş yapın");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data._id,
          quantity: 1,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success("Ürün sepete eklendi");
        // Update user details to refresh cart count
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={url}
      className="border border-gray-200 p-4 grid gap-3 max-w-52 lg:min-w-52 rounded hover:shadow-md transition-shadow"
    >
      <div className="min-h-20 max-h-32 rounded ">
        <img
          src={data.image[0]}
          className="w-full h-full object-scale-down scale-125"
          alt={data.name}
        />
      </div>
      <div className=" rounded text-sm w-fit p-[1px] px-2 z-10 text-green-600 bg-green-100">
        10 min
      </div>
      <div className="font-medium text-ellipsis line-clamp-2">{data.name}</div>
      <div className="w-fit text-sm text-gray-600">{data.unit}</div>

      <div className="flex items-center justify-between gap-3 ">
        <div className="font-semibold ">{DisplayPriceInRupees(data.price)}</div>
        <div className="">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "..." : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
