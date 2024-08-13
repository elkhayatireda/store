import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios'; // Assuming you're using axios for API requests
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function AddClient() {
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    sheetLink: '',
    sheetId: '',
    employeeId: '',
  });
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target;
    setClientData({
      ...clientData,
      [id]: value
    });
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosClient.get('/employee');
        setEmployees(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, []);

  
  const handleAddClient = async () => {
    try {
        const { firstName, phone, sheetLink, sheetId, employeeId } = clientData;
        if (!firstName || !phone || !sheetLink || !sheetId || !employeeId) {
            toast.error('All fields are required');
            return;
        }
        console.log(employeeId);
      const response = await axiosClient.post('/client/create', clientData);
      console.log(response.data);
      toast.success('Client added successfully');
      setClientData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        sheetLink: '',
        sheetId: '',
        employeeId: '',
      });
      navigate("/admin/clients")
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='flex flex-col pt-28 pl-24 p-3 pr-5 px-10 pb-24'>
        <div className="w-full flex items-center justify-between mb-24">
          <h4 className='text-4xl font-bold text-[#141414]'>Add Client</h4>
          <button 
            onClick={handleAddClient}
            className='py-2 px-5 rounded-lg bg-[#356fc6] text-white'
          >
            Add Client
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
                      value={clientData.firstName}
                      onChange={handleChange}
                  />
              </div>
              <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  <label htmlFor="lastName" className='block text-[#6d6c6c] text-md mb-1'>Last Name</label>
                  <input 
                      type="text" 
                      id="lastName" 
                      placeholder='Last Name' 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={clientData.lastName}
                      onChange={handleChange}
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
                      value={clientData.email}
                      onChange={handleChange}
                  />
              </div>
              <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  <label htmlFor="phone" className='block text-[#6d6c6c] text-md mb-1'>Phone</label>
                  <input 
                      type="text" 
                      id="phone" 
                      placeholder='Phone' 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={clientData.phone}
                      onChange={handleChange}
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
                      value={clientData.password}
                      onChange={handleChange}
                  />
              </div>
              <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  <label htmlFor="sheetLink" className='block text-[#6d6c6c] text-md mb-1'>Sheet Link</label>
                  <input 
                      type="text" 
                      id="sheetLink" 
                      placeholder='Sheet Link' 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={clientData.sheetLink}
                      onChange={handleChange}
                  />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-10">
              <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  <label htmlFor="sheetId" className='block text-[#6d6c6c] text-md mb-1'>Sheet ID</label>
                  <input 
                      type="text" 
                      id="sheetId" 
                      placeholder='Sheet ID' 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={clientData.sheetId}
                      onChange={handleChange}
                  />
              </div>
              <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
                  <label htmlFor="employeeId" className='block text-[#6d6c6c] text-md mb-1'>Choose Employee</label>
                  <select 
                      id="employeeId" 
                      className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                      value={clientData.employeeId}
                      onChange={handleChange}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.fullName}
                      </option>
                    ))}
                  </select>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}