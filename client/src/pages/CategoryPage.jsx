import React, { useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  return (
    <section>
      <div className="p-2  bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => {
            setOpenUploadCategory(true);
          }}
          className="text-sm border border-amber-300 hover:bg-amber-400 hover:text-white  px-3 py-1 rounded "
        >
          Add Category
        </button>
      </div>
      {openUploadCategory && (
        <UploadCategoryModel close={() => setOpenUploadCategory(false)} />
      )}
    </section>
  );
};

export default CategoryPage;
