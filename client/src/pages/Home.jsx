import React from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListPage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id === id;
      });
      return filterData ? sub : null;
    });

    if (!subcategory) {
      console.error("Subcategory not found for category:", cat);
      return;
    }

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);
  };

  const handleCategoryClick = (id, catName) => {
    handleRedirectProductListPage(id, catName);
  };

  return (
    <section className="bg-white">
      {/* Banner Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="w-full rounded-lg overflow-hidden shadow-md">
          <img
            src={banner}
            className="w-full h-auto hidden lg:block object-cover"
            alt="banner"
          />
          <img
            src={bannerMobile}
            className="w-full h-auto lg:hidden object-cover"
            alt="banner"
          />
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {loadingCategory
            ? new Array(12).fill(null).map((c, index) => {
                return (
                  <div
                    key={index + "loadingcategory"}
                    className="bg-white rounded-lg shadow-md p-3 min-h-32 grid gap-2 animate-pulse"
                  >
                    <div className="bg-gray-200 min-h-20 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded"></div>
                  </div>
                );
              })
            : categoryData.map((cat, index) => {
                return (
                  <div
                    key={cat._id + "displayCategory"}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                    onClick={() => handleCategoryClick(cat._id, cat.name)}
                  >
                    <div className="p-3 flex flex-col items-center justify-center min-h-32">
                      <div className="w-full h-20 flex items-center justify-center mb-2">
                        <img
                          src={cat.image}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          alt={cat.name}
                        />
                      </div>
                      <p className="text-xs text-center font-medium text-gray-700 line-clamp-2 mt-auto">
                        {cat.name}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Category Wise Product Display */}
      {categoryData.length > 0 && (
        <div className="space-y-8 pb-8">
          {categoryData.map((c, index) => {
            return (
              <CategoryWiseProductDisplay
                key={c?._id + "CategorywiseProduct"}
                id={c?._id}
                name={c?.name}
                categoryId={c?._id}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Home;
