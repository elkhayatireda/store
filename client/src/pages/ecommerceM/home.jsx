import { useEffect, useState } from 'react';
import { axiosClient } from '@/api/axios';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Link, useNavigate } from 'react-router-dom';


function Home() {
    const [categories, setCategories] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setCategories(response.data);

                const response2 = await axiosClient.get('/products/top');
                setTopProducts(response2.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            {/* Hero Section */}
            <div className="text-center py-20 px-6">
                <h1 className="text-4xl font-bold text-gray-800">Bienvenue</h1>
                <p className="mt-2 text-gray-600">Découvrez les meilleurs produits à des prix incroyables</p>
                <Button className='mt-4 bg-black hover:bg-black hover:opacity-85 active:opacity-80'>
                    Achetez maintenant
                </Button>
            </div>

            {/* Categories Section */}
            <div className="py-10 px-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Catégories</h2>
                <div className='sm:px-10'>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent className='-ml-4'>
                            {
                                categories.map(category => (
                                    <CarouselItem key={category._id} className='pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5'>
                                        <div className='relative group rounded-md border h-full'>
                                            <div className="overflow-hidden rounded-md rounded-b-none">
                                                <img
                                                    src={category.imgPath}
                                                    alt={category.title}
                                                    className="w-full aspect-square object-cover rounded-sm rounded-b-none transform transition duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className='p-2'>
                                                <p className='font-medium capitalize'>{category.title}</p>
                                                <p className='text-xs text-gray-500'>
                                                    {category.description.length > 60 ? `${category.description.substring(0, 60)}..` : category.description}
                                                </p>
                                                <div className='h-12 bg-transparent'></div>
                                                <div className='absolute bottom-2 left-0 right-0 flex flex-col items-center justify-center'>
                                                    <p className='text-xs'>{`${category.productCount} ${category.productCount == 1 ? 'item' : 'items'}`}</p>
                                                    <Link className='underline text-sm hover:cursor-pointer'>View products</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>

            {/* Top Products Section */}
            <div className="py-10 px-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Produits phares</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {topProducts.map((product) => (
                        <div
                            key={product._id}
                            className="group hover:border rounded-b text-center cursor-pointer transition-all"
                            onClick={() => {
                                navigate('/m/products/' + product._id)
                            }}
                        >
                            <div className="mb-2 overflow-hidden">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full object-cover transform transition duration-600 group-hover:scale-125"
                                />
                            </div>
                            <div className='pb-4 px-1'>
                                <h3 className="text-lg font-semibold text-gray-800 capitalize group-hover:opacity-95">{product.title}</h3>
                                <p className="text-gray-400 text-xs line-through">${product.comparePrice}</p>
                                <p className="text-gray-700 text-sm">${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;