import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategory from "../components/EditCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  const allCategory = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    setCategoryData(allCategory);
  }, [allCategory]);

  //Tüm kategoriyi çeken useeffect
  // const fetchCategory = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await Axios({
  //       ...SummaryApi.getCategory,
  //     });

  //     const { data: responseData } = response;

  //     if (responseData.success) {
  //       setCategoryData(responseData.data);
  //     }
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategory();
  // }, []);

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="p-4">
      <div className="mb-4 bg-white shadow-md flex items-center justify-between p-2">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => {
            setOpenUploadCategory(true);
          }}
          className="text-sm border border-amber-300 hover:bg-amber-400 hover:text-white px-3 py-1 rounded"
        >
          Add Category
        </button>
      </div>

      {!categoryData[0] && !loading && <NoData />}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoryData.map((category) => {
          return (
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              key={category._id}
            >
              <div className="h-32 sm:h-40 p-2 flex items-center justify-center">
                <img
                  alt={category.name}
                  src={category.image}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center font-medium px-2 py-1 truncate">
                {category.name}
              </p>
              <div className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(category);
                  }}
                  className="flex-1 bg-green-100 text-green-600 hover:bg-green-200 font-medium py-1.5 rounded cursor-pointer text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmBoxDelete(true);
                    setDeleteCategory(category);
                  }}
                  className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 font-medium py-1.5 rounded cursor-pointer text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Loading />}

      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}
      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;
