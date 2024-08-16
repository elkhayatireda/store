import React, { useState, useContext } from 'react';
import { axiosClient } from '../../api/axios'; // Assuming you're using axios for API requests
import {  toast } from 'react-toastify';
import { authContext } from '../../contexts/AuthWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageUp, X } from 'lucide-react'; 



export default function AddProduct() {
  const userContext = useContext(authContext);
  const [value, setValue] = useState('');
  const [formData, setFormData] = useState({
    productTitle: '',
    slug: '',
    description: '',
    visible: false,
    productCategory: '',
    confirmPassword: '',
    variant: false,
    differentPrice: false, // Added to track if the product has variants
    price: '', 
    comparePrice: '',
    variantCount: 0, 
    variants: [],
    combinations: [],
    images: [],
    
  });
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(null);

  const handleImageClick = (index) => {
    setCurrentCombinationIndex(index);
    setPopupVisible(true);
  };

  const handleImageSelect = (image) => {
    const newCombinations = [...formData.combinations];
    newCombinations[currentCombinationIndex].img = image;
    setFormData({
      ...formData,
      combinations: newCombinations,
    });
    setPopupVisible(false);
    console.log(formData)
  };


  const handlePopupClose = () => {
    setPopupVisible(false);
  };



  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };
  const handleAddVariant = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variantCount: prevFormData.variantCount + 1,
      variants: [...prevFormData.variants, { variantName: '', values: [], newValue: '' }],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({
      ...formData,
      variants: newVariants,
    });
  };

  const handleAddValue = (index) => {
    const newVariants = [...formData.variants];
    const newValue = newVariants[index].newValue.trim();

    if (newValue && !newVariants[index].values.includes(newValue)) {
        newVariants[index].values.push(newValue);
        newVariants[index].newValue = ''; // Clear the input after adding the value
    } else if (newValue || newValue == '' ) {
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
    const newVariants = [...formData.variants];
    newVariants[index].values.splice(valueIndex, 1);
    setFormData({
      ...formData,
      variants: newVariants,
    });
    generateCombinations();
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();

    // Append the text data
    formDataToSend.append('productTitle', formData.productTitle);
    formDataToSend.append('variants', JSON.stringify(formData.variants));
    formDataToSend.append('combinations', JSON.stringify(formData.combinations));

    // Append images
    formData.images.forEach((image, index) => {
        formDataToSend.append('images', image); // Ensure your backend handles arrays of images
    });

    try {
        const response = await axiosClient.post('/api/products', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        toast.success('Product created successfully');
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
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
    const variantValues = formData.variants.map((variant) => variant.values);
    const combinations = cartesianProduct(variantValues);
    let formattedCombinations = [];
    if(formData.differentPrice){
        formattedCombinations = combinations.map((comb) => ({
        combination: comb.join(' / '),
        price: '',
        comparePrice: '',
      }));
    }else{
        formattedCombinations = combinations.map((comb) => ({
        combination: comb.join(' / '),
        price: formData.price,
        comparePrice: formData.comparePrice,
      }));
    }
    
    setFormData({
      ...formData,
      combinations: formattedCombinations,
    });
  };

  const handleCombinationChange = (index, field, value) => {
    const newCombinations = [...formData.combinations];
    newCombinations[index][field] = value;
    setFormData({
      ...formData,
      combinations: newCombinations,
    });
  };
  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior
        handleAddValue(index);
    }
};
const handleFile = (event) => {
  const files = event.target.files; // Get the selected files
  const newImages = [...formData.images];

  // Add new files to the state
  for (let i = 0; i < files.length; i++) {
    newImages.push(files[i]);
  }

  setFormData({
    ...formData,
    images: newImages,
  });
};
  // useEffect(()=>{
  //   if(userContext.user === undefined){
  //     userContext.getAdmin();
  //   }
  // },[userContext.user]);
  return (
    <div className='flex flex-col pt-5   pr-5 px-10 relative '>
      <div className="w-full fixed bottom-0 border-[1px] bg-white border-gray-200 right-0 left-0  flex items-center justify-end py-3 ">
        <button 
          onClick={handleUpdate}
          className='py-2 px-5 rounded-sm bg-[#302939] text-white mr-5 text-lg'
        >
        save
        </button>
      </div>
      <div className="w-full flex items-center justify-between mb-10">
        <h4 className='text-4xl font-semibold text-[#141414]'>New Product</h4>
      </div>
      <div>
        <div className='flex gap-10 pb-32 w-full items-start justify-center '>
          <div className="flex flex-col  basis-2/3 gap-10 w-full border-[2px] border-gray-500 p-3 rounded-xl">
              {/* <label htmlFor="productTitle" className='block text-[#000] text-md mb-1'>Product title</label> */}
              <input 
                  type="text" 
                  id="productTitle" 
                  placeholder='Product Name' 
                  className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                  value={formData.productTitle}
                  onChange={handleChange}
              />
        
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label className='block text-gray-400 text-md mb-1'>Product description</label>
              <ReactQuill theme="snow" value={value} onChange={setValue}/>
            </div>
            <div className="w-full">
              <label htmlFor='images' className='w-full border-2 border-gray-200 rounded-xl p-5 py-10 flex flex-col items-center justify-center cursor-pointer'>
                <div className="mb-3 text-black"> 
                  <ImageUp size={40}/>
                </div>
                <p className='text-black text-lg '>Drop product images or Browse</p>
                <p className='text-gray-400 text-sm'>Supports png, jpg, jpeg, webp formats</p>
              </label>
              <input 
                  type="file" 
                  id="images" 
                  className='hidden'
                  multiple
                  onChange={handleFile}
              />
            </div>
            <div className="flex items-center justify-start gap-2">
              <input 
                  type="checkbox" 
                  id="variant" 
                  className=''
                  value={formData.variant}
                  checked={formData.variant}
                  onChange={handleChange}
              />
              <label htmlFor='variant' className='text-gray-800 text-md'>the product has variants? </label>
            </div>
            {!formData.differentPrice && (
            <div className='flex items-center justify-start gap-5 '>
            <input 
                type="text" 
                id='price'
                placeholder='price' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-1/2'
                value={formData.price}
                onChange={handleChange}
            />
            <input 
                  type="text" 
                  id='comparePrice'
                  placeholder='compare price' 
                  className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-1/2'
                  value={formData.comparePrice}
                  onChange={handleChange}
            />
            </div>
          )}
            {formData.variant && (<>
              <div className="flex items-center justify-start gap-2">
                <input 
                    type="checkbox" 
                    id="differentPrice" 
                    className=''
                    checked={formData.differentPrice} // Use checked for checkboxes
                    onChange={handleChange}
                />
                <label htmlFor='differentPrice' className='text-gray-800 text-md'>prices depends on variants?</label>
              </div>
          
            <div className="flex items-center justify-start gap-2">
             <button className='w-1/3 py-3 bg-green-500 text-white' onClick={handleAddVariant}>Add Variant</button>
            </div>
            {formData.variants.map((variant, index) => (
            <div key={index} className="flex flex-col border-2 border-gray-200 rounded-xl p-3 mt-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="Variant Name"
                  className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-2/5"
                  value={variant.variantName}
                  onChange={(e) => handleVariantChange(index, 'variantName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Add Variant Value"
                  className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-2/5"
                  value={variant.newValue}
                  onChange={(e) => handleVariantChange(index, 'newValue', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
                <button
                  className="py-[9px] bg-[#302939] text-white basis-1/5 rounded-xl"
                  onClick={() => handleAddValue(index)}
                 
                >
                  Add Value
                </button>
              </div>

              <div className="flex items-center justify-start gap-5 mt-3">
                {variant.values.map((value, valueIndex) => (
                  <div
                    key={valueIndex}
                    className="border-[1px] border-[#302939] p-1 px-2 min-w-20 flex items-center justify-between rounded-lg bg-gray-100"
                  >
                    <p>{value}</p>
                    <div
                      className="cursor-pointer border-[1px] border-[#302939] rounded-lg"
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
  <div className="mt-5" >
    <h3>Combinations</h3>
    {formData.combinations.map((comb, index) => (
      <div key={index} className="flex items-center justify-start gap-5 mt-3">
        <div className="w-16 h-16 rounded border-[1px] border-gray-300 flex items-center justify-center" onClick={() => handleImageClick(index)}>
          <img src={comb.img} alt="" className="w-full" />
        </div>
        {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg">
          <button className="absolute top-2 right-2 text-gray-500" onClick={()=>setPopupVisible(false)}>
            &times;
          </button>
          <div className="grid grid-cols-3 gap-5 p-5">
           
            {formData.images.map((file, index) => (
              <div
              key={index}
              className="w-24 h-24 rounded border-[1px] border-gray-300 flex items-center justify-center cursor-pointer"
              onClick={() => handleImageSelect(URL.createObjectURL(file))}
            >
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="w-24 h-24 object-cover m-2"
          />
            </div>
        ))}
          </div>
        </div>
      </div>
      )}
        <p className="w-full basis-2/5">{comb.combination}</p>
        <input
          type="text"
          placeholder="Price"
          className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-2/5"
          defaultValue={formData.price}
          disabled={!formData.differentPrice}
          onChange={(e) => handleCombinationChange(index, 'price', e.target.value)}
        />
        <input
          type="text"
          placeholder="Compare Price"
          className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl basis-2/5"
          defaultValue={formData.comparePrice}
          disabled={!formData.differentPrice} 
          onChange={(e) => handleCombinationChange(index, 'comparePrice', e.target.value)}
        />
      </div>
    ))}

{formData && (
  <div className="mt-5 bg-gray-100 p-5 rounded-lg">
    <h3 className="text-xl font-bold mb-3">Form Data</h3>
    <pre className="whitespace-pre-wrap">
      {JSON.stringify(formData, null, 2)}
    </pre>
  </div>
)}
  
  </div>
)}

            </>
          )}
        

          </div>
          <div className="flex flex-col basis-1/3 border-[2px] border-gray-500 p-3 rounded-xl gap-5">
            <div className="flex items-center justify-start gap-5 border-2 border-gray-200 rounded-xl p-3">
              <input 
                  type="checkbox" 
                  id="visible" 
                  className=''
                  value={formData.visible}
                  onChange={handleChange}
              />
              <label htmlFor='visible' className='text-gray-500 text-md'>Visible on Store</label>
            </div>
            <select 
                id="category" 
                className="py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl" 
                value={formData.productCategory} 
                onChange={handleChange}
            >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="books">Books</option>
                <option value="home">Home</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
