import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios'; // Assuming you're using axios for API requests
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function AddClient() {
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    cpassword: '',
  });
  const navigate = useNavigate()



  const handleEmployeeChange = (e) => {
    const { id, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [id]: value
    });
  };

  const handleAddEmployee = async () => {
    try {
      const {  firstName, email, phone, password, cpassword } = newEmployee;
      if ( !firstName || !email || !phone || !password || !cpassword) {
        toast.error('All fields are required');
        return;
      }
      if (password !== cpassword) {
        toast.error('password do not match');
        return;
      }
      const response = await axiosClient.post('/employee', newEmployee);
      toast.success('Employee added successfully');
      setNewEmployee({
        fullName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        cpassword: '',
      });
      navigate("/admin/employees")
    } catch (error) {
      console.error(error);
      toast.error('Failed to add employee');
    }
  };

  return (
    <div className='flex flex-col pt-28 pl-24 p-3 pr-5 px-10 pb-24'>
      <div className="w-full flex items-center justify-between mb-24">
        <h4 className='text-4xl font-bold text-[#141414]'>Add Employee</h4>
        <button 
          onClick={handleAddEmployee}
          className='py-2 px-5 rounded-lg bg-[#356fc6] text-white'
        >
          Add Employee
        </button>
      </div>
      <div>
        <div className='flex flex-col'>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="firstName" className='block text-[#6d6c6c] text-md mb-1'>First Name</label>
              <input 
                type="text" 
                id="firstName" 
                placeholder='First Name' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={newEmployee.firstName}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="lastName" className='block text-[#6d6c6c] text-md mb-1'>Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder='Last Name' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={newEmployee.lastName}
                onChange={handleEmployeeChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-10">
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="email" className='block text-[#6d6c6c] text-md mb-1'>Email</label>
              <input 
                type="text" 
                id="email" 
                placeholder='Email' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={newEmployee.email}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="phone" className='block text-[#6d6c6c] text-md mb-1'>Phone</label>
              <input 
                type="text" 
                id="phone" 
                placeholder='Phone' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={newEmployee.phone}
                onChange={handleEmployeeChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-10">
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="password" className='block text-[#6d6c6c] text-md mb-1'>Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder='Password' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={newEmployee.password}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="cpassword" className='block text-[#6d6c6c] text-md mb-1'>confirm password</label>
              <input 
                type="password" 
                id="cpassword" 
                placeholder='confirm password' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={newEmployee.cpassword}
                onChange={handleEmployeeChange}
              />
            </div>
          </div>
        </div>
      </div>

       
    </div>
  );
}
