import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { valideURLConvert } from "../utils/valideURLConvert";

const CategoryWiseProductDisplay = ({ id, name, categoryId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

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
  }, [id]);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const loadingCardNumber = new Array(6).fill(null);

  // Build "See All" URL
  const seeAllUrl = categoryId ? `/${valideURLConvert(name)}-${categoryId}` : "";

  return (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold text-lg md:text-xl text-gray-800">
            {name}
          </h3>
          {seeAllUrl && (
            <Link
              to={seeAllUrl}
              className="text-green-600 hover:text-green-700 font-medium text-sm md:text-base transition-colors"
            >
              See All →
            </Link>
          )}
        </div>
        <div className="relative">
          <div
            className="flex items-center gap-4 md:gap-6 lg:gap-8 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
            ref={containerRef}
          >
            {loading &&
              loadingCardNumber.map((_, index) => {
                return (
                  <CardLoading key={"CategorywiseProductDisplay123" + index} />
                );
              })}

            {!loading && data.length === 0 && (
              <div className="w-full text-center py-8 text-gray-500">
                Bu kategoride henüz ürün bulunmamaktadır.
              </div>
            )}

            {!loading &&
              data.map((p, index) => {
                return (
                  <CardProduct
                    data={p}
                    key={p._id + "CategorywiseProductDisplay" + index}
                  />
                );
              })}
          </div>

          {/* Navigation Buttons - Desktop Only */}
          {!loading && data.length > 0 && (
            <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none">
              <div className="container mx-auto px-4 flex justify-between">
                <button
                  onClick={handleScrollLeft}
                  className="pointer-events-auto z-10 bg-white hover:bg-gray-100 shadow-lg text-xl p-3 rounded-full transition-all hover:scale-110"
                  aria-label="Scroll left"
                >
                  <FaAngleLeft />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="pointer-events-auto z-10 bg-white hover:bg-gray-100 shadow-lg text-xl p-3 rounded-full transition-all hover:scale-110"
                  aria-label="Scroll right"
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
