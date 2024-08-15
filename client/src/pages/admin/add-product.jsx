import React, { useState, useContext } from 'react';
import { axiosClient } from '../../api/axios'; // Assuming you're using axios for API requests
import {  toast } from 'react-toastify';
import { authContext } from '../../contexts/AuthWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddProduct() {
  const userContext = useContext(authContext);
  const [value, setValue] = useState('');
  const [formData, setFormData] = useState({
    productTitle: '',
    slug: '',
    description: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

  };

  const handleUpdate = async () => {
    const { productTitle, lastName, email, currentPassword, newPassword, confirmPassword } = formData;
    if ((currentPassword !== '') && (newPassword !== confirmPassword || newPassword == "")) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const response = await axiosClient.put('/admin', {
        productTitle,
        lastName,
        email,
        currentPassword, 
        newPassword
      });
      console.log(response.data);
      toast.success('Profile updated successfully');
      setFormData({
        productTitle: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('something went wrong');
    }
  };
  // useEffect(()=>{
  //   if(userContext.user === undefined){
  //     userContext.getAdmin();
  //   }
  // },[userContext.user]);
  return (
    <div className='flex flex-col pt-28 pl-24  pr-5 px-10 relative '>
        {/*  */}
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
          <div className='flex gap-10 pb-32 w-full items-start justify-center'>
            <div className="flex flex-col  basis-1/2">
                <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  {/* <label htmlFor="productTitle" className='block text-[#000] text-md mb-1'>Product title</label> */}
                  <input 
                      type="text" 
                      id="productTitle" 
                      placeholder='Product Name' 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={formData.productTitle}
                      onChange={handleChange}
                  />
              </div>
                <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                <ReactQuill theme="snow" value={value} onChange={setValue} />
              </div>
            </div>
            <div className="flex flex-col basis-1/2">
                <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  {/* <label htmlFor="productTitle" className='block text-[#6d6c6c] text-md mb-1'>First Name</label> */}
                  <input 
                      type="text" 
                      id="slug" 
                      placeholder='product url' 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={formData.slug}
                      onChange={handleChange}
                  />
              </div>
            </div>
             
          
            
            
          </div>
        </div>
    </div>
  );
}
