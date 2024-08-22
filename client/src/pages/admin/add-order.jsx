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
import { ChevronLeft, Eye } from 'lucide-react';
import { useCustomers } from '@/contexts/customer';

const AddOrder = () => {
    const { data: customers, createCustomer } = useCustomers();  // Access customers and createCustomer function
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedCombination, setSelectedCombination] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);  // For existing customer
    const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);  // Toggle between new or existing customer
    const [newCustomerInfo, setNewCustomerInfo] = useState({
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
                const updatedOrderItems = [...prevOrderItems];
                updatedOrderItems[existingItemIndex].quantity += Number(quantity);
                return updatedOrderItems;
            } else {
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
        toast.success('product added to order')
    };

    const handleNewCustomerInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomerInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    };

    const handleSaveOrder = async () => {
        let customerId = selectedCustomerId;

        if (isCreatingNewCustomer) {
            // Create a new customer if the admin chooses to do so
            const customerData = {
                fullName: newCustomerInfo.fullName,
                phone: newCustomerInfo.phone,
                address: newCustomerInfo.address,
            };
            const newCustomer = await createCustomer(customerData);  // This should automatically add the new customer to the context's data
            console.log(newCustomer);

            customerId = newCustomer ? newCustomer._id : null;
        }

        if (!customerId) {
            toast.error("Customer information is required");
            return;
        }

        const order = {
            customerId,
            items: orderItems,
            totalPrice: calculateTotalPrice(),
            status: 'pending'
        };

        try {
            const response = await axiosClient.post('/orders', order);
            toast.success('Order created successfully');
            console.log('Order created successfully:', response.data);
            setOrderItems([]);
            setNewCustomerInfo({
                fullName: '',
                phone: '',
                address: '',
            });
            setSelectedCustomerId(null);
            setSelectedCombination(null);
        } catch (error) {
            toast.error('Error creating order');
            console.error('Error creating order:', error);
        }
    };

    return (
        <div className='mt-24'>
            <div className='flex justify-between items-center'>
                <Link
                    className='flex items-center gap-0.5 text-blue-500'
                    to={'/admin/orders'}
                >
                    <ChevronLeft size={18} /> Back
                </Link>
                <div className='flex items-center gap-3'>
                    <Dialog>
                        <DialogTrigger className='bg-blue-50 text-blue-800 px-2.5 py-1.5 rounded flex items-center gap-0.5'>
                            View items <Eye size={16} />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Order items</DialogTitle>
                            </DialogHeader>
                            <div className="h-56 overflow-auto">
                                {
                                    orderItems.map(item => (
                                        <div className="flex gap-2 items-start border px-4 py-1 rounded-sm mb-2">
                                            <img className="w-9 h-9 rounded-full" src={item.image} alt={item.title} />
                                            <div>
                                                <p className="text-sm">{item.title}{item.variant != '-' && ` - ${item.variant}`}</p>
                                                <p className="text-xs text-gray-400">{item.quantity} * {item.unitPrice}DH</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <p className='w-fit ml-auto text-sm text-gray-500 font-medium'>Total: {calculateTotalPrice()}DH</p>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger className='bg-blue-950 text-white px-2.5 py-1.5 rounded'>
                            Save order
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Client info</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex justify-center items-center gap-4">
                                    <div>
                                        <input
                                            id='existing-cutomer'
                                            className='w-[0.1px] h-[0.1px] opacity-0'
                                            type="radio"
                                            name="customerOption"
                                            value="existing"
                                            checked={!isCreatingNewCustomer}
                                            onChange={() => setIsCreatingNewCustomer(false)}
                                        />
                                        <label
                                            className={`text-sm cursor-pointer ${!isCreatingNewCustomer ? 'text-blue-500 font-medium' : 'text-gray-500 font-light'}`}
                                            for='existing-cutomer'
                                        >
                                            Choose existing customer
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            id='new-cutomer'
                                            className='w-[0.1px] h-[0.1px] opacity-0'
                                            type="radio"
                                            name="customerOption"
                                            value="new"
                                            checked={isCreatingNewCustomer}
                                            onChange={() => setIsCreatingNewCustomer(true)}
                                        />
                                        <label
                                            className={`text-sm cursor-pointer ${isCreatingNewCustomer ? 'text-blue-500 font-medium' : 'text-gray-500 font-light'}`}
                                            for='new-cutomer'
                                        >
                                            Create new customer
                                        </label>
                                    </div>
                                </div>
                                {!isCreatingNewCustomer && (
                                    <div className="py-1 h-56 overflow-auto">
                                        {customers.map(customer => (
                                            <div className="mb-2 flex items-center gap-2 hover:opacity-85" key={customer._id}>
                                                <input
                                                    id={`i-${customer._id}`}
                                                    type="radio"
                                                    name="selectedCustomer"
                                                    value={customer._id}
                                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                                    checked={selectedCustomerId === customer._id}
                                                />
                                                <label className='cursor-pointer flex items-center gap-2' for={`i-${customer._id}`}>
                                                    <span className='font-medium'>{customer.fullName}</span>
                                                    <span className='text-sm text-gray-500'>{customer.phone}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isCreatingNewCustomer && (
                                    <div className="space-y-2">
                                        <div>
                                            <label>Full Name:</label>
                                            <Input
                                                type="text"
                                                name="fullName"
                                                value={newCustomerInfo.fullName}
                                                onChange={handleNewCustomerInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Phone:</label>
                                            <Input
                                                type="text"
                                                name="phone"
                                                value={newCustomerInfo.phone}
                                                onChange={handleNewCustomerInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Address:</label>
                                            <Input
                                                type="text"
                                                name="address"
                                                value={newCustomerInfo.address}
                                                onChange={handleNewCustomerInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button onClick={handleSaveOrder}>Save</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
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
                                        <div className='flex justify-between gap-2 mt-2'>
                                            <Input type="number" min="1" defaultValue="1" id={`quantity - ${product._id}`} />
                                            <Button onClick={() => {
                                                const quantity = document.getElementById(`quantity - ${product._id}`).value;
                                                handleAddToOrder(product, quantity)
                                            }}>Add</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    );
};

export default AddOrder;