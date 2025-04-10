import React from "react";
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({ cancel, confirm, close }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/70 p-4 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-4 rounded">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-semibold  ">Permanenet Delete</h1>
          <button onClick={close}>
            <IoClose size={25} className="cursor-pointer hover:text-red-500" />
          </button>
        </div>
        <p className="my-4 ">Are you sure permanenet delete? </p>
        <div className="w-fit ml-auto flex items-center gap-3">
          <button
            onClick={cancel}
            className="px-4 py-1 border border-red-500 text-red-500 hover:text-white hover:bg-red-500 rounded"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            className="px-4 py-1 border border-green-500  text-green-500 hover:text-white hover:bg-green-500  rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
