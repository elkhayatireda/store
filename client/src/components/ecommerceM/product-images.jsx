import { useEffect, useState } from "react";
import { X } from "lucide-react"; // Importing the X icon from Lucide
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

function ProductImages({ selectedImage, setSelectedImage, images, title }) {
    const [api, setApi] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Scroll to the selected image when selectedImage changes
    useEffect(() => {
        if (api && selectedImage) {
            const selectedIndex = images.indexOf(selectedImage);
            if (selectedIndex !== -1) {
                api.scrollTo(selectedIndex);
            }
        }
    }, [selectedImage, api, images]);

    // Update selectedImage when the carousel scrolls to a new item
    useEffect(() => {
        if (api) {
            const onScroll = () => {
                const selectedIndex = api.selectedScrollSnap();
                setSelectedImage(images[selectedIndex]);
            };

            api.on("scroll", onScroll);

            // Cleanup listener on component unmount
            return () => {
                api.off("scroll", onScroll);
            };
        }
    }, [api, images, setSelectedImage]);

    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    const handleImageClick = () => {
        setIsFullScreen(true); // Open the full-screen modal
    };

    const closeFullScreen = () => {
        setIsFullScreen(false); // Close the full-screen modal
    };

    return (
        <div className="sm:px-10 w-full md:w-1/2">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                setApi={setApi}
            >
                <CarouselContent>
                    {images?.map((image, index) => (
                        <CarouselItem key={image + index}>
                            <img
                                src={image}
                                alt={title}
                                onClick={handleImageClick} // Open full-screen on image click
                                className="w-full h-auto object-cover rounded-lg shadow-md cursor-pointer"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <div className="grid grid-cols-5 gap-2 mt-4">
                {images?.map((image, index) => (
                    <label key={index + image} className={`relative cursor-pointer p-1 rounded ${selectedImage === image ? "border-2 border-black" : ""}`}>
                        <input
                            type="radio"
                            name="image"
                            value={image}
                            className="sr-only"
                            checked={selectedImage === image}
                            onChange={() => handleImageSelect(image)}
                        />
                        <img
                            src={image}
                            alt={title}
                            className="aspect-square object-cover rounded shadow-md"
                        />
                    </label>
                ))}
            </div>

            {/* Full-Screen Modal */}
            {isFullScreen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
                    <button
                        onClick={closeFullScreen}
                        className="absolute top-5 right-5 text-white"
                    >
                        <X size={32} />
                    </button>
                    <Carousel
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {images?.map((image, index) => (
                                <CarouselItem key={image + index + 'full'}>
                                    <img
                                        src={image}
                                        alt={title}
                                        className="mx-auto w-[60%] object-cover rounded"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}
        </div>
    );
}

export default ProductImages;
