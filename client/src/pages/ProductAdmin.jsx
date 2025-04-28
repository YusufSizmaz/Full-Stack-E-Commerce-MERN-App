import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <section className="p-4">
      <div className="mb-4 bg-white shadow-md flex items-center justify-between p-2">
        <h2 className="font-semibold">Product</h2>
      </div>
      {loading && <Loading />}

      <div className="p-4 bg-gray-100">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {productData.map((p, index) => {
            return <ProductCardAdmin data={p} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
