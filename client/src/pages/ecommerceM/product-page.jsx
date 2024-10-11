import { axiosClient } from "@/api/axios";
import CustomInput from "@/components/custom/CustomInput";
import ProductImages from "@/components/ecommerceM/product-images";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [reviews, setReviews] = useState([]);
    const [variants, setVariants] = useState([]);
    const [combinations, setCombinations] = useState([]);
    const [selectedImage, setSelectedImage] = useState(""); // State for the selected image
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [selectedCombination, setSelectedCombination] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get(`/products/${id}`);
                setProduct(response.data);
                setSelectedImage(response.data.images[0]); // Set the initial selected image

                const response2 = await axiosClient.get(`/products/reviews/${id}`);
                setReviews(response2.data);
                console.log(response2.data);


                if (response.data.isVariant) {
                    const response3 = await axiosClient.get(`/products/variants/${id}`);
                    setVariants(response3.data);
                    const response4 = await axiosClient.get(`/products/combinations/${id}`);
                    setCombinations(response4.data);
                }
            } catch (error) {
                console.error("There was an error fetching the products!", error);
            }
        };

        fetchData();
    }, [id]);

    const handleVariantChange = (variantName, value) => {
        if (!product.isVariant) {
            return
        }

        // Update selected variants
        setSelectedVariants(prevState => ({
            ...prevState,
            [variantName]: value, // Store the variant value for each selected variant
        }));

        // After updating selectedVariants, find the corresponding combination
        const updatedSelectedVariants = {
            ...selectedVariants, // Clone the previous state
            [variantName]: value, // Update the current variant value
        };

        // Create an array of selected variant values like ["red", "xl", "cotton"]
        const selectedVariantArray = Object.values(updatedSelectedVariants);

        // Search for the correct combination in the combinations array
        const foundCombination = combinations.find(combination => {
            // Split the combination string like "red / xl / cotton" into an array
            const combinationArray = combination.combination.split(' / ');

            // Check if the selectedVariantArray has the same values as combinationArray (ignoring order)
            return selectedVariantArray.length === combinationArray.length &&
                selectedVariantArray.every(value => combinationArray.includes(value));
        });

        if (foundCombination) {
            setSelectedCombination(foundCombination); // Set the found combination
            if (foundCombination.image) {
                setSelectedImage(foundCombination.image)
            }
        } else {
            setSelectedCombination(null); // Handle no combination found
        }
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;

        // Parse the input value as an integer
        const parsedValue = parseInt(value, 10);

        // Check if the parsed value is a valid integer and greater than zero
        if (!isNaN(parsedValue) && Number.isInteger(parsedValue) && parsedValue > 0) {
            setQuantity(parsedValue); // Set quantity only if valid
        }
    };

    return (
        <div className="mx-auto p-5">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <ProductImages
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    images={product.images}
                    title={product.title}
                />

                {/* Product Details */}
                <div className="w-full md:w-1/2 md:pl-8">
                    {/* Product Title */}
                    <h1 className="text-4xl capitalize mt-4 md:mt-0">{product.title}</h1>

                    {/* Product Price and Discount */}
                    <div className="flex items-center mt-3">
                        <span className="text-lg">
                            ${product.price}
                        </span>
                        <span className="text-sm line-through text-gray-500 ml-4">
                            ${product.comparePrice}
                        </span>
                        {/* {product.discount > 0 && (
                            <span className="ml-2 text-sm text-red-500">
                                ({Math.round(product.discount)}% off)
                            </span>
                        )} */}
                    </div>

                    {/* Variants */}
                    {
                        product.isVariant && (
                            <div className="my-6">
                                {variants.map((variant) => (
                                    <div key={variant.name} className="mb-4">
                                        <h3 className="font-semibold capitalize">{variant.name}:</h3>
                                        <div className="flex flex-wrap gap-4 mt-0.5">
                                            {variant.values.map((value) => (
                                                <label key={value} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={variant.name}
                                                        value={value}
                                                        checked={selectedVariants[variant.name] === value}
                                                        onChange={() => handleVariantChange(variant.name, value)}
                                                        className="sr-only"
                                                    />
                                                    <span className={`py-1 px-2 border rounded ${selectedVariants[variant.name] === value ? 'border-black bg-gray-50' : 'border-gray-300'}`}>
                                                        {value}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }

                    <label className="text-lg font-medium">Quantité:</label>
                    <div className="mb-2 flex flex-col sm:flex-row items-center sm:gap-5">
                        <div className="flex items-center gap-0.5">
                            <Button
                                className="p-0"
                                variant='ghost'
                                onClick={() => { quantity > 1 && setQuantity(prev => prev - 1) }}
                                disabled={quantity <= 1}
                            >
                                <MinusIcon />
                            </Button>
                            <CustomInput
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                            <Button
                                className='p-0'
                                variant='ghost'
                                onClick={() => { setQuantity(prev => prev + 1) }}
                            >
                                <PlusIcon />
                            </Button>
                        </div>
                        <Button
                            onClick={() => {
                                console.log(selectedCombination);

                                const id = product._id;
                                const title = product.title;
                                const variant = selectedCombination.combination;
                                const image = selectedCombination.image || product.images[0];
                                const unitPrice = selectedCombination.price;

                                const item = {
                                    id,
                                    title,
                                    variant,
                                    image,
                                    quantity: 1,
                                    unitPrice
                                };

                                const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                                const existingItemIndex = storedItems.findIndex(
                                    (storedItem) =>
                                        storedItem.id === item.id && storedItem.variant === item.variant
                                );

                                if (existingItemIndex !== -1) {
                                    storedItems[existingItemIndex].quantity += 1;
                                } else {
                                    storedItems.push(item);
                                }

                                localStorage.setItem('cartItems', JSON.stringify(storedItems));
                                toast.success('article ajouté au panier')
                            }}
                            className="w-full bg-black hover:bg-black hover:opacity-90 active:opacity-80"
                        >
                            Ajouter au panier
                        </Button>
                    </div>
                    <Button
                        className="w-full bg-black hover:bg-black hover:opacity-90 active:opacity-80"
                    >
                        Commandez maintenant
                    </Button>
                </div>
            </div>
            {/* Product Description */}
            <div
                className="mt-10"
                dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>

            {/* Product Reviews  */}
            {
                reviews.length > 0 &&
                <div>
                    <div className="mt-16 mb-10 mx-auto w-[65%] grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:border-r-2 border-stone-100">
                            <h4 className="text-lg font-semibold text-gray-700">Nombre d'avis</h4>
                            <p className="text-xl font-bold">{reviews.length}</p>
                        </div>

                        <div className="lg:border-r-2 border-stone-100">
                            <h4 className="text-lg font-semibold text-gray-700">Note moyenne</h4>
                            <div className="flex items-center gap-3">
                                <p className="text-xl font-bold">
                                    {
                                        reviews.length > 0
                                            ?
                                            (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                                            :
                                            'N/A'
                                    }
                                </p>
                                <div className="flex gap-1 items-center">
                                    {
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                className={`h-4 w-4 ${index < (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) ? 'text-yellow-500' : 'text-gray-300'}`}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div>
                            {Array.from({ length: 5 }, (_, index) => {
                                const colors = ['bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-blue-500', 'bg-red-500'];
                                return <div key={5 - index} className="flex items-center text-gray-700 gap-1.5">
                                    <div className="flex items-center gap-0.5">
                                        <StarIcon className='h-2.5 w-2.5' />
                                        <span className="font-semibold w-3">{5 - index}</span>
                                    </div>
                                    <div
                                        style={{
                                            width:
                                                reviews.filter((review) => review.rating === 5 - index).length > 0
                                                    ? `${(reviews.filter((review) => review.rating === 5 - index).length / reviews.length) * 100}%`
                                                    : '3px'
                                        }}
                                        className={`h-1 rounded-full ${colors[index]}`}
                                    ></div>
                                    <span>{reviews.filter((review) => review.rating === 5 - index).length}</span>
                                </div>
                            })}
                        </div>
                    </div>

                    {reviews.map((review) => (
                        <div key={review._id} className="py-4 border-t-2 border-stone-100">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-medium capitalize">{review.fullName}</h3>
                                    <p className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                            weekday: 'long', // Day of the week
                                            year: 'numeric', // Year in numeric format
                                            month: 'long',   // Full month name
                                            day: 'numeric'   // Day of the month
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            className={`h-5 w-5 ${index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="mb-2">{review.comment}</p>
                            {review.images?.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {review.images.map((image, idx) => (
                                        <img
                                            key={idx}
                                            src={image}
                                            alt={`Review Image ${idx + 1}`}
                                            className="h-20 w-20 object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default ProductPage;