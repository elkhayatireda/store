import { axiosClient } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AddOrder = () => {
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedCombination, setSelectedCombination] = useState(null);
    const [guestInfo, setGuestInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get('/products/combinations');
                setProducts(response.data);
            } catch (error) {
                console.error("There was an error fetching the products!", error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToOrder = (product, quantity) => {
        setOrderItems(prevOrderItems => {
            const existingItemIndex = prevOrderItems.findIndex(
                item =>
                    item.id === product._id &&
                    item.variant === (selectedCombination ? selectedCombination.combination : '-')
            );

            if (existingItemIndex !== -1) {
                // If the item exists, update its quantity
                const updatedOrderItems = [...prevOrderItems];
                updatedOrderItems[existingItemIndex].quantity += Number(quantity);
                return updatedOrderItems;
            } else {
                // If the item doesn't exist, add it to the order
                const newItem = {
                    id: product._id,
                    title: product.title,
                    image: selectedCombination && selectedCombination.image ? selectedCombination.image : product.images[0],
                    unitPrice: selectedCombination ? selectedCombination.price : product.price,
                    variant: selectedCombination ? selectedCombination.combination : '-',
                    quantity: Number(quantity),
                };
                return [...prevOrderItems, newItem];
            }
        });

        setSelectedCombination(null); // Reset the selected combination
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    };

    const handleSaveOrder = async () => {
        const order = {
            guestInfo,
            items: orderItems,
            totalPrice: calculateTotalPrice(),
            status: 'pending'
        };

        try {
            const response = await axiosClient.post('/orders', order);
            toast.success('Order created successfully');
            console.log('Order created successfully:', response.data);
            setOrderItems([]);
            setGuestInfo({
                fullName: '',
                phone: '',
                address: '',
            })
            setSelectedCombination(null)
        } catch (error) {
            toast.error('Error creating order');
            console.error('Error creating order:', error);
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center'>
                <Link
                    className='flex items-center gap-0.5 text-blue-500'
                    to={'/admin/orders'}
                >
                    <ChevronLeft size={18} /> Back
                </Link>
                <Dialog>
                    <DialogTrigger className='bg-blue-950 text-white px-2.5 py-1.5 rounded'>Save order</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Client info</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label>Full Name:</label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    value={guestInfo.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Phone:</label>
                                <Input
                                    type="text"
                                    name="phone"
                                    value={guestInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Address:</label>
                                <Input
                                    type="text"
                                    name="address"
                                    value={guestInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <Button onClick={handleSaveOrder}>Save</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {products.length > 0 ? (
                    products.map(product => (
                        <div className='p-2 border rounded-md' key={product._id}>
                            <img className='object-cover' src={product.images[0]} alt={product.title} />
                            <h2 className='font-medium capitalize'>{product.title}</h2>
                            <p className='text-sm text-gray-400'>{product.price}DH</p>
                            <Dialog>
                                <DialogTrigger className='block mt-2 mx-auto w-fit text-blue-500 underline'>Add to order</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{product.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className='max-h-72 overflow-auto'>
                                        {product.isVariant && product.combinations.length > 0 && (
                                            <div>
                                                {product.combinations.map(combination => (
                                                    <label key={combination._id} className="flex items-center gap-2 my-1">
                                                        <input
                                                            type="radio"
                                                            name={`combination-${product._id}`}
                                                            value={combination._id}
                                                            onChange={() => setSelectedCombination(combination)}
                                                            checked={selectedCombination?._id === combination._id}
                                                        />
                                                        <div>
                                                            <div className='flex gap-2'>
                                                                <img src={combination.image} alt={combination.combination} className="w-12 h-12 object-cover" />
                                                                <div>
                                                                    <p className='font-medium'>{combination.combination}</p>
                                                                    <p className='text-xs text-gray-500'>{combination.price}DH</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label>Quantity:</label>
                                        <Input type="number" min="1" defaultValue="1" id={`quantity-${product._id}`} />
                                    </div>
                                    <Button onClick={() => {
                                        const quantity = document.getElementById(`quantity-${product._id}`).value;
                                        handleAddToOrder(product, quantity);
                                        toast.success("product added to order")
                                    }}>Add to order</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default AddOrder;