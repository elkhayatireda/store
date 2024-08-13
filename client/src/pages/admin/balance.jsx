import React, { useState, useEffect, useContext } from 'react'
import { authContext } from '../../contexts/AuthWrapper';
import { 
    ArrowDownUp ,
    CalendarDays ,
    Filter ,
    FilterX ,
    Trash2 ,
    Pencil,
    User ,
 } from 'lucide-react';
 import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
  } from "@/components/ui/dialog"
import {
    Avatar ,
    AvatarFallback ,
    AvatarImage ,
  } from "@/components/ui/avatar"
import { axiosClient } from "../../api/axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { addDays, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

export default function Balance() {
    const userContext = useContext(authContext);
    const [data, setData] = useState({
        amount: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [ transactions, setTransactions ] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Ensure that only numeric values are allowed
        if (/^\d*$/.test(value)) {
          setData({ ...data, amount: value });
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (file && allowedTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
            setFile(file);
        } else {
            setSelectedImage(null);
            setFile(null);
            toast.error('Please select a valid PNG, JPEG, or JPG file.');
        }
    };
    
      const handleSubmit = async () => {
        if (!file) {
          toast.error('Please select a file before uploading.');
          return;
        }
    
        const formData = new FormData();
        formData.append('image', file);
        formData.append('amount', data.amount);
       
        
        try {
            setLoading(true);
            console.log(formData)
          const response = await axiosClient.post('/balance/charge', formData ,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          toast.success('success');
          setSelectedImage(null);
          setFile(null);
          setData({amount:0});
          document.getElementById("btnClose").click();
          setLoading(false);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('something went wrong.');
        }
      };
      async function getTransaction() {
        try {
            const  response = await axiosClient.get('/balance/get');
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            toast.error("Failed to fetch transactions. Please try again later.");
        }
    }
    useEffect(() => {
        getTransaction()
    }, []);
  return (
	<div className="flex flex-col py-24 pl-24 p-3 pr-5">
      <div className="w-full ">
            <div className='flex items-center justify-between my-16 mt-5 '>
                <div className="flex items-end gap-6">
                    <p className='text-4xl font-semibold text-[#000]'>My Transactions </p>
                </div>
                
                <Dialog >
                    <DialogTrigger asChild>
                        <button className='bg-[#5F2874] text-white font-medium text-lg rounded py-2 px-4'>Add Balance </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md ">
                        <DialogHeader>
                        <DialogTitle>Are You sure ? </DialogTitle>
                        <DialogDescription>
                        <Sheet>
                            <SheetTrigger >
                                click to get payments info
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    effectue the payment then send prove as screen shot 
                                </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                retyrtytrytryrt
                                </div>
                                <SheetFooter>
                                {/* <SheetClose asChild>
                                    <button type="submit" className='rounded border-[2px] border-black py-1 px-5'>close</button>
                                </SheetClose> */}
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        </DialogDescription>
                        </DialogHeader>
                        <div className=' mb-3'>
                            <label htmlFor="amount" className='block text-[#6d6c6c] text-md mb-1'>Amount</label>
                            <input 
                                type="text" 
                                id="amount" 
                                placeholder='type the amount' 
                                className='py-2 pl-5  outline-none border-2 border-gray-300 rounded-xl w-full'
                                onChange={handleAmountChange}
                                value={data.amount}
                            />
                        </div>
                        <div className=' mb-3'>
                        
                             <label htmlFor="image" className='relative w-full h-48 rounded-xl border-gray-300 border-[2px] flex items-center justify-center cursor-pointer'>
                                <Pencil color='#a09e9e' size={20} />
                                {/* Drag area for uploading */}
                                <input type="file" className='hidden' id="image" accept=".png,.jpg,.jpeg" onChange={handleFileUpload} />
                                {selectedImage ? (
                                <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden"
                                >
                                    <img src={selectedImage} alt="Selected" className=' rounded-full w-full' />
                                </div>
                                ) : ''}
                            </label>
                        </div>
                        <DialogFooter className="sm:justify-start">
                        
                            <div className="flex items-center justify-between w-full gap-24">
                                <DialogClose asChild>
                                    <button className="basis-1/2 border-black border-2 bg-white  rounded py-2" id='btnClose'>
                                            Close
                                    </button> 
                                </DialogClose>
                                <button className="basis-1/2 border-black border-2 bg-black text-white  rounded py-2" onClick={handleSubmit}>
                                        Submit
                                        { loading
                                            && 
                                            <div className="inline-block h-5 w-5 ml-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
                                            role="status"></div>
                                        }
                                </button> 
                            </div>
                        
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        
            <div className="overflow-x-auto  sm:rounded-lg">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden ">
                        <table className="min-w-full divide-y divide-gray-200  ">
                            <thead className="">
                                <tr>
                                    <th className="p-4">
                                        <div className="flex items-center">
                                            <input 
                                                id="checkbox-all" 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                                            />
                                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 text-sm font-small  text-gray-700">
                                    <div className='flex items-center cursor-pointer' > 
                                            <p className='mr-2  '>amount</p> 
                                            
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 text-sm font-small  text-left text-gray-700">
                                        <div className='flex items-center cursor-pointer' > 
                                            <p className='mr-2  '>status</p> 
                                            
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 text-sm font-small  text-left text-gray-700">
                                        <div className='flex items-center cursor-pointer' > 
                                            <p className='mr-2  '>date</p> 
                                            <ArrowDownUp  size={18} color='#000000' />
                                        </div>
                                    </th>
                                    
                                </tr>
                            </thead>
                            <tbody className="bg-white   dark:bg-gray-800 dark:divide-gray-700">
                            {  transactions.map((elem)=>(
  <tr className="hover:bg-[#f7f6f6] " key={elem._id}>
  <td className="p-3 w-4">
      <div className="flex items-center">
          <input
                  id="checkbox-table-1" 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                  
          />
          <label htmlFor="checkbox-table-1" className="sr-only"></label>
      </div>
  </td>
 
  <td className="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap ">{elem.amount}</td>
  
  <td className="py-3 px-6 text-sm font-medium  whitespace-nowrap  ">
        <span className='bg-red-200 rounded text-red-700 py-1 px-3'>{elem.status}</span>
      </td>
  <td className="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap ">{elem.createdAt}</td>
  
  {/* <Dialog open={openD} onOpenChange={()=>{setOpenD(false)}}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
              <DialogTitle>Are You sure ? </DialogTitle>
              <DialogDescription>
                  Are you sure , you wanna delete this user 
              </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                  <div className='flex gap-4 w-full'>
                  <button className="basis-1/2 border-black border-2 bg-white  rounded py-2">
                              Close
                      </button> 
                      <button onClick={()=>{handleDelete([userDelete])}} className="basis-1/2 text-white bg-black rounded py-2 px-5 w-full">
                              Confirm 
                              { loading
                                  && 
                                  <div className="inline-block h-5 w-5 ml-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
                                  role="status"></div>
                              }
                          </button>
                  </div>
              </DialogClose>
              </DialogFooter>
          </DialogContent>
      </Dialog> */}
</tr>
                            ))
                              }
                        
                        
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>

      </div>
    </div>
  )
}

