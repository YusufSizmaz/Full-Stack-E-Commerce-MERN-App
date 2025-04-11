import React, { useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  return (
    <section className="p-4">
      <div className="mb-4 bg-white shadow-md flex items-center justify-between p-2">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-amber-300 hover:bg-amber-400 hover:text-white px-3 py-1 rounded"
        >
          Add Sub Category
        </button>
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel close={() => setOpenAddSubCategory(false)} />
      )}
    </section>
  );
};

export default SubCategoryPage;
