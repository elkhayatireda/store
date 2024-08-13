import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios'; 
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateClient() {
  const [client, setClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [sheet, setSheet] = useState({
    sheetUrl: '',
    sheetId: '',
    employeeId: '',
  });
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Extracts the id from the URL

  useEffect(() => {
    // Fetch client data by ID
    const fetchClient = async () => {
      try {
        const response = await axiosClient.get(`/client/${id}`);
        const client2 = response.data.client;
        const sheet2 = response.data.sheet;
       
        setSheet({
          sheetUrl: sheet2.sheetUrl,
          sheetId: sheet2.sheetId,
          employeeId: sheet2.Employee_id,
        });
        setClient({
          firstName: client2.firstName,
          lastName: client2.lastName,
          email: client2.email,
          phone: client2.phone,
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch client data');
      }
    };

    // Fetch employees for select dropdown
    const fetchEmployees = async () => {
      try {
        const response = await axiosClient.get('/employee');
        setEmployees(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch employees');
      }
    };

    fetchClient();
    fetchEmployees();
  }, [id]);

  const handleClientChange = (e) => {
    const { id, value } = e.target;
    setClient({
      ...client,
      [id]: value
    });
  };
  const handleSheetChange = (e) => {
    const { id, value } = e.target;
    setSheet({
      ...sheet,
      [id]: value
    });
  };

  const handleUpdateClient = async () => {
    try {
      const { firstName, lastName, email, phone  } = client;
      const { sheetUrl, sheetId, employeeId } = sheet;
      if (!firstName || !email || !phone || !sheetUrl || !sheetId || !employeeId) {
        toast.error('All fields are required');
        return;
      }
      await axiosClient.put(`/client/${id}`, {client,sheet});
      toast.success('Client updated successfully');
      // navigate('/admin/clients');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update client');
    }
  };
  
  return (
    <div className='flex flex-col pt-28 pl-24 p-3 pr-5 px-10 pb-24'>
      <div className="w-full flex items-center justify-between mb-24">
        <h4 className='text-4xl font-bold text-[#141414]'>Update Client</h4>
        <button 
          onClick={handleUpdateClient}
          className='py-2 px-5 rounded-lg bg-[#356fc6] text-white'
        >
          Update Client
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
                value={client.firstName}
                onChange={handleClientChange}
              />
            </div>
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="lastName" className='block text-[#6d6c6c] text-md mb-1'>Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder='Last Name' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={client.lastName}
                onChange={handleClientChange}
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
                value={client.email}
                onChange={handleClientChange}
              />
            </div>
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="phone" className='block text-[#6d6c6c] text-md mb-1'>Phone</label>
              <input 
                type="text" 
                id="phone" 
                placeholder='Phone' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={client.phone}
                onChange={handleClientChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-10">
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="sheetUrl" className='block text-[#6d6c6c] text-md mb-1'>Sheet URL</label>
              <input 
                type="text" 
                id="sheetUrl" 
                placeholder='Sheet URL' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={sheet.sheetUrl}
                onChange={handleSheetChange}
              />
            </div>
            <div className='w-full mb-3 lg:mb-0 lg:mr-6'>
              <label htmlFor="sheetId" className='block text-[#6d6c6c] text-md mb-1'>Sheet ID</label>
              <input 
                type="text" 
                id="sheetId" 
                placeholder='Sheet ID' 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={sheet.sheetId}
                onChange={handleSheetChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-10">
            <div className='w-full mb-3 lg:mb-0 lg:mr-6 basis-1/2'>
              <label htmlFor="employeeId" className='block text-[#6d6c6c] text-md mb-1'>Assign Employee</label>
              <select 
                id="employeeId" 
                className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded-xl'
                value={sheet.Employee_id}
                onChange={handleSheetChange}
              >
                <option value="" disabled>Select an Employee</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id} >
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
