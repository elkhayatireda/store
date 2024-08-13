import io from 'socket.io-client';
import { authContext } from "@/contexts/AuthWrapper";
import { useContext, useEffect, useState } from "react";
import 
{ 
    Bell ,
    X,
    UserRound ,
 } from 'lucide-react';
 import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { 
    LogOut 
  } from 'lucide-react';
  const socket = io('http://localhost:5555');
  import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { axiosClient } from '../../api/axios'; 



export default function TopNav() {
    const userContext = useContext(authContext);
   
    const logOut = () => {
        userContext.logout();
        navigate("/signin");
    };
  //   const [ notifications , setNotifications ] = useState([]);
  //   const getAllNotifications = async () => {
  //     try {
  //       const response = await axiosClient.get('/notification/admin');
  //       setNotifications(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.log(error)
  //       toast.error('Error getting notifications. Please try again later.');
  //     }
  //   };
    
  //   useEffect(() => {
  //       getAllNotifications();
  //       socket.emit('joinRoom', userContext.user._id); 
  //       socket.on('notification', (notification) => {
  //           setNotifications((prevNotifications) => [...prevNotifications, notification.message]);
  //           toast(notification.message.message);
  //           viewNotification(notification.message);
  //       });
  //       return () => {
  //         socket.off('notification');
  //         socket.emit('leaveRoom', userContext.user._id);
  //       };
  //     }, [userContext.user]);
   
  
  //  const viewNotification =  async (notification) =>{
  //   try {
  //     const response = await axiosClient.post('/notification/read',{notification});
  //     getAllNotifications();
  //     if(notification.link !== null){
  //       navigate(notification.link)
  //     }
  //   } catch (error) {
  //     toast.error('Error reading notifications. Please try again later.');
  //   }
  //  }
  return (
    <header >
    <nav className="fixed top-0 left-0 right-0 z-10 pl-6 pr-7 h-16 flex items-center  justify-end border-b-[1px] border-gray-100 shadow-sm bg-white gap-3">
        {/* <div className="w-12 h-12 cursor-pointer border-[#7065f0] bg-[#7065f0] border-[2px] rounded-full flex items-center justify-center">
          <UserRound  color='#fff' size={22}/>
        </div> */}
        <div className="w-12 h-12 cursor-pointer  rounded-full flex items-center justify-center relative">
          <Bell  color='#000' size={25}/>
          <div className="absolute  border-[2px] border-white top-[9px] right-3 w-3 h-3 rounded-full bg-red-600">
          </div>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="w-12 h-12 cursor-pointer  bg-[#edf3ff]  rounded-full flex items-center justify-center">
                  <UserRound  color='#356CF4' size={22}/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuLabel>{userContext.user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0"> 
                    <div className='w-full h-full bg-[#356CF4] text-white py-2 px-3 flex items-center justify-center gap-2 cursor-pointer' onClick={logOut}>
                        <LogOut color='white' size={18}/>
                        <p>logout</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </nav >
</header>
  )
}
