import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: [],
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  console.log("allSubCategory:", allSubCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl],
      };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  return (
    <section className="p-4">
      <div className="mb-4 bg-white shadow-md flex items-center justify-between p-2">
        <h2 className="font-semibold">Upload Product</h2>
      </div>

      <div className="grid p-3">
        <form className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border border-gray-300 focus-within:border-amber-300 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              type="text"
              placeholder="Enter product description"
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              multiple
              rows={3}
              className="bg-blue-50 p-2 outline-none border border-gray-300 focus-within:border-amber-300 rounded resize-none"
            />
          </div>

          <div>
            <p>Image</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-neutral-100 h-24 border hover:text-amber-400 border-gray-300 rounded flex justify-center items-center cursor-pointer "
              >
                <div className="text-center flex justify-center items-center flex-col">
                  {imageLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={35} />
                      <p className="font-semibold hover:">Upload Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>
              {/*Display upload image*/}
              <div className="my-2 flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="h-20 w-20 min-w-20 mt-2  bg-blue-50 border border-gray-300 relative group"
                    >
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer "
                        onClick={() => setViewImageURL(img)}
                      />
                      <div
                        onClick={() => handleDeleteImage(index)}
                        className="absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block "
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label>Category</label>
            <div>
              <select
                className="bg-blue-50 border focus-within:border-amber-300 border-gray-300 w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);

                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value={""} disabled>
                  Select Category
                </option>
                {allCategory.map((c, index) => {
                  return <option value={c?._id}>{c.name}</option>;
                })}
              </select>

              <div className="flex flex-wrap gap-3 ">
                {data.category.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productsection"}
                      className="text-sm items-center flex gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-600 cursor-pointer"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label>Sub Category</label>
            <div>
              <select
                className="bg-blue-50 border focus-within:border-amber-300 border-gray-300 w-full p-2 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("Selected value:", value);
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );
                  console.log("Found subCategory:", subCategory);

                  setData((preve) => {
                    return {
                      ...preve,
                      subCategory: [...preve.subCategory, subCategory],
                    };
                  });
                  setSelectSubCategory("");
                }}
              >
                <option value={""} disabled>
                  Select Sub Category
                </option>
                {allSubCategory && allSubCategory.length > 0 ? (
                  allSubCategory.map((c, index) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No subcategories available</option>
                )}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.subCategory.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productsection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveSubCategory(index)}
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </div>
      {ViewImageURL && (
        <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
      )}
    </section>
  );
};

export default UploadProduct;
