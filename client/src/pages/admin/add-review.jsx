import React, { useState, useContext, useEffect, useRef } from "react";
import { axiosClient } from "../../api/axios"; // Assuming you're using axios for API requests
import { toast } from "react-toastify";
import { authContext } from "../../contexts/AuthWrapper";
import { ImageUp, X, ChevronLeft, Trash, Eye } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import ProductSelect from "../../components/admin/reviews/product-select";
import StarRating from "../../components/admin/reviews/start-rating";
import { useDropzone } from 'react-dropzone';

export default function AddProduct() {
  const navigate = useNavigate();
  const userContext = useContext(authContext);
  const [formData, setFormData] = useState({
    stars: 0,
    fullName: "",
    email: "",
    productId: '',
    description: "",
    images: [],
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleDrop = async (acceptedFiles) => {
    const newImages = [...formData.images];

    for (let i = 0; i < acceptedFiles.length; i++) {
      newImages.push(acceptedFiles[i]);
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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024 // 5MB
});

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/products");
      setProducts(response.data);
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
    const { id, checked, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
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
  const handleCreate = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();

    formDataToSend.append("description", formData.description);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("productId", formData.productId);
    formDataToSend.append("rating", formData.stars);
    
    if (formData.images && formData.images.length > 0) {
      formDataToSend.append("isImage", 'true');
      formDataToSend.append("images", JSON.stringify(formData.images));

    }else{
      formDataToSend.append("isImage", 'false');
    }
    try {
      const response = await axiosClient.post(`/reviews`,formDataToSend);
      toast.success("review created successfully");
      navigate("/admin/reviews");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }finally{
        setIsLoading(false);
    }
    
  };

  const handleRatingChange = (newRating) => {
    setFormData((prevData) => ({
      ...prevData,
      stars: newRating,
    }));
  };
  const handleProductChange = (id) => {
    console.log(id)
    setFormData((prevData) => ({
      ...prevData,
      productId: id,
    }));
  };
  const [deletedImages, setDeletedImages] = useState("");
  const handleFile = async (event) => {
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
    const updatedImages = formData.images.filter((image) => image !== imgPath);
    setFormData({
      ...formData,
      images: updatedImages,
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

  return (
    <div className="flex flex-col pt-5   pr-5 px-10 relative pb-36">
      <div className="w-full fixed bottom-0 border-[1px] bg-white border-gray-200 right-0 left-0  flex items-center justify-end py-3 z-40">
        <button
          onClick={handleCreate}
          className="py-2 px-5 rounded-sm bg-green-500 text-white mr-5 text-lg"
        >
          save
        </button>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 top-0 bottom-0 right-0 left-0">
        <div role="status">
          <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-[#302939]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      )}
      <div className="w-full flex items-center justify-between mb-10">
        <h4 className="text-4xl font-semibold text-[#141414]">Create Review</h4>
        <Link
                className='flex items-center gap-0.5 text-blue-500'
                to={'/admin/reviews'}
            >
                <ChevronLeft size={18} /> Back
            </Link>
      </div>
      <div className="border-2 border-gray-200 rounded p-4 ">
        <div className="flex items-start justify-between gap-5 mb-5">
          <div className="basis-3/5 flex flex-col gap-5  w-full ">
            <div className="flex  items-center justify-between gap-6">
              <div className="basis-1/2">
                <input
                  type="text"
                  id="fullName"
                  placeholder="first Name*"
                  className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="basis-1/2">
                <input
                  type="text"
                  id="email"
                  placeholder="Email*"
                  className="py-2 pl-5 outline-none border-2 border-gray-200 rounded w-full"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex  items-center justify-between gap-6">
              <div className="basis-1/2">
                <ProductSelect products={products} onProductChange={handleProductChange} selected={formData.productId}/>
              </div>
              <div className="basis-1/2 ">
                <StarRating
                  rating={formData.stars}
                  onRatingChange={handleRatingChange}
                />
              </div>
            </div>
          </div>
          <div className="basis-2/5 w-full ">
            <textarea
              className="py-2 pl-5  outline-none border-2 border-gray-200 rounded w-full h-28 resize-none"
              placeholder="description"
              id="description"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="w-full"  {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
          <label
            htmlFor="images"
            className="w-full border-2 border-gray-200 rounded p-5  flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="mb-1 text-black">
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
        {formData.images.length != 0 && (
          <div className="w-full border-2 border-gray-200 rounded grid grid-cols-5 gap-5 p-2 mt-10">
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
        )}
      </div>
    </div>
  );
}
