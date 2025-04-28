import React from "react";

const ProductCardAdmin = ({ data }) => {
  return (
    <div className="w-36 p-4 bg-white">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-semibold">{data?.name}</p>
      <p>{data?.unit}</p>
    </div>
  );
};

export default ProductCardAdmin;
