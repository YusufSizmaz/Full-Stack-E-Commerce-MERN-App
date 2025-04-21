import React from "react";
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900/70 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-md max-h-[60vh] p-2 bg-white overflow-hidden flex flex-col">
        <button onClick={close} className="w-fit ml-auto block mb-2">
          <IoClose size={25} className="hover:text-red-500 cursor-pointer" />
        </button>
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <img
            src={url}
            alt="full screen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
