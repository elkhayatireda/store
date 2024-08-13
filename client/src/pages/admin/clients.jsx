import React, { useState, useEffect } from 'react'
import { 
    ArrowDownUp ,
    CalendarDays ,
    Filter ,
    FilterX ,
    Trash2 ,
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { addDays, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function employees() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchColumn, setSearchColumn] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState();
    // const [order, setDate] = useState();
    const [order, setOrder] = useState(false);
    const [ filterComponents, setFilterComponents] = useState(false);
    const [ selectedRole, setSelectedRole] = useState(null);
    const [ selectedSubs, setSelectedSubs] = useState(null);
    const [openD, setOpenD] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    // fetch all users 
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get('/client/get-all');
            setUsers(response.data);
            setFilteredUsers(response.data);    
        } catch (error) {
            toast.error('Error fetching employees');
        }
    };

    const filterUsersFunction = () => {
        let filtered = users.slice();
        filtered = filtered.filter(user => {
            if (searchColumn === 'username') {
                return (user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            if (searchColumn === 'email') {
                return user.email.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (searchColumn === 'phone') {
                return user.phone.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });
       
        setFilteredUsers(filtered);
    }

    
    const resetFilters = (e) => {
        setFilterComponents(!filterComponents);
        setSelectedRole(null);
        setSearchQuery("");
        setDate(null);
        setSelectedSubs(null)
        setFilteredUsers(users);
    }

    useEffect(() => {
        filterUsersFunction();
    }, [selectedRole, searchColumn, date, searchQuery, selectedSubs ]);

    useEffect(() => { 
        setSearchQuery("");
    }, [searchColumn]);


    const handleSearchColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSelectedUsers([]);
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedUsers([]);
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const checkAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            const allUserIds = filteredUsers.map(user => user._id);
            setSelectedUsers(allUserIds);
        }
    };
   
    const handleRadioInputChange = (e) => {
        const value = e.target.value;
        setSelectedRole(value);
    }
    const handleRadioInputChangeSubs = (e) => {
        const value = e.target.value;
        setSelectedSubs(value);
    }
    const filterUsersByOrder = (str) => {
        setOrder(!order)
        let sortedUsers = [];
       if (str === "joinDate") {
            sortedUsers = filteredUsers.slice().sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                if (!order) {
                    return dateB - dateA; 
                } else {
                    return dateA - dateB; 
                }
            });
        
        }
        setFilteredUsers(sortedUsers);
    };
    const [userDelete , setUserDelete] = useState(null)
    const [open, setOpen] = useState(false)
    const deleteUserHandle = async (clientIds) => {
        try {
            const response = await axiosClient.delete(`/client`, {
                data: { clientIds } 
            });
             return true;
        } catch (error) {
            toast.error(error)
        }
    };
    const handleDelete = async (users) => { 
        const isDeleted = await deleteUserHandle(users); 
        if (isDeleted) {
            toast.success("client is deleted");
            fetchUsers(); 
        } else {
            toast.error('Error deleting client');
        }
    };
    const handleOpen = async (id) => {
        try {
            navigate(`/admin/clients/update/${id}`);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  return (
	<div className="flex flex-col pt-16 pl-24 p-3 pr-5">
    <ToastContainer />
    <div className="flex w-full items-center justify-between pt-5">
        <h4 className='text-4xl font-semibold text-[#141414]'>Our Client</h4>
        <button 
            className='py-2 px-5 rounded-lg bg-[#356fc6] text-white text-lg '
          >
            <Link to="/admin/clients/add">new client</Link>
        </button>
        
    </div>
    <div className={`pt-16 flex items-end pr-3 mb-3 justify-start `}>
    <div className='flex items-center justify-between w-full'>
        <div className='flex'>
            <div className='w-62 mr-2'>
                <select
                    id="searchColumn"
                    className="border-2 border-gray-300  py-3 text-gray-900 text-sm rounded-lg outline-none  block w-full p-2.5"
                    value={searchColumn}
                    onChange={handleSearchColumnChange}
                >
                    <option value="default" className='py-2 px-5'>filter By</option>
                    <option value="username" >Full Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                </select>
            </div>
            <div className='w-62 mr-2'>
                <input
                    type="text"
                    className='w-full py-2 rounded outline-none border-2 border-gray-300 text-md pl-5 bg-white'
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    disabled={searchColumn == "default"}
                />
            </div>
        </div>
            {  selectedUsers.length !== 0
            && 
            <div className='flex items-center justify-start mb-1 ml-3 mt-2'>
                <button className='cursor-pointer flex gap-3 items-center bg-red-50 rounded py-2 px-5 text-red-600 font-semibold' onClick={()=>setOpen(true)}>
                    delete
                    <Trash2 color='#ff2f2f' size={20}/>
                </button>
                <Dialog open={open} onOpenChange={()=>{setOpen(false)}}>
                            <DialogContent className="sm:max-w-md bg-white">
                                <DialogHeader>
                                <DialogTitle>Are You sure ? </DialogTitle>
                                <DialogDescription>
                                    Are you sure , you wanna delete those users 
                                </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <div className='flex gap-4 w-full'>
                                    <button className="basis-1/2 border-black border-2 bg-white  rounded py-2">
                                                Close
                                        </button> 
                                        <button onClick={()=>{handleDelete(selectedUsers)}} className="basis-1/2 text-white bg-black rounded py-2 px-5 w-full">
                                                Confirm 
                                                { loading
                                                    && 
                                                    <div className="inline-block h-5 w-5 ml-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                                    role="status"></div>
                                                }
                                            </button>
                                    </div>
                                </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                </Dialog>
            </div>
        }
        </div>
       
       
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
                                        checked={selectedUsers.length === filteredUsers.length && selectedUsers.length >= 1}
                                        onChange={checkAll} 
                                    />
                                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th className="py-3  text-sm font-small  text-gray-700 text-start pl-5 ">
                                    <p className='mr-2  '>Full Name</p> 
                            </th>
                            <th className="py-3 px-6 text-sm font-small  text-left text-gray-700">
                                    <p className='mr-2  '>Email</p> 
                            </th>
                            <th className="py-3 px-6 text-sm font-small  text-left text-gray-700">
                                <div className='flex items-center cursor-pointer' > 
                                    <p className='mr-2 ' >phone</p> 
                                </div>
                            </th>
                            <th className="py-3 px-6 text-sm font-small  text-left text-gray-700">
                                <div className='flex items-center cursor-pointer' onClick={()=>filterUsersByOrder("joinDate")}> 
                                    <p className='mr-2  '>join at</p> 
                                    <ArrowDownUp  size={18} color='#000000' />
                                </div>
                            </th>
                            <th className="p-4">
                                <div className='flex items-center cursor-pointer' > 
                                    <p className='' >action</p> 
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white   dark:bg-gray-800 dark:divide-gray-700">
                        {filteredUsers.map(user => (
                       <tr className="hover:bg-[#f7f6f6] " key={user._id} >
                       <td className="p-3 w-4">
                           <div className="flex items-center">
                               <input
                                    id="checkbox-table-1" 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                                    checked={selectedUsers.includes(user._id)} 
                                    onChange={() => handleCheckboxChange(user._id)} 
                               />
                               <label htmlFor="checkbox-table-1" className="sr-only"></label>
                           </div>
                       </td>
                       <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center justify-start gap-2" onClick={()=>handleOpen(user._id)}>
                            <Avatar className="w-10 h-10 cursor-pointer">
                                <AvatarImage src={user.image?.url} alt="@shadcn"  />
                                <AvatarFallback className="bg-[#e0eb4c]">{user.firstName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p>{user.fullName}</p>
                       </td>
                       <td className="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white" onClick={()=>handleOpen(user._id)}>{user.email}</td>
                       <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={()=>handleOpen(user._id)}>
                                {user.phone}
                        </td>
                       <td className="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white" onClick={()=>handleOpen(user._id)}>{user.createdAt}</td>
                       <td className="py-3 px-6 text-sm font-medium text-center whitespace-nowrap cursor-pointer " onClick={()=>{setOpenD(true);setUserDelete(user._id);}}>
                           <Trash2 color='red' size={20}/>
                       </td>
                       <Dialog open={openD} onOpenChange={()=>{setOpenD(false)}}>
                            <DialogContent className="sm:max-w-md bg-white">
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
                                                    <div className="inline-block h-5 w-5 ml-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                                    role="status"></div>
                                                }
                                            </button>
                                    </div>
                                </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                   </tr>
                   
                    ))}
                    </tbody>
                </table>
                {
                    filteredUsers.length === 0 && 
                    <div className="flex items-center justify-center w-full min-h-80 ">
                         <div className='flex items-end justify-center'>
                            <User size={50}  fontWeight={2} color='#414141'/> <p className='text-3xl ml-3 font-semibold text-[#414141] '>no employee found</p>
                         </div>
                    </div>
                }
            </div>
        </div>
    </div>
</div>
  )
}