import React, { useState, useContext } from 'react';
import { axiosClient } from '../../api/axios'; // Assuming you're using axios for API requests
import { toast } from 'react-toastify';
import { authContext } from '../../contexts/AuthWrapper';
import Sheet from "./sheet"
export default function Settings() {
  const userContext = useContext(authContext);

 

  return (
    <div className='flex flex-col w-full '>
      <div className="flex items-center justify-between py-3 mb-8">
        <h4 className="text-lg font-semibold">Settings</h4>
      </div>
      <div className='relative w-full bg-green-400 z-40'>
        <div className="absolute top-0 bottom-0 left-0 bg-red-200 w-[200px] flex flex-col ">
          <div className='p-3 border-[1px]  border-gray-200 flex items-center justify-center cursor-pointer'>link sheet</div>
          <div className='p-3 border-[1px] border-gray-200 flex items-center justify-center cursor-pointer'>clocking</div>

        </div>
      </div>
      <div className="ml-[210px] border-1 border-gray-200">
          <Sheet />
      </div>
    </div>
  );
}
