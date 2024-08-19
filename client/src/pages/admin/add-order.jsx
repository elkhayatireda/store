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
        const item = {
            id: product._id,
            title: product.title,
            image: selectedCombination && selectedCombination.image ? selectedCombination.image : product.images[0],
            unitPrice: selectedCombination ? selectedCombination.price : product.price,
            variant: selectedCombination ? selectedCombination.combination : null,
            quantity: Number(quantity),
        };

        setOrderItems(prev => [...prev, item]);
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

    const handleSaveOrder = () => {
        const order = {
            guestInfo,
            items: orderItems,
            totalPrice: calculateTotalPrice(),
        };

        console.log(order);
        // You can send the order to the server here if needed
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>Save order</DialogTrigger>
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

            {products.length > 0 ? (
                products.map(product => (
                    <div key={product._id}>
                        <h2>{product.title}</h2>
                        <img src={product.images[0]} alt={product.title} />
                        <p>${product.price}</p>
                        <Dialog>
                            <DialogTrigger>Add to order</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{product.title}</DialogTitle>
                                </DialogHeader>
                                <div className='max-h-72 overflow-auto'>
                                    {product.isVariant && product.combinations.length > 0 ? (
                                        <div>
                                            {product.combinations.map(combination => (
                                                <label key={combination._id} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name={`combination-${product._id}`}
                                                        value={combination._id}
                                                        onChange={() => setSelectedCombination(combination)}
                                                        checked={selectedCombination?._id === combination._id}
                                                    />
                                                    <div>
                                                        <img src={combination.image} alt={combination.combination} className="w-12 h-12 object-cover" />
                                                        <p>{combination.combination}</p>
                                                        <p>${combination.price}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No combinations available</p>
                                    )}
                                </div>
                                <div>
                                    <label>Quantity:</label>
                                    <Input type="number" min="1" defaultValue="1" id={`quantity-${product._id}`} />
                                </div>
                                <Button onClick={() => {
                                    const quantity = document.getElementById(`quantity-${product._id}`).value;
                                    handleAddToOrder(product, quantity);
                                }}>Add to order</Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default AddOrder;