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
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Eye, Save } from 'lucide-react';
import CustomInput from '@/components/custom/CustomInput';
import { Plus, Minus, Trash2 } from 'lucide-react';

const AddOrder = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [ref, setRef] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCombination, setSelectedCombination] = useState(null);
    const [newCustomerInfo, setNewCustomerInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/products/combinations');
                setProducts(response.data);

                if (id != 'add') {
                    const response2 = await axiosClient.get('/orders/' + id);
                    setOrderItems(response2.data.items);
                    setNewCustomerInfo(response2.data.guestInfo);
                    setRef(response2.data.ref)
                }
            } catch (error) {
                console.error("There was an error fetching the products!", error);
            }
        };

        fetchData();
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
                    image: (selectedCombination && selectedCombination.image) ? selectedCombination.image : product.images[0],
                    unitPrice: selectedCombination ? selectedCombination.price : product.price,
                    variant: selectedCombination ? selectedCombination.combination : '-',
                    quantity: Number(quantity),
                };
                return [...prevOrderItems, newItem];
            }
        });

        setSelectedCombination(null); // Reset the selected combination
        toast.success('Product added to order');
    };

    const handleNewCustomerInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomerInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
        validateInput(name, value);
    };

    const validateInput = (name, value) => {
        let error = '';
        if (value.trim() === '') {
            error = 'This field is required';
        } else if (name === 'phone' && !/^\d+$/.test(value)) {
            error = 'Phone number should be a valid number';
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const isFormValid = () => {
        const { fullName, phone, address } = newCustomerInfo;
        return (
            fullName.trim() !== '' &&
            phone.trim() !== '' &&
            address.trim() !== '' &&
            /^\d+$/.test(phone)
        );
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    };

    const handleSaveOrder = async () => {
        if (!isFormValid()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        const order = {
            guestInfo: {
                fullName: newCustomerInfo.fullName,
                phone: newCustomerInfo.phone,
                address: newCustomerInfo.address,
            },
            items: orderItems,
            totalPrice: calculateTotalPrice(),
            status: 'pending'
        };

        try {
            if (id == 'add') {
                const response = await axiosClient.post('/orders', order);
                toast.success('Order created successfully');
                console.log('Order created successfully:', response.data);
                setOrderItems([]);
                setNewCustomerInfo({
                    fullName: '',
                    phone: '',
                    address: '',
                });
            } else {
                const response = await axiosClient.put('/orders/details/' + id, order);
                toast.success('Order updated successfully');
                console.log('Order updated successfully:', response.data);
                navigate('/admin/orders')
            }
            setErrors({
                fullName: '',
                phone: '',
                address: '',
            });

        } catch (error) {
            toast.error('Error');
            console.error('Error:', error);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className='mt-24'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className='text-lg font-medium'>
                        {id == 'add' ? 'Create a new order' : `Updating order #0${ref}`}
                    </h2>
                    <p className='text-xs text-gray-600 max-w-[600px]'>
                        {id === 'add' ?
                            'Select items to add to the order. Once done, click on "View Items" on the bottom to review your selections. After that, enter the customer\'s information and save your order.'
                            :
                            'Add more items to the order if needed. You can review the items by clicking on "View Items" on the bottom. Once satisfied, you can either save the order or update the customer information.'
                        }
                    </p>

                </div>
                <Link
                    className='flex items-center gap-0.5 text-blue-500'
                    to={'/admin/orders'}
                >
                    <ChevronLeft size={18} /> Back
                </Link>
            </div>
            <div className="w-full fixed bottom-0 border bg-white border-gray-200 right-0 left-0  flex items-center justify-end p-3 gap-3">
                <Dialog>
                    <DialogTrigger className='bg-green-50 text-green-800 px-2.5 py-1.5 rounded flex items-center gap-0.5'>
                        <Eye size={16} /> View items
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Order items</DialogTitle>
                        </DialogHeader>
                        <div className="h-56 overflow-auto">
                            {
                                orderItems.map(item => (
                                    <div key={item.id + item.variant} className="flex gap-2 items-start shadow p-1 rounded mb-3">
                                        <img className="w-9 h-9 rounded-full object-cover" src={item.image} alt={item.title} />
                                        <div className="flex-1">
                                            <p className="text-sm">{item.title}{item.variant !== '-' && ` - ${item.variant}`}</p>
                                            <p className="text-xs text-gray-400">{item.unitPrice}DH</p>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <div className='flex gap-1 items-center'>
                                                <Button
                                                    className='p-1'
                                                    disabled={item.quantity == 1}
                                                    variant='ghost'
                                                    onClick={() => {
                                                        setOrderItems(prevOrderItems =>
                                                            prevOrderItems.map(orderItem =>
                                                                orderItem.id === item.id && orderItem.variant === item.variant
                                                                    ? { ...orderItem, quantity: Math.max(orderItem.quantity - 1, 1) }
                                                                    : orderItem
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <Minus size={14} />
                                                </Button>
                                                <span className='text-xs text-gray-600'>{item.quantity}</span>
                                                <Button
                                                    className='p-1'
                                                    variant='ghost'
                                                    onClick={() => {
                                                        setOrderItems(prevOrderItems =>
                                                            prevOrderItems.map(orderItem =>
                                                                orderItem.id === item.id && orderItem.variant === item.variant
                                                                    ? { ...orderItem, quantity: orderItem.quantity + 1 }
                                                                    : orderItem
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <Plus size={14} />
                                                </Button>
                                            </div>
                                            <Button
                                                className='p-1'
                                                variant='ghost'
                                                onClick={() => {
                                                    setOrderItems(prevOrderItems =>
                                                        prevOrderItems.filter(orderItem =>
                                                            !(orderItem.id === item.id && orderItem.variant === item.variant)
                                                        )
                                                    );
                                                }}
                                            >
                                                <Trash2 color='red' size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p className='w-fit ml-auto text-sm text-gray-500 font-medium'>Total: {calculateTotalPrice()}DH</p>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger disabled={orderItems.length === 0} className={`bg-primary text-white px-2.5 py-1.5 rounded flex items-center gap-1 ${orderItems.length === 0 && 'opacity-60 cursor-not-allowed'}`}>
                        <Save size={18} /> Save order
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Client info</DialogTitle>
                        </DialogHeader>
                        <div>
                            <label>Full Name:</label>
                            <CustomInput
                                type="text"
                                name="fullName"
                                value={newCustomerInfo.fullName}
                                onChange={handleNewCustomerInputChange}
                                required
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label>Phone:</label>
                            <CustomInput
                                type="text"
                                name="phone"
                                value={newCustomerInfo.phone}
                                onChange={handleNewCustomerInputChange}
                                required
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>
                        <div>
                            <label>Address:</label>
                            <CustomInput
                                type="text"
                                name="address"
                                value={newCustomerInfo.address}
                                onChange={handleNewCustomerInputChange}
                                required
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>
                        <Button onClick={handleSaveOrder}>Save</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='mt-4 w-fit'>
                <CustomInput
                    type="text"
                    placeholder="Search by title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div className='p-2 border rounded-md' key={product._id}>
                            <img className='object-cover w-full' src={product.images[0]} alt={product.title} />
                            <h2 className='font-medium capitalize'>{product.title}</h2>
                            <p className='text-sm text-gray-400'>{product.price}DH</p>
                            <Dialog>
                                <DialogTrigger className='block mt-2 mx-auto w-fit text-blue-500 underline'>Add to order</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{product.title}</DialogTitle>
                                    </DialogHeader>

                                    {product.isVariant && product.combinations.length > 0 ? (
                                        <div className='max-h-56 overflow-auto'>
                                            {
                                            product.combinations.map(variation => (
                                                <div key={variation._id} className="flex items-center gap-2 mb-2">
                                                    <input
                                                        type="radio"
                                                        name="combination"
                                                        id={variation._id}
                                                        value={variation.combination}
                                                        checked={selectedCombination && selectedCombination._id === variation._id}
                                                        onChange={() => setSelectedCombination(variation)}
                                                    />
                                                    <label htmlFor={variation._id} className="flex gap-2 items-center">
                                                        <img className='w-7 h-7 rounded-full object-cover' src={variation.image || product.images[0]} alt={variation.combination} />
                                                        <span>{variation.combination} ({variation.price}DH)</span>
                                                    </label>
                                                </div>
                                            ))
                                            }
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No variants available</p>
                                    )}

                                    <div className='flex items-center justify-end gap-2 mt-2'>
                                        <CustomInput type="number" min="1" defaultValue="1" id={`quantity - ${product._id}`} />
                                        <Button onClick={() => {
                                            const quantity = document.getElementById(`quantity - ${product._id}`).value;
                                            handleAddToOrder(product, quantity)
                                        }}>Add</Button>
                                    </div>
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




// import { axiosClient } from '@/api/axios';
// import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from '@/components/ui/input';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
// import { ChevronLeft, Eye } from 'lucide-react';
// import { useCustomers } from '@/contexts/customer';

// const AddOrder = () => {
//     const { data: customers, createCustomer } = useCustomers();  // Access customers and createCustomer function
//     const [products, setProducts] = useState([]);
//     const [orderItems, setOrderItems] = useState([]);
//     const [selectedCombination, setSelectedCombination] = useState(null);
//     const [selectedCustomerId, setSelectedCustomerId] = useState(null);  // For existing customer
//     const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);  // Toggle between new or existing customer
//     const [newCustomerInfo, setNewCustomerInfo] = useState({
//         fullName: '',
//         phone: '',
//         address: '',
//     });

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axiosClient.get('/products/combinations');
//                 setProducts(response.data);
//             } catch (error) {
//                 console.error("There was an error fetching the products!", error);
//             }
//         };

//         fetchProducts();
//     }, []);

//     const handleAddToOrder = (product, quantity) => {
//         setOrderItems(prevOrderItems => {
//             const existingItemIndex = prevOrderItems.findIndex(
//                 item =>
//                     item.id === product._id &&
//                     item.variant === (selectedCombination ? selectedCombination.combination : '-')
//             );

//             if (existingItemIndex !== -1) {
//                 const updatedOrderItems = [...prevOrderItems];
//                 updatedOrderItems[existingItemIndex].quantity += Number(quantity);
//                 return updatedOrderItems;
//             } else {
//                 const newItem = {
//                     id: product._id,
//                     title: product.title,
//                     image: selectedCombination && selectedCombination.image ? selectedCombination.image : product.images[0],
//                     unitPrice: selectedCombination ? selectedCombination.price : product.price,
//                     variant: selectedCombination ? selectedCombination.combination : '-',
//                     quantity: Number(quantity),
//                 };
//                 return [...prevOrderItems, newItem];
//             }
//         });

//         setSelectedCombination(null); // Reset the selected combination
//         toast.success('product added to order')
//     };

//     const handleNewCustomerInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewCustomerInfo(prevInfo => ({
//             ...prevInfo,
//             [name]: value,
//         }));
//     };

//     const calculateTotalPrice = () => {
//         return orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
//     };

//     const handleSaveOrder = async () => {
//         let customerId = selectedCustomerId;

//         if (isCreatingNewCustomer) {
//             // Create a new customer if the admin chooses to do so
//             const customerData = {
//                 fullName: newCustomerInfo.fullName,
//                 phone: newCustomerInfo.phone,
//                 address: newCustomerInfo.address,
//             };
//             const newCustomer = await createCustomer(customerData);  // This should automatically add the new customer to the context's data
//             console.log(newCustomer);

//             customerId = newCustomer ? newCustomer._id : null;
//         }

//         if (!customerId) {
//             toast.error("Customer information is required");
//             return;
//         }

//         const order = {
//             customerId,
//             items: orderItems,
//             totalPrice: calculateTotalPrice(),
//             status: 'pending'
//         };

//         try {
//             const response = await axiosClient.post('/orders', order);
//             toast.success('Order created successfully');
//             console.log('Order created successfully:', response.data);
//             setOrderItems([]);
//             setNewCustomerInfo({
//                 fullName: '',
//                 phone: '',
//                 address: '',
//             });
//             setSelectedCustomerId(null);
//             setSelectedCombination(null);
//         } catch (error) {
//             toast.error('Error creating order');
//             console.error('Error creating order:', error);
//         }
//     };

//     return (
//         <div className='mt-24'>
//             <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
//                 <Link
//                     className='flex items-center gap-0.5 text-blue-500'
//                     to={'/admin/orders'}
//                 >
//                     <ChevronLeft size={18} /> Back
//                 </Link>
//                 <div className='flex items-center gap-3'>
//                     <Dialog>
//                         <DialogTrigger className='bg-green-50 text-green-800 px-2.5 py-1.5 rounded flex items-center gap-0.5'>
//                             View items <Eye size={16} />
//                         </DialogTrigger>
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Order items</DialogTitle>
//                             </DialogHeader>
//                             <div className="h-56 overflow-auto">
//                                 {
//                                     orderItems.map(item => (
//                                         <div className="flex gap-2 items-start border px-4 py-1 rounded-sm mb-2">
//                                             <img className="w-9 h-9 rounded-full" src={item.image} alt={item.title} />
//                                             <div>
//                                                 <p className="text-sm">{item.title}{item.variant != '-' && ` - ${item.variant}`}</p>
//                                                 <p className="text-xs text-gray-400">{item.quantity} * {item.unitPrice}DH</p>
//                                             </div>
//                                         </div>
//                                     ))
//                                 }
//                             </div>
//                             <p className='w-fit ml-auto text-sm text-gray-500 font-medium'>Total: {calculateTotalPrice()}DH</p>
//                         </DialogContent>
//                     </Dialog>
//                     <Dialog>
//                         <DialogTrigger disabled={orderItems.length == 0} className={`bg-primary text-white px-2.5 py-1.5 rounded ${orderItems.length == 0 && 'opacity-60 cursor-not-allowed'}`}>
//                             Save order
//                         </DialogTrigger>
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Client info</DialogTitle>
//                             </DialogHeader>
//                             <div className="space-y-4">
//                                 <div className="flex justify-center items-center gap-4">
//                                     <div>
//                                         <input
//                                             id='existing-cutomer'
//                                             className='w-[0.1px] h-[0.1px] opacity-0'
//                                             type="radio"
//                                             name="customerOption"
//                                             value="existing"
//                                             checked={!isCreatingNewCustomer}
//                                             onChange={() => setIsCreatingNewCustomer(false)}
//                                         />
//                                         <label
//                                             className={`text-sm cursor-pointer ${!isCreatingNewCustomer ? 'text-blue-500 font-medium' : 'text-gray-500 font-light'}`}
//                                             for='existing-cutomer'
//                                         >
//                                             Choose existing customer
//                                         </label>
//                                     </div>
//                                     <div>
//                                         <input
//                                             id='new-cutomer'
//                                             className='w-[0.1px] h-[0.1px] opacity-0'
//                                             type="radio"
//                                             name="customerOption"
//                                             value="new"
//                                             checked={isCreatingNewCustomer}
//                                             onChange={() => setIsCreatingNewCustomer(true)}
//                                         />
//                                         <label
//                                             className={`text-sm cursor-pointer ${isCreatingNewCustomer ? 'text-blue-500 font-medium' : 'text-gray-500 font-light'}`}
//                                             for='new-cutomer'
//                                         >
//                                             Create new customer
//                                         </label>
//                                     </div>
//                                 </div>
//                                 {!isCreatingNewCustomer && (
//                                     <div className="py-1 h-56 overflow-auto">
//                                         {customers.map(customer => (
//                                             <div className="mb-2 flex items-center gap-2 hover:opacity-85" key={customer._id}>
//                                                 <input
//                                                     id={`i-${customer._id}`}
//                                                     type="radio"
//                                                     name="selectedCustomer"
//                                                     value={customer._id}
//                                                     onChange={(e) => setSelectedCustomerId(e.target.value)}
//                                                     checked={selectedCustomerId === customer._id}
//                                                 />
//                                                 <label className='cursor-pointer flex items-center gap-2' for={`i-${customer._id}`}>
//                                                     <span className='font-medium'>{customer.fullName}</span>
//                                                     <span className='text-sm text-gray-500'>{customer.phone}</span>
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 {isCreatingNewCustomer && (
//                                     <div className="space-y-2">
//                                         <div>
//                                             <label>Full Name:</label>
//                                             <Input
//                                                 type="text"
//                                                 name="fullName"
//                                                 value={newCustomerInfo.fullName}
//                                                 onChange={handleNewCustomerInputChange}
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Phone:</label>
//                                             <Input
//                                                 type="text"
//                                                 name="phone"
//                                                 value={newCustomerInfo.phone}
//                                                 onChange={handleNewCustomerInputChange}
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Address:</label>
//                                             <Input
//                                                 type="text"
//                                                 name="address"
//                                                 value={newCustomerInfo.address}
//                                                 onChange={handleNewCustomerInputChange}
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 <Button onClick={handleSaveOrder}>Save</Button>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>

//             <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
//                 {products.length > 0 ? (
//                     products.map(product => (
//                         <div className='p-2 border rounded-md' key={product._id}>
//                             <img className='object-cover w-full' src={product.images[0]} alt={product.title} />
//                             <h2 className='font-medium capitalize'>{product.title}</h2>
//                             <p className='text-sm text-gray-400'>{product.price}DH</p>
//                             <Dialog>
//                                 <DialogTrigger className='block mt-2 mx-auto w-fit text-blue-500 underline'>Add to order</DialogTrigger>
//                                 <DialogContent>
//                                     <DialogHeader>
//                                         <DialogTitle>{product.title}</DialogTitle>
//                                     </DialogHeader>
//                                     <div className='max-h-72 overflow-auto'>
//                                         {product.isVariant && product.combinations.length > 0 && (
//                                             <div>
//                                                 {product.combinations.map(combination => (
//                                                     <label key={combination._id} className="flex items-center gap-2 my-1">
//                                                         <input
//                                                             type="radio"
//                                                             name={`combination-${product._id}`}
//                                                             value={combination._id}
//                                                             onChange={() => setSelectedCombination(combination)}
//                                                             checked={selectedCombination?._id === combination._id}
//                                                         />
//                                                         <div>
//                                                             <div className='flex gap-2'>
//                                                                 <img src={combination.image} alt={combination.combination} className="w-12 h-12 object-cover" />
//                                                                 <div>
//                                                                     <p className='font-medium'>{combination.combination}</p>
//                                                                     <p className='text-xs text-gray-500'>{combination.price}DH</p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         )}
//                                         <div className='flex justify-between gap-2 mt-2'>
//                                             <Input type="number" min="1" defaultValue="1" id={`quantity - ${product._id}`} />
//                                             <Button onClick={() => {
//                                                 const quantity = document.getElementById(`quantity - ${product._id}`).value;
//                                                 handleAddToOrder(product, quantity)
//                                             }}>Add</Button>
//                                         </div>
//                                     </div>
//                                 </DialogContent>
//                             </Dialog>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No products available.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AddOrder;