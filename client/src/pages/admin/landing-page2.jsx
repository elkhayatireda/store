import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  Clapperboard, CodeXml, Play, Instagram, Headset  ,CircleCheckBig , ChevronUp, ChevronDown, Facebook , Youtube ,MessageSquareText, Plus } from 'lucide-react';
import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { motion, useMotionValue } from "framer-motion";
import { Link as ScrollLink } from 'react-scroll';
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

function LandingPage() {
    const [visibleAnswer, setVisibleAnswer] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const toggleAnswer = (index) => {
        setVisibleAnswer(visibleAnswer === index ? null : index);
    };

    const faqData = [
        { question: 'What is your return policy?', answer: 'Our return policy allows returns within 30 days of purchase.' },
        { question: 'How can I track my order?', answer: 'You can track your order through the tracking link sent to your email.' },
        { question: 'What is your return policy?', answer: 'Our return policy allows returns within 30 days of purchase.' },
        { question: 'How can I track my order?', answer: 'You can track your order through the tracking link sent to your email.' },
        // Add more FAQs as needed
    ];

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null); 

    const handleThumbnailClick = () => {
        setIsPlaying(true);
        if (videoRef.current) {
        videoRef.current.play();
        }
    };

    const dataOptions = {
        videoUGC: [
          '/assets/UGC1.gif',
          '/assets/UGC1.gif',
          '/assets/UGC1.gif',
          '/assets/UGC1.gif',
          '/assets/UGC1.gif',
          '/assets/UGC1.gif',
        ],
        landingPages: [
          '/assets/landing1.png',
          '/assets/landing2.png',
          '/assets/landing3.png',
          '/assets/landing1.png',
          '/assets/landing2.png',
          '/assets/landing3.png',
        ],
        productShooting: [
          '/assets/france.png',
          '/assets/france.png',
          '/assets/france.png',
          '/assets/france.png',
          '/assets/france.png',
          '/assets/france.png',
          '/assets/product2.jpg',
          '/assets/product3.jpg',
        ],
      };
    
      
      const [data, setData] = useState(dataOptions.videoUGC);
      const [selectedCategory, setSelectedCategory] = useState('videoUGC');
    
      
      const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setData(dataOptions[category]);
      };
    
      const [imgIndex, setImgIndex] = useState(0);
      const [dragX, setDragX] = useState(0);
    
      const SPRING_OPTIONS = {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      };
    
      const handleDragEnd = (event, info) => {
        const dragDistance = info.offset.x;
    
        if (dragDistance > 100 && imgIndex > 0) {
          setImgIndex(imgIndex - 1);
        } else if (dragDistance < -100 && imgIndex < data.length - 1) {
          setImgIndex(imgIndex + 1);
        }
      };
      

    
           const [isScrolled, setIsScrolled] = useState(false);

           const handleScroll = () => {
            if (window.scrollY > 300) {
                     setIsScrolled(true);
                 } else {
                     setIsScrolled(false);
                 }
           };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async () => {

    const { firstName, lastName, phoneNumber } = formData;

    if (!firstName ) {
      setError('firstName is required');
      return;
    }
    if (!lastName) {
      setError('lastName is required');
      return;
    }
    if ( !phoneNumber) {
      setError('phoneNumber is required');
      return;
    }

    setError('');
    console.log(formData)
    try {
        const response = await axios.post('http://localhost:5555/contact', formData);
        if (response.status === 200) {
          console.log('Form submitted successfully');
          setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: ''
          });
        } else {
          console.error('Server error');
        }
      } catch (error) {
        console.error('Network error', error);
        setError('There was an error submitting the form');
      }
  };

     
  
    return (
        <div className='w-full' >
                        <div className={`${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} bg-[#ff7400] transition-all duration-800 fixed top-0 right-0 left-0 z-50`}>

             
                <div className="flex items-center justify-between py-10 h-16 gap-10 max-w-[1300px] mx-auto">
                    <div className="h-12">
                     <img src={'/assets/logo2.png'} alt="logo" className="h-full" />
                    </div>
                    <ul className="flex items-center">
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="home" smooth={true} duration={500}>home</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                        <ScrollLink to="about" smooth={true} duration={500}>about</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="services" smooth={true} duration={500}>services</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="projects" smooth={true} duration={500}>FAQs</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="contact" smooth={true} duration={500}>contact us</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold  cursor-pointer">
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild >
                                    <img src={'/assets/uk.png'} alt="logo" className="h-8 w-8 rounded-full cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 bg-white p-0">
                                    <DropdownMenuItem className="p-0" >
                                    <div className='w-full h-full rounded hover:bg-slate-200 py-2 px-3 text-md cursor-pointer flex items-center gap-3'>
                                    <img src={'/assets/uk.png'} alt="logo" className="h-7 w-7 rounded-full" />
                                        <p className='text-md font-medium'>english</p>
                                    </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-0" >
                                    <div className='w-full h-full rounded hover:bg-slate-200 py-2 px-3 text-md cursor-pointer flex items-center gap-3'>
                                    <img src={'/assets/morocco.png'} alt="logo" className="h-7 w-7 rounded-full" />
                                        <p className='text-md font-medium'>arabic</p>
                                    </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li className="mr-8 text-lg text-gray-500 cursor-pointer">
                            <ScrollLink to="contact" smooth={true} duration={500}>
                                <button className='bg-[#6aca8e] text-white text-md py-3 px-7 font-medium w-fit rounded-xl'>Contact Us</button>
                            </ScrollLink>
                        </li>
                    </ul>
                </div>
               
                {/* <div className="basis-1/2 flex items-center justify-end gap-3">
                    
                    <button className='border-[#5F2874] border-[2px] text-[#5F2874] text-md   py-3 px-12 text-md font-bold w-fit rounded'>Login</button>
                    
             
                </div> */}
                {/* scroll up component */}
                {/* <div 
               className={`fixed bottom-5 right-5 w-14 h-14 bg-[#356CF4] rounded-full flex items-center justify-center cursor-pointer`} 
                >
                 <ChevronUp  color='#fff' size={40}/>
                </div> */}
                </div>
             <div className={` bg-[#183b94] duration-300 marker:w-full z-40`}>
                <div className="flex items-center justify-between py-10 h-16 gap-10 max-w-[1300px] mx-auto">
                    <div className="h-12">
                     <img src={'/assets/logo2.png'} alt="logo" className="h-full" />
                    </div>
                    <ul className="flex items-center">
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="home" smooth={true} duration={500}>home</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                        <ScrollLink to="about" smooth={true} duration={500}>about</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="services" smooth={true} duration={500}>services</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="projects" smooth={true} duration={500}>FAQs</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold hover:text-[#6aca8e] cursor-pointer">
                            <ScrollLink to="contact" smooth={true} duration={500}>contact us</ScrollLink>
                        </li>
                        <li className="mr-8 text-lg text-white font-semibold  cursor-pointer">
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild >
                                    <img src={'/assets/uk.png'} alt="logo" className="h-8 w-8 rounded-full cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 bg-white p-0">
                                    <DropdownMenuItem className="p-0" >
                                    <div className='w-full h-full rounded hover:bg-slate-200 py-2 px-3 text-md cursor-pointer flex items-center gap-3'>
                                    <img src={'/assets/uk.png'} alt="logo" className="h-7 w-7 rounded-full" />
                                        <p className='text-md font-medium'>english</p>
                                    </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-0" >
                                    <div className='w-full h-full rounded hover:bg-slate-200 py-2 px-3 text-md cursor-pointer flex items-center gap-3'>
                                    <img src={'/assets/morocco.png'} alt="logo" className="h-7 w-7 rounded-full" />
                                        <p className='text-md font-medium'>arabic</p>
                                    </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li className="mr-8 text-lg text-gray-500 cursor-pointer">
                            <ScrollLink to="contact" smooth={true} duration={500}>
                                <button className='bg-[#ff7400] text-white text-md py-3 px-7 font-medium w-fit rounded-xl'>Contact Us</button>
                            </ScrollLink>
                        </li>
                    </ul>
                </div>
                </div>
                {/* <div className="w-full pt-24 bg-[# 6200b3]" > */}
                <div className="w-full pt-24 bg-[#183b94]" >
                    <div className="flex items-center justify-between  gap-10 max-w-[1300px] mx-auto pt-24 ">
                      <div className='basis-1/2 flex flex-col '>
                        <h1 className='text-5xl font-extrabold text-[#fff] mb-5'>Premiere agence de confirmation au <span className="text-[#183b94]">marche</span></h1>
                        <p className='text-white text-lg mb-5 pr-16'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                        </p>
                        <button className='bg-[#ff7400] text-[#fff] text-lg py-3 px-8 font-bold w-fit rounded-xl'>Contact Us</button>
                      </div>
                      
                    </div>
                </div>
                <div className="w-full ">
                    <img src={'/assets/wave.svg'} alt="logo" className="w-full" />
                </div>
                <div className="w-full mt-10 ">
                    <div className="flex items-center justify-between  gap-10 max-w-[1300px] mx-auto py-24">
                      <div className='basis-1/2 flex items-center justify-center'>
                        <img src={'/assets/uk.png'} alt="logo" className="h-full" />
                      </div>
                      <div className='basis-1/2 flex flex-col '>
                        <p className="text-sm font-extrabold text-[#ff7400] mb-1">Who We Are</p>
                        <h4 className='text-6xl font-bold text-[#212427] mb-5'>Top agency in the world</h4>
                        <p className='text-gray-600 text-md mb-5'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                        </p>
                        <button className='bg-[#183b94] text-[#fff] text-lg py-3 px-8 font-bold w-fit rounded-xl'>Contact Us</button>
                      </div>
                    </div> 
                </div>
                {/* <div className="w-full bg-[#edf3ff] pb-20"> */}
                <div className="w-full bg-[#fff] pb-20">
                    <div className="max-w-[1300px] mx-auto py-24 ">
                        <p className="text-sm font-extrabold text-[#ff7400]">What We Do</p>
                        <div className="flex items-start justify-between gap-16">
                                <h4 className="text-4xl font-extrabold text-[#183b94] basis-2/5">
                                Grow ur your ecommerce order confirmation
                                </h4>
                            <p className='text-gray-600 text-md basis-2/5'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                                </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full mt-10">
                            <div className='group py-4 px-2 pl-8 rounded-2xl   bg-[#fff]  cursor-pointer flex flex-col hover:scale-105 '>
                                <div className='w-14 h-14 rounded-full flex items-center justify-center bg-[#ff7400] mb-4 '>
                                    <Headset   color='#fff' size={28} className=''/> 
                                </div>
                                <div className="flex flex-col basis-2/3 ">
                                    <h3 className='text-xl font-bold mb-3 text-[#414141] '>Video Ads</h3>
                                    <p className="text-md text-gray-600 ">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                            <div className='group py-8 px-2 pl-8 rounded-2xl   bg-[#fff]  cursor-pointer flex flex-col hover:scale-105 '>
                            <div className='w-14 h-14 rounded-full flex items-center justify-center bg-[#ff7400] mb-4 '>
                                    <Headset   color='#fff' size={28} className=''/> 
                                </div>
                                <div className="flex flex-col basis-2/3 ">
                                    <h3 className='text-xl font-bold mb-3 text-[#414141] '>Video Ads</h3>
                                    <p className="text-md text-gray-600 ">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                            <div className='group py-8 px-2 pl-8 rounded-2xl   bg-[#fff]  cursor-pointer flex flex-col hover:scale-105'>
                                <div className='w-14 h-14 rounded-full flex items-center justify-center bg-[#ff7400] mb-4 '>
                                    <Headset   color='#fff' size={28} className=''/> 
                                </div>
                                <div className="flex flex-col basis-2/3 ">
                                    <h3 className='text-xl font-bold mb-3 text-[#414141] '>Video Ads</h3>
                                    <p className="text-md text-gray-600 ">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="w-full bg-[#fe7300]">
                    <div className="flex items-center justify-between gap-10 max-w-[1300px] mx-auto ">
                        <div className='basis-1/2 flex flex-col '>
                            <h1 className='text-[55px] font-bold text-[#fff] mb-6 leading-[3.5rem]'>Premiere agence de confirmation</h1>
                            <p className='text-white text-[14px] mb-3 pr-16'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                            </p>
                            <button className='bg-[#183b94] text-[#fff] text-lg py-3 px-8 font-bold w-fit rounded-xl'>Contact Us</button>
                        </div>
                        <div className='basis-1/2 flex relative h-[400px]'>
                            <img src={'/assets/img1.png'} alt="logo" className="h-[500px] absolute bottom-0 right-0" />
                        </div>
                    </div>
                </div>
                <div 
                    className="w-full" 
                    style={{ backgroundImage: "url('/assets/ttten.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="flex items-center justify-between  gap-10 max-w-[1300px] mx-auto py-24">
                      <div className='basis-1/2 flex items-center justify-center'>
                        <img src={'/assets/uk.png'} alt="logo" className="h-full" />
                      </div>
                      <div className='basis-1/2 flex flex-col '>
                        <p className="text-md font-bold text-[#6aca8e] mb-1">FEATURES</p>
                        <h4 className='text-6xl font-bold text-[#212427] mb-8'>Why us?</h4>
                        <div className="flex flex-col gap-5 w-[500px] ">
                            {/* <div className="flex flex-col bg-[#fff] p-5 rounded-lg">
                                <div className='flex items-center justify-start gap-5 '>
                                    <div className="rounded-full w-14 h-14 flex items-center justify-center bg-[#f6f5f8]">
                                        <Headset   color='#183b94' size={30} className=''/> 
                                    </div>
                                    <h5 className="text-2xl font-semibold">Fast confirmation11</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-600 ml-20">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <div className='flex items-center justify-start gap-5'>
                                    <div className="rounded-full w-14 h-14 flex items-center justify-center bg-[#f7c4a76c]">
                                        <Headset   color='#f3772e' size={30} className=''/> 
                                    </div>
                                    <h5 className="text-2xl font-semibold">Fast confirmation</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-600 ml-20">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <div className='flex items-center justify-start gap-5'>
                                    <div className="rounded-full w-14 h-14 flex items-center justify-center bg-[#a1e2bc7a]">
                                        <Headset   color='#31e97e' size={30} className=''/> 
                                    </div>
                                    <h5 className="text-2xl font-semibold">Fast confirmation</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-600 ml-20">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div> */}


                             <div className="flex flex-col bg-[#f7c4a76c] p-4 rounded-2xl">
                                <div className='flex items-center justify-start gap-4'>
                                    <CircleCheckBig    color='gray' size={25} className=''/> 
                                    <h5 className="text-xl font-medium text-[#414141]">Fast confirmation</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-600 ml-10">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                             <div className="flex flex-col bg-[#f6f5f8] p-4 rounded-2xl">
                                <div className='flex items-center justify-start gap-4'>
                                    <CircleCheckBig    color='gray' size={25} className=''/> 
                                    <h5 className="text-xl font-medium text-[#414141]">Fast confirmation</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-600 ml-10">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>
                             <div className="flex flex-col bg-[#6eeba27a] p-4 rounded-2xl">
                                <div className='flex items-center justify-start gap-4'>
                                    <CircleCheckBig    color='#023a19f6' size={25} className=''/> 
                                    <h5 className="text-xl font-medium text-[#023a19f6]">Fast confirmation</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-600 ml-10">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div>


                            {/* <div className="flex flex-col bg-[#6aca8e] p-4 rounded-2xl">
                                <div className='flex items-center justify-start gap-4'>
                                    <CircleCheckBig    color='white' size={25} className=''/> 
                                    <h5 className="text-xl font-medium text-[#fff]">Fast confirmation</h5>
                                </div>
                                <div className='flex items-center justify-start '>
                                    <p className="text-md font-medium text-gray-100 ml-10">we can create standing UGC video for your E-commerce brand</p>
                                </div>
                            </div> */}
                        </div>
                      </div>
                    </div>
                </div>
                <div className="w-full py-36 bg-[#edf3ff]">
                    <div className="flex items-start justify-between gap-10 max-w-[1300px] mx-auto">
                        <div className='basis-2/5 flex flex-col'>
                            <p className="text-md font-bold text-[#356FC6] mb-1">STEPS</p>
                            <h1 className='text-[45px] font-bold text-[#414141] mb-4 leading-[3.5rem]'>How It Works</h1>
                            <p className='text-[#808080] text-[14px] mb-4 pr-16'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores tempore expedita exercitationem debitis
                            </p>
                            <button className='bg-[#183b94] text-[#fff] text-lg py-3 px-8 font-bold w-fit rounded-xl'>Start Now</button>
                        </div>
                        <div className='basis-3/5 grid grid-cols-2 gap-10'>
                            <div className="border-[2px] border-gray-100 px-6 py-8 flex flex-col rounded-2xl bg-[#fff] cursor-pointer hover:-translate-y-2 ">
                                <div className="rounded w-12 h-12 flex items-center justify-center bg-[#183b94] mb-6">
                                    <p className="text-[#fff] text-xl font-bold">1</p> 
                                </div>
                                <h4 className="text-[#000] text-[20px] font-semibold mb-2">Collect Ur orders </h4>
                                <p className="text-[#696868] text-[14px] font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores </p>
                            </div>
                            <div className="border-[2px] border-gray-100 px-6 py-8 flex flex-col rounded-2xl bg-[#fff] cursor-pointer hover:-translate-y-2 ">
                                <div className="rounded w-12 h-12 flex items-center justify-center bg-[#7398ce31] mb-6">
                                    <p className="text-[#367fee] text-xl font-bold">1</p> 
                                </div>
                                <h4 className="text-[#000] text-[20px] font-semibold mb-2">Collect Ur orders </h4>
                                <p className="text-[#696868] text-[14px] font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores </p>
                            </div>
                            <div className="border-[2px] border-gray-100 px-6 py-8 flex flex-col rounded-2xl bg-[#fff] cursor-pointer hover:-translate-y-2 ">
                                <div className="rounded w-12 h-12 flex items-center justify-center bg-[#7398ce31] mb-6">
                                    <p className="text-[#367fee] text-xl font-bold">1</p> 
                                </div>
                                <h4 className="text-[#000] text-[20px] font-semibold mb-2">Collect Ur orders </h4>
                                <p className="text-[#696868] text-[14px] font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores </p>
                            </div>
                            <div className="border-[2px] border-gray-100 px-6 py-8 flex flex-col rounded-2xl bg-[#fff] cursor-pointer hover:-translate-y-2 ">
                                <div className="rounded w-12 h-12 flex items-center justify-center bg-[#7398ce31] mb-6">
                                    <p className="text-[#367fee] text-xl font-bold">1</p> 
                                </div>
                                <h4 className="text-[#000] text-[20px] font-semibold mb-2">Collect Ur orders </h4>
                                <p className="text-[#696868] text-[14px] font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam enim a incidunt? Asperiores </p>
                            </div>
                        </div>
                    </div>
                </div>
 {/* section Contact  */}
        <div className='w-full pt-24  '  id='contact'>
                <div className='w-full max-w-[1300px] mx-auto flex flex-col items-center  px-15  '>
                   
                   <div className='flex items-center justify-center gap-16 w-full mb-14'>
                        <div className='basis-2/5 flex flex-col gap-4 py-16 px-10'>
                            <img src={'/assets/uk.png'} alt="logo" className="h-73" />
                        </div>
                        <div className='basis-1/2 flex flex-col '>
                                <p className='text-3xl font-bold '>Get in Touch with Us </p>
                                {error!=="" && 
                                <p className="text-red-600 bg-red-100 text-lg font-medium py-1 px-2 rounded mt-3">{error}</p>
                                }
                                <div className='flex flex-col lg:flex-row items-center lg:mb-3 mt-8'>
                                    <div className='w-full mb-3 lg:mb-5 lg:mr-6'>
                                        <label htmlFor="fname" className='block text-[#6d6c6c] text-md mb-1'>First Name</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            placeholder='First Name' 
                                            className='py-2 pl-5 w-full outline-none border-2 border-gray-200 rounded'
                                            onChange={handleInputChange}
                                            value={formData.firstName}
                                        />
                                    </div>
                                    <div className='w-full mb-3 lg:mb-5'>
                                        <label htmlFor="lname" className='block text-[#6d6c6c] text-md mb-1'>last Name</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            placeholder='last Name' 
                                            className='py-2 pl-5 w-full  outline-none border-2 border-gray-200 rounded'
                                            onChange={handleInputChange}
                                            value={formData.lastName}
                                        />
                                    </div>
                                </div>
                                <div className='w-full mb-3 lg:mb-5'>
                                    <label htmlFor="phone" className='block text-[#6d6c6c] text-md mb-1'>Phone Number</label>
                                    <input 
                                        type="text" 
                                        id="phoneNumber" 
                                        placeholder='Phone Number' 
                                        className='py-2 pl-5 w-full  outline-none border-2 border-gray-200 rounded'
                                        onChange={handleInputChange}
                                        value={formData.phoneNumber}
                                    />
                                </div>
                                <button className='border-[3px] border-[#183b94]  text-white  bg-[#183b94] py-2 px-8 text-lg font-bold w-fit rounded' onClick={handleSubmit}>Contact</button>
                        </div>
                   </div>
                </div>                  
            </div>
                <div className="w-full py-24 ">
                    <div className="flex flex-col items-center max-w-[1300px] mx-auto">
                        <h4 className='text-[45px] font-bold text-[#000] mb-10 '>Questions & Answers</h4>
                        <div className='flex flex-col w-full px-36'>
                        {faqData.map((faq, index) => (
                            <div key={index} className='flex flex-col gap-1 border-y-[2px] border-gray-100 py-5 px-8 rounded bg-white ' onClick={() => toggleAnswer(index)}>
                                <div className='flex items-center justify-between w-full '>
                                    <p className='text-lg font-medium '>{faq.question}</p>
                                    {visibleAnswer === index && 
                                        <ChevronDown size={22} color='#356fc6' />
                                    }
                                    {visibleAnswer !== index && 
                                        <ChevronUp size={22} color='#0A1425' /> 
                                    }
                                </div>
                                {visibleAnswer === index && 
                                <p className='text-md text-gray-600 '>{faq.answer}</p>
                                }
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                
            <div className='w-full bg-[#ff7400] pb-10'  id='footer'>
                <div className='w-full max-w-7xl mx-auto flex  items-start justify-between gap-24 py-24 pr-24'>
                    <div className='basis-1/2 flex flex-col gap-5'>
                        <div>
                            <img src={'/assets/logo2.png'} alt="logo" className="w-48" />
                        </div>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti fugit consequuntur similique ab enim iusto deserunt minima mollitia nemo sapiente ex possimus magnam quod provident non, laudantium eligendi. Dolores, dolor.
                        </p>
                        <div className="flex items-center gap-5 mt-8">
                            <Link className="flex items-center justify-center  bg-[#73a79f] rounded-full p-2 cursor-pointer" to={'https://wincreative.ma/'}>
                                <Instagram  color='#fff' size={25}/>
                            </Link>
                            <Link className="flex items-center justify-center  bg-[#73a79f] rounded-full p-2 cursor-pointer" to={'https://wincreative.ma/'}>
                                <Facebook  color='#000' size={25}/>
                            </Link>
                            <Link className="flex items-center justify-center  bg-[#6aca8e] rounded-full p-2 cursor-pointer" to={'https://wincreative.ma/'}>
                                <Youtube  color='#000' size={25}/>
                            </Link>
                            <Link className="flex items-center justify-center  bg-[#6aca8e] rounded-full p-2 cursor-pointer" to={'https://wincreative.ma/'}>
                                <MessageSquareText   color='#fff' size={25}/>
                            </Link>
                            <Link className="flex items-center justify-center  bg-[#ffffff] rounded-full p-2 cursor-pointer" to={'https://wincreative.ma/'}>
                                <MessageSquareText   color='#000' size={25}/>
                            </Link>
                            
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 basis-1/3'>
                        <p className="font-bold text-2xl text-[#fff] mb-3">Links</p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                    </div>
                    <div className='flex flex-col gap-5 basis-1/3'>
                        <p className="font-bold text-2xl text-[#6aca8e] mb-3">Contact Infos</p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                        <p className="text-gray-200 text-md font-medium">
                            Lorem ipsum 
                        </p>
                    </div>
                </div>
                </div>
        </div>
    );
} 

export default LandingPage;