import React from "react";
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900/70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add Field</h1>
          <button>
            <IoClose
              className="hover:text-red-700 cursor-pointer"
              onClick={close}
              size={25}
            />
          </button>
        </div>
        <input
          className="bg-blue-50 my-3 p-2 border border-gray-300 outline-none focus-within:border-amber-300  rounded w-full"
          placeholder="Enter field name"
          value={value}
          onChange={onChange}
        />
        <button
          onClick={submit}
          className=" bg-amber-300 hover:bg-white py-2 px-4 w-fit block mx-auto  text-center font-semibold border border-amber-300 hover:text-neutral-900 cursor-pointer rounded"
        >
          Add Field
        </button>
      </div>
    </section>
  );
};

export default AddFieldComponent;
