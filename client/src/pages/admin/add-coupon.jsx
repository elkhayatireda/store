import React, { useState, useContext, useEffect, useRef } from "react";
import { axiosClient } from "../../api/axios"; // Assuming you're using axios for API requests
import { toast } from "react-toastify";
import { authContext } from "../../contexts/AuthWrapper";
import { ImageUp, X, Image, Trash, ChevronLeft, Check } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import ProductSelect from "../../components/admin/reviews/product-select";
import DatePickerDemo from "../../components/admin/coupons/datepicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays, format, formatISO } from "date-fns";

export default function AddCoupon() {
  const navigate = useNavigate();
  const userContext = useContext(authContext);
  const [formData, setFormData] = useState({
    query: "",
    date: new Date(),
    allProduct: true,
    selectedProducts: [],
    selectedDiscountType: "",
    Code: "",
    value: "",
    maxUsage: "",
    active: false,
    minOrderValue: "",
  });
  const [errors, setErrors] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching products");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    // If the "allProduct" checkbox is checked, clear selectedProducts
    if (id === "allProduct" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        allProduct: checked,
        selectedProducts: [], // Clear selected products
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  };
  const handleDiscountTypeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDiscountType: value,
    }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append form data
    formDataToSend.append("Code", formData.Code);
    formDataToSend.append(
      "selectedDiscountType",
      formData.selectedDiscountType
    );
    formDataToSend.append("value", formData.value);
    formDataToSend.append("minOrderValue", formData.minOrderValue);
    formDataToSend.append("date", formatISO(new Date(formData.date)));
    formDataToSend.append("allProduct", formData.allProduct);
    formDataToSend.append("active", formData.active);
    formDataToSend.append("maxUsage", formData.maxUsage);
    if (!formData.allProduct) {
      formDataToSend.append(
        "selectedProducts",
        JSON.stringify(formData.selectedProducts)
      );
    }

    try {
      console.log(formData.allProduct)
      console.log(formData.selectedProducts)
      const response = await axiosClient.post(`/coupons`, formDataToSend);
      toast.success("Coupon created successfully");

      // Reset form after successful creation
      setFormData({
        query: "",
        date: new Date(),
        allProduct: true,
        selectedProducts: [],
        selectedDiscountType: "",
        Code: "",
        value: "",
        active: false,
        minOrderValue: "",
      });
      navigate("/admin/coupons");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData,
      date: selectedDate, // Update date in formData
    }));
  };

  const handleSearchChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      query: e.target.value,
    }));
    setOpen(true);
  };

  const handleProductClick = (productId) => {
    const newSelectedProducts = formData.selectedProducts.includes(productId)
      ? formData.selectedProducts.filter((id) => id !== productId) // Unselect product
      : [...formData.selectedProducts, productId]; // Select product

    setFormData((prevData) => ({
      ...prevData,
      selectedProducts: newSelectedProducts,
    }));
  };

  useEffect(() => {
    setFilteredProducts(products);
    if(products.length != 0 && formData.query != ''){
        const tmp = products.filter((product) =>
            product.title.toLowerCase().includes(formData.query.toLowerCase())
        );
        setFilteredProducts(tmp);
    }
  }, [formData.query]);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  const handleDelete = (id) => {
    // Update formData by filtering out the deleted product ID
    const updatedProducts = formData.selectedProducts.filter(
      (productId) => productId !== id
    );
    setFormData({ ...formData, selectedProducts: updatedProducts });
  };

  const validate = () => {
    const error = [];

    if (!formData.selectedDiscountType) {
      error.push("Discount type is required");
    }
    if (!formData.selectedProducts.length && !formData.allProduct) {
      error.push("At least one product must be selected");
    }
    if (!formData.date) {
      error.push("Date is required");
    } else if (new Date(formData.date) < new Date()) {
      error.push("Date cannot be in the past");
    }

    setErrors(error); // Update the errors state
    return error.length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    const isValid = validate();

    if (!isValid) {
      // Handle the case where there are errors
      return;
    }
    // Format the date for MongoDB (ISO format)
    const formattedDate = formatISO(new Date(formData.date));

    // Prepare the data to store in MongoDB
    const dataToSubmit = {
      ...formData,
      date: formattedDate, // Update date with formatted date
    };

   
    handleCreate();
  };
  return (
    <div className="flex flex-col pt-5   pr-5 px-10 relative pb-36">
      <div className="w-full fixed bottom-0 border-[1px] bg-white border-gray-200 right-0 left-0  flex items-center justify-end py-3 z-40">
        <button
          onClick={handleSubmit}
          className="py-2 px-5 rounded-sm bg-green-500 text-white mr-5 text-lg"
        >
          save
        </button>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 top-0 bottom-0 right-0 left-0">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-[#302939]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="w-full flex items-center justify-between mb-10">
        <h4 className="text-4xl font-semibold text-[#141414]">Create Coupon</h4>
        <Link
                className='flex items-center gap-0.5 text-blue-500'
                to={'/admin/coupons'}
            >
                <ChevronLeft size={18} /> Back
            </Link>
      </div>

      {errors.length > 0 && (
        <ul className="w-full bg-red-100 rounded p-4  mb-2 flex flex-col gap-2 ">
          {errors.map((errorMsg, index) => (
            <li key={index} className="text-red-600 text-sm">
              {errorMsg}
            </li>
          ))}
        </ul>
      )}

      <div className="border-2 border-gray-200 rounded p-4 ">
        <div className="flex flex-col gap-5  w-full ">
          <div className="flex  items-center justify-between gap-6">
            <div className="basis-1/3">
              <input
                type="text"
                id="Code"
                placeholder="Coupon Code*"
                className="h-11 pl-5 w-full outline-none border-2 border-gray-200 rounded"
                value={formData.Code}
                onChange={handleChange}
              />
            </div>
            <div className="w-full basis-1/3">
              <Select
                className="outline-none "
                onValueChange={handleDiscountTypeChange}
              >
                <SelectTrigger className="w-full outline-none border-2 border-gray-200 rounded h-11">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">percentage</SelectItem>
                  <SelectItem value="fixed">fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="basis-1/3">
              <input
                type="Number"
                id="value"
                placeholder="Coupon value*"
                className="h-11 pl-5 pr-3 w-full outline-none border-2 border-gray-200 rounded"
                value={formData.value}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full flex  items-center justify-start gap-6">
            <div className="w-full basis-1/3">
              <input
                type="Number"
                id="minOrderValue"
                placeholder="min order value*"
                className="h-11 pl-5 pr-3 w-full outline-none border-2 border-gray-200 rounded"
                value={formData.minOrderValue}
                onChange={handleChange}
              />
            </div>

            <div className="w-full basis-1/3">
              <DatePickerDemo onDateChange={handleDateChange} />
            </div>
            <div className="basis-1/3">
              <input
                type="Number"
                id="maxUsage"
                placeholder="Coupon maxUsage*"
                className="h-11 pl-5 pr-3 w-full outline-none border-2 border-gray-200 rounded"
                value={formData.maxUsage}
                onChange={handleChange}
              />
            </div>
           
          </div>
          
          <div className="w-full flex  items-center justify-start gap-6">
          
            <label
              className="inline-flex items-center cursor-pointer outline-none w-full basis-1/3 "
              htmlFor="allProduct"
            >
              <input
                type="checkbox"
                className="sr-only peer"
                id="allProduct"
                value={formData.allProduct}
                checked={formData.allProduct}
                onChange={handleChange}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                the coupon for all products?
              </span>
            </label>
            <label
              className="inline-flex items-center cursor-pointer outline-none w-full basis-1/3 "
              htmlFor="active"
            >
              <input
                type="checkbox"
                className="sr-only peer"
                id="active"
                value={formData.active}
                checked={formData.active}
                onChange={handleChange}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                the coupon is active?
              </span>
            </label>
            <div
              className={`relative pb-18 w-full basis-1/3 ${
                formData.allProduct ? "opacity-0 pointer-events-none" : ""
              }`}
              ref={dropdownRef}
            >
              <input
                type="text"
                id="query"
                placeholder="Search product*"
                className="h-11 pl-5 pr-3 w-full outline-none border-2 border-gray-200 rounded"
                value={formData.query}
                onChange={handleSearchChange}
                onFocus={() => setOpen(true)}
              />
              {open && (
                <div className="absolute bg-white top-12 left-0 right-0 z-40 overflow-y-auto max-h-60 border border-gray-300 rounded shadow-lg">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className={`flex items-center justify-between py-1 px-2 cursor-pointer ${
                          formData.selectedProducts.includes(product._id)
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 overflow-hidden flex items-center justify-center">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full"
                            />
                          </div>
                          <span
                            className={` ${
                              formData.selectedProducts.includes(product._id)
                                ? "text-blue-700"
                                : ""
                            }`}
                          >
                            {product.title}
                          </span>
                        </div>
                        {formData.selectedProducts.includes(product._id) && (
                          <Check color="blue" size="18" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No products found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex  items-center justify-start gap-16">
            {formData.selectedProducts.map((productId) => {
              const product = products.find((p) => p._id === productId);
              return (
                product && (
                  <div
                    key={product.id}
                    className="flex items-center border-[1px] border-gray-200 p-3 rounded gap-2"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-8"
                    />
                    <span className="mr-2 text-sm font-bold">
                      {product.title}
                    </span>
                    <Trash
                      size={20}
                      color="red"
                      className="cursor-pointer"
                      onClick={() => handleDelete(product._id)}
                      aria-label={`Delete ${product.title}`}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
