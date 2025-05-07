import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4 ">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link to="" className="text-green-700 hover:text-green-600">
          See All
        </Link>
      </div>
      <div>
        <CardLoading />
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
