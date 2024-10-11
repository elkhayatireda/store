import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState(() => {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    });

    const handleDelete = (id, variant) => {
        const updatedItems = cartItems.filter(item => !(item.id === id && item.variant === variant));
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    const handleIncreaseQuantity = (id, variant) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === id && item.variant === variant) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    const handleDecreaseQuantity = (id, variant) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === id && item.variant === variant) {
                // Ensure quantity does not go below 1
                return { ...item, quantity: Math.max(item.quantity - 1, 1) };
            }
            return item;
        });
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0).toFixed(2);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Panier</h1>
                <span className="text-xl font-bold">{totalPrice} MAD</span> {/* Display total price in Moroccan Dirham */}
            </div>

            {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Votre panier est vide.</p> // Message for empty cart
            ) : (
                <ul className="space-y-6">
                    {cartItems.map((item) => (
                        <li key={item.id + item.variant} className='flex flex-col sm:flex-row gap-3'>
                            <img className='mx-auto w-32 md:w-1/5 aspect-square object-cover rounded-md' src={item.image} alt={item.title + ' ' + item.variant} />
                            <div className='flex-1'>
                                <div className='flex justify-between items-center'>
                                    <h2 className="text-lg font-medium capitalize">{item.title}</h2>
                                    <Button variant='ghost' onClick={() => handleDelete(item.id, item.variant)}>
                                        <Trash size={16} />
                                    </Button>
                                </div>
                                <p className="text-sm font-medium">{item.variant}</p>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-600">Quantité:</p>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" className="py-0 px-1" onClick={() => handleDecreaseQuantity(item.id, item.variant)} disabled={item.quantity === 1}>
                                            -
                                        </Button>
                                        <span className="text-sm">{item.quantity}</span>
                                        <Button variant="ghost" className="py-0 px-1" onClick={() => handleIncreaseQuantity(item.id, item.variant)}>
                                            +
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Prix: {item.unitPrice}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <p>Totale:</p>
                                    <p className="w-fit font-semibold">{(item.unitPrice * item.quantity).toFixed(2)} MAD</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6">
                <Button disabled={cartItems.length === 0}>
                    <Link to={'/m/checkout'}>
                        Passer à la caisse
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default Cart;