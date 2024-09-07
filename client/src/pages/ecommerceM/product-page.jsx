import { axiosClient } from "@/api/axios";
import CustomInput from "@/components/custom/CustomInput";
import ProductImages from "@/components/ecommerceM/product-images";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
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
                if (response.data.isVariant) {
                    const response2 = await axiosClient.get(`/products/variants/${id}`);
                    setVariants(response2.data);
                    const response3 = await axiosClient.get(`/products/combinations/${id}`);
                    setCombinations(response3.data);
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
        setQuantity(event.target.value);
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

                    <label className="text-lg font-medium">Quantity:</label>
                    <div className="mb-2 flex flex-col sm:flex-row items-center sm:gap-5">
                        <div className="flex items-center gap-0.5">
                            <Button
                                variant='ghost'
                                onClick={() => { quantity > 1 && setQuantity(prev => prev - 1) }}
                                disabled={quantity <= 1}
                            >
                                <MinusIcon />
                            </Button>
                            <CustomInput
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                            <Button
                                variant='ghost'
                                onClick={() => { setQuantity(prev => prev + 1) }}
                            >
                                <PlusIcon />
                            </Button>
                        </div>
                        <Button
                            onClick={() => {
                                console.log(selectedCombination);
                            }}
                            className="w-full bg-black hover:bg-black hover:opacity-90 active:opacity-80"
                        >
                            Add to Cart
                        </Button>
                    </div>
                    <Button
                        className="w-full bg-black hover:bg-black hover:opacity-90 active:opacity-80"
                    >
                        Order now
                    </Button>
                </div>
            </div>
            {/* Product Description */}
            <div
                className="sm:px-10 mt-10"
                dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
        </div>
    );
}

export default ProductPage;