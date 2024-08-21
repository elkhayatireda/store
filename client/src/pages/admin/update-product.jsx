import React, { useState, useContext, useEffect } from "react";
import { axiosClient } from "../../api/axios"; // Assuming you're using axios for API requests
import { toast } from "react-toastify";
import { authContext } from "../../contexts/AuthWrapper";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageUp, X, Image, Trash, Eye } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression"; // Import the library
import { undefined } from "zod";

export default function AddProduct() {
  const navigate = useNavigate();
  const userContext = useContext(authContext);
  const [value, setValue] = useState("");
  const [formData, setFormData] = useState({
    productTitle: "",
    description: "",
    visible: true,
    productCategory: "",
    isVariant: false,
    differentPrice: false,
    price: "",
    comparePrice: "",
    variantCount: 0,
    variants: [],
    combinations: [],
    images: [],
  });
  const [changeTracker, setChangeTracker] = useState({
    imagesChanged: false,
    priceChanged: false,
    variantsChanged: false,
    combImage: false,
    description: false,
    title: false,
    productCategory: false,
    combination: false,
  });

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [deletedImages, setDeletedImages] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories/getAll");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching categories");
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchProductData(id);
  }, [id, navigate]);
  const fetchProductData = async (productId) => {
    try {
      const productResponse = await axiosClient.get(`/products/${productId}`);
      const variantResponse = await axiosClient.get(
        `/products/variants/${productId}`
      );
      const combinationResponse = await axiosClient.get(
        `/products/combinations/${productId}`
      );

      const productData = productResponse.data;
      const variantData = variantResponse.data;
      const combinationData = combinationResponse.data;
      setFormData({
        productTitle: productData.title,
        description: productData.description,
        visible: productData.visible,
        productCategory: productData.categoryId,
        isVariant: productData.isVariant,
        differentPrice: productData.differentPrice,
        price: productData.price,
        comparePrice: productData.comparePrice,
        variantCount: variantData.length,
        variants: variantData.map((variant) => ({
          variantName: variant.name,
          values: variant.values,
          newValue: "",
        })),
        combinations: combinationData.map((comb) => ({
          _id: comb._id,
          combination: comb.combination,
          price: comb.price,
          comparePrice: comb.comparePrice,
          variantIndices: comb.variantValues,
          img: comb.image, // Assuming the image field is populated here
        })),
        images: productData.images,
      });

      setValue(productData.description); // Set the description in the rich text editor
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Error fetching product data");
    }
  };

  const handleImageClick = (index) => {
    setCurrentCombinationIndex(index);
    setPopupVisible(true);
  };

  const handleImageSelect = (url) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      combImage: true,
    }));
    const newCombinations = [...formData.combinations];
    newCombinations[currentCombinationIndex].img = url;
    setFormData({
      ...formData,
      combinations: newCombinations,
    });
    setPopupVisible(false);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (id == "isVariant") {
      if (!checked) {
        setFormData((prevState) => ({
          ...prevState,
          variants: [],
        }));
        setChangeTracker((prevState) => ({
          ...prevState,
          variantsChanged: true,
        }));
      }
    }
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };
  const handleAddVariant = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variantCount: prevFormData.variantCount + 1,
      variants: [
        ...prevFormData.variants,
        { variantName: "", values: [], newValue: "" },
      ],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      variantsChanged: true,
    }));
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({
      ...formData,
      variants: newVariants,
    });
  };

  const handleAddValue = (index) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      variantsChanged: true,
    }));
    const newVariants = [...formData.variants];
    const newValue = newVariants[index].newValue.trim();

    if (newValue && !newVariants[index].values.includes(newValue)) {
      newVariants[index].values.push(newValue);
      newVariants[index].newValue = ""; // Clear the input after adding the value
    } else if (newValue || newValue == "") {
      // Optional: Provide feedback if value already exists
      alert("Value already exists or is empty");
    }

    setFormData({
      ...formData,
      variants: newVariants,
    });
    generateCombinations();
  };

  const handleRemoveValue = (index, valueIndex) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      variantsChanged: true,
    }));
    const newVariants = [...formData.variants];
    newVariants[index].values.splice(valueIndex, 1);
    setFormData({
      ...formData,
      variants: newVariants,
    });
    generateCombinations();
  };
  async function compressImages(imageFiles) {
    const compressedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const options = {
          maxSizeMB: 1, // Set the maximum size for the compressed image
          maxWidthOrHeight: 1920, // Set the maximum width or height
          useWebWorker: true, // Use web worker for better performance
        };
        try {
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        } catch (error) {
          console.error("Error during image compression:", error);
          return file; // Return the original file if compression fails
        }
      })
    );

    return compressedImages;
  }

  const handleUpdate = async () => {
    const formDataToSend = new FormData();

    if (formData.variants.length == 0 && formData.differentPrice) {
      formDataToSend.append("differentPrice", false);
    } else {
      formDataToSend.append("differentPrice", formData.differentPrice);
    }
    if (changeTracker.variantsChanged) {
      formDataToSend.append("variants", JSON.stringify(formData.variants));
      formDataToSend.append(
        "combinations",
        JSON.stringify(formData.combinations)
      );
    }

    if (changeTracker.combImage) {
      if (!changeTracker.variantsChanged) {
        formDataToSend.append(
          "combinations",
          JSON.stringify(formData.combinations)
        );
      }
    }
    if (changeTracker.combination) {
      if (!changeTracker.variantsChanged) {
        formDataToSend.append(
          "combinations",
          JSON.stringify(formData.combinations)
        );
      }
    }
    setIsLoading(true);
    formDataToSend.append("description", value);
    formDataToSend.append("categoryId", formData.productCategory);
    formDataToSend.append("visible", formData.visible);
    formDataToSend.append("isVariant", formData.isVariant);
    formDataToSend.append("title", formData.productTitle);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("comparePrice", formData.comparePrice);
    formDataToSend.append("combImage", changeTracker.combImage);
    formDataToSend.append("combination", changeTracker.combination);
    formDataToSend.append("variantsChanged", changeTracker.variantsChanged);
    try {
      const response = await axiosClient.post(
        `/products/update/${id}`,
        formDataToSend
      );
      toast.success("Product updated successfully");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    if (changeTracker.imagesChanged){
      try {
        const response = await axiosClient.post(
          `/products/update-images/${id}`,
          { images: formData.images }
        );
        toast.success("images updated successfully");
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  };

  // Helper function to generate Cartesian product (combinations)
  const cartesianProduct = (arrays) => {
    return arrays.reduce(
      (a, b) =>
        a
          .map((x) => b.map((y) => [...x, y]))
          .reduce((acc, curr) => acc.concat(curr), []),
      [[]]
    );
  };

  const generateCombinations = () => {
    const variantIndices = formData.variants.map((variant, variantIndex) =>
      variant.values.map((_, valueIndex) => ({ variantIndex, valueIndex }))
    );

    const combinations = cartesianProduct(variantIndices);

    let formattedCombinations = combinations.map((comb) => {
      const combination = comb
        .map(
          ({ variantIndex, valueIndex }) =>
            formData.variants[variantIndex].values[valueIndex]
        )
        .join(" / ");

      return {
        combination,
        price: formData.differentPrice ? "" : formData.price,
        comparePrice: formData.differentPrice ? "" : formData.comparePrice,
        variantIndices: comb,
      };
    });

    setFormData({
      ...formData,
      combinations: formattedCombinations,
    });
  };
  const handleCombinationChange = (index, field, value) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      combination: true,
    }));
    const newCombinations = [...formData.combinations];
    newCombinations[index][field] = value;
    setFormData({
      ...formData,
      combinations: newCombinations,
    });
  };
  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default Enter key behavior
      handleAddValue(index);
    }
  };
  const handleFile = async (event) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      imagesChanged: true,
    }));
    const files = event.target.files;
    const newImages = [...formData.images];

    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    const compressedImages = await compressImages(newImages);
    compressedImages.forEach((image, index) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await axiosClient.post(
        "/products/upload-images",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      setFormData({
        ...formData,
        images: [...formData.images, ...response.data],
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const handleDelete = (imgPath) => {
    setChangeTracker((prevState) => ({
      ...prevState,
      imagesChanged: true,
    }));
    const updatedImages = formData.images.filter((image) => image !== imgPath);
    const updatedCombinations = formData.combinations.map((combination) => ({
      ...combination,
      img: combination.img === imgPath ? null : combination.img, // Set to null or remove if needed
    }));
    setFormData({
      ...formData,
      images: updatedImages,
      combinations: updatedCombinations,
    });

    setDeletedImages(imgPath);
  };
  useEffect(() => {
    if (deletedImages !== "") {
      deleteImages();
    }
  }, [deletedImages]);

  const deleteImages = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.post("/products/delete-images", {
        images: deletedImages,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleBack = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.post("/products/delete-images", {
        images: deletedImages,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!formData.isVariant) {
      setFormData((prevState) => ({
        ...prevState,
        differentPrice: false,
      }));
    }
  }, [formData.isVariant]);

  return (
    <div className="flex flex-col pt-5   pr-5 px-10 relative ">
      <div className="w-full fixed bottom-0 border-[1px] bg-white border-gray-200 right-0 left-0  flex items-center justify-end py-3 z-40 ">
        <button
          onClick={handleUpdate}
          className="py-2 px-5 rounded-sm bg-green-500 text-white mr-5 text-lg"
        >
          save
        </button>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 top-0 bottom-0 right-0 left-0">
          <div role="status">
            <svg aria-hidden="true" class="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-[#302939]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="w-full flex items-center justify-between mb-10">
        <h4 className="text-4xl font-semibold text-[#141414]">New Product</h4>
        <Link to='/admin/products' className="py-1 px-3 rounded border-[#000] border-[2px] cursor-pointer">back</Link>
      </div>
      <div>
        <div className="flex gap-10 pb-32 w-full items-start justify-center ">
          <div className="flex flex-col  basis-2/3 gap-10 w-full border-[2px] border-gray-100 p-5 rounded-xl">
            <input
              type="text"
              id="productTitle"
              placeholder="Product Name"
              className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl"
              value={formData.productTitle}
              onChange={handleChange}
            />
            <div className="w-full mb-3 lg:mb-0 lg:mr-6">
              <label className="block text-gray-400 text-md mb-1">
                Product description
              </label>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>
            <div className="w-full">
              <label
                htmlFor="images"
                className="w-full border-2 border-gray-200 rounded-xl p-5 py-10 flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="mb-3 text-black">
                  <ImageUp size={40} />
                </div>
                <p className="text-black text-lg ">
                  Drag & Drop product images or Browse files
                </p>
                <p className="text-gray-400 text-sm">
                  Supports png, jpg, jpeg, webp formats
                </p>
              </label>
              <input
                type="file"
                id="images"
                className="hidden"
                multiple
                onChange={handleFile}
              />
            </div>
            <div className="w-full border-2 border-gray-200 rounded grid grid-cols-5 gap-5 p-2">
              {formData.images.map((imgPath, index) => (
                <div
                  key={index}
                  className="w-full relative group overflow-hidden"
                >
                  <img
                    src={imgPath}
                    alt={`Image ${index + 1}`}
                    className="h-58 transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <div
                    className="absolute top-0 right-0 left-0 bottom-0 items-center justify-center bg-red-500 rounded bg-opacity-50 cursor-pointer hidden group-hover:flex"
                    onClick={() => handleDelete(imgPath)}
                  >
                    <Trash color="red" />
                  </div>
                </div>
              ))}
            </div>
            {!formData.differentPrice && (
              <div className="flex items-center justify-start gap-5 ">
                <input
                  type="text"
                  id="price"
                  placeholder="price"
                  className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-1/2"
                  value={formData.price}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  id="comparePrice"
                  placeholder="compare price"
                  className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-1/2"
                  value={formData.comparePrice}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="flex items-center justify-start gap-2">
              <div className="flex items-center justify-start gap-4 w-full">
                <label
                  className="inline-flex items-center cursor-pointer outline-none"
                  htmlFor="isVariant"
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    id="isVariant"
                    value={formData.isVariant}
                    checked={formData.isVariant}
                    onChange={handleChange}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    the product has variants?
                  </span>
                </label>
                {formData.isVariant && (
                  <>
                    <label
                      className="inline-flex items-center cursor-pointer outline-none"
                      htmlFor="differentPrice"
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        id="differentPrice"
                        value={formData.differentPrice}
                        checked={formData.differentPrice}
                        onChange={handleChange}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        prices depends on variants?
                      </span>
                    </label>
                    <div className="flex items-center justify-start">
                      <button
                        className="w-full py-3 px-10 bg-green-500 text-white"
                        onClick={handleAddVariant}
                      >
                        Add Variant
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {formData.isVariant && (
              <>
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex flex-col border-2 border-gray-200 rounded-xl p-3 mt-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Variant Name"
                        className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded basis-2/5"
                        value={variant.variantName}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantName",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Add Variant Value"
                        className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded basis-2/5"
                        value={variant.newValue}
                        onChange={(e) =>
                          handleVariantChange(index, "newValue", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                      <button
                        className="py-[9px] bg-[#302939] text-white basis-1/5 rounded"
                        onClick={() => handleAddValue(index)}
                      >
                        Add Value
                      </button>
                    </div>

                    <div className="flex items-center justify-start gap-5 mt-3">
                      {variant.values.map((value, valueIndex) => (
                        <div
                          key={valueIndex}
                          className="border-[1px] border-gray-300 p-1 px-2  flex items-center justify-between rounded-lg "
                        >
                          <p>{value}</p>
                          <div
                            className="cursor-pointer border-[1px] border-[#414141] rounded-full ml-3"
                            onClick={() => handleRemoveValue(index, valueIndex)}
                          >
                            <X size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {formData.combinations.length > 0 && (
                  <div className="mt-5">
                    <h3>Combinations</h3>
                    {formData.combinations.map((comb, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-start gap-5 mt-3 py-4 border-[1px] border-gray-100 px-5 rounded"
                      >
                        <div
                          className="w-12 h-12 rounded  flex items-center justify-center bg-gray-100"
                          onClick={() => handleImageClick(index)}
                        >
                          {comb.img ? (
                            <img src={comb.img} alt="" className="w-full" />
                          ) : (
                            <Image color="gray" />
                          )}
                        </div>
                        {isPopupVisible && (
                          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-lg">
                              <button
                                className="absolute top-2 right-2 text-gray-500"
                                onClick={() => setPopupVisible(false)}
                              >
                                <X color="white" size={35} />
                              </button>
                              <div className="grid grid-cols-3 gap-2 p-5">
                                {formData.images.map((img, index) => (
                                  <div
                                    key={index}
                                    className="min-w-28 min-h-28 rounded  flex items-center justify-center cursor-pointer"
                                    onClick={() => handleImageSelect(img)}
                                  >
                                    <img
                                      key={index}
                                      src={img}
                                      alt={`Preview ${index}`}
                                      className="w-28 h-28 object-cover "
                                    />
                                  </div>
                                ))}
                                {typeof formData.combinations[
                                  currentCombinationIndex
                                ].img !== "" && (
                                  <div
                                    className="min-w-28 min-h-28 rounded  flex items-center justify-center cursor-pointer bg-red-100"
                                    onClick={() => handleImageSelect(null)}
                                  >
                                    <Trash color="red" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="max-w-24 min-w-24">{comb.combination}</p>
                        <input
                          type="text"
                          placeholder="Price"
                          className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-2/5"
                          defaultValue={comb.price}
                          disabled={!formData.differentPrice}
                          onChange={(e) =>
                            handleCombinationChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="Compare Price"
                          className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-2/5"
                          defaultValue={comb.comparePrice}
                          disabled={!formData.differentPrice}
                          onChange={(e) =>
                            handleCombinationChange(
                              index,
                              "comparePrice",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col basis-1/3 border-[2px] border-gray-100 p-3 rounded-xl ">
            <div className="flex items-center justify-start gap-5 border-2 border-gray-200 rounded-xl p-3 mb-5">
              <input
                type="checkbox"
                id="visible"
                className=""
                value={formData.visible}
                checked={formData.visible}
                onChange={handleChange}
              />
              <label htmlFor="visible" className="text-gray-500 text-md">
                Visible on Store
              </label>
            </div>
            <select
              id="productCategory"
              className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl mb-3"
              value={formData.productCategory}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((elem) => (
                <option key={elem.title} value={elem._id}>
                  {elem.title}
                </option>
              ))}
            </select>
            <Link
              to="/admin/categories/create"
              target="_blank"
              className="text-sm font-medium text-blue-700 pl-2"
            >
              Or create a new category
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
