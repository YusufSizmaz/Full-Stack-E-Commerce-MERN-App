import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const UploadCategoryModel = ({ close }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
