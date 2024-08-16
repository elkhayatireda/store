import categoryColumns from "@/components/admin/categories/columns";
import { CategoriesTable } from "@/components/admin/categories/table";
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCategories } from '@/contexts/category';

function Categories() {
    const { data } = useCategories()

    return (
        <div>
            <div className='mb-6 flex justify-between items-center'>
                <div>
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <p className='text-sm'>Here you can manage the categories in your store</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-3 py-1.5 rounded bg-blue-950 text-white'
                    to={'/admin/categories/create'}
                >
                    Create <Plus size={18} />
                </Link>
            </div>
                <CategoriesTable columns={categoryColumns} data={data} />
        </div >
    );
}

export default Categories;




// import React, { useState, useEffect, useCallback } from 'react';
// import { axiosClient } from '@/api/axios';
// import { Button } from '@/components/ui/button';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
// import { Plus } from 'lucide-react';

// function Categories() {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);

//     const fetchCategories = useCallback(async (page = 1) => {
//         setLoading(true);
//         try {
//             const response = await axiosClient.get('/categories', {
//                 params: {
//                     page,
//                     limit: 8 // Limit of categories per page
//                 }
//             });
//             setCategories(prev => (page === 1 ? response.data.categories : [...prev, ...response.data.categories]));
//             setTotalPages(response.data.totalPages);
//         } catch (error) {
//             console.error(error);
//             toast.error('Error fetching categories');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchCategories(currentPage);
//     }, [fetchCategories, currentPage]);

//     const handleSelectChange = (id) => (event) => {
//         setSelectedCategories((prev) => {
//             if (event.target.checked) {
//                 return [...prev, id];
//             } else {
//                 return prev.filter((categoryId) => categoryId !== id);
//             }
//         });
//     };

//     const handleDeleteSelected = async () => {
//         if (window.confirm('Are you sure you want to delete the selected categories?')) {
//             try {
//                 await axiosClient.delete('/categories', {
//                     data: { ids: selectedCategories }
//                 });
//                 setCategories(categories.filter((category) => !selectedCategories.includes(category._id)));
//                 setSelectedCategories([]);
//                 toast.success('Categories deleted');
//             } catch (error) {
//                 console.error(error);
//                 toast.error('Failed to delete categories');
//             }
//         }
//     };

//     const handleLoadMore = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(prevPage => prevPage + 1);
//         }
//     };

//     const handleScroll = (event) => {
//         const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
//         if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
//             handleLoadMore();
//         }
//     };

//     return (
//         <div className="container mx-auto p-6" onScroll={handleScroll}>
//             <div className='mb-6 flex justify-between items-center'>
//                 <div>
//                     <h2 className="text-2xl font-semibold">Categories</h2>
//                     <p className='text-sm'>Here you can manage the categories in your store</p>
//                 </div>
//                 <Link
//                     className='flex items-center gap-1 px-3 py-1.5 rounded bg-blue-950 text-white'
//                     to={'/admin/categories/create'}
//                 >
//                     Create <Plus size={18} />
//                 </Link>
//             </div>

//             {selectedCategories.length > 0 && (
//                 <div className='mb-6'>
//                     <Button
//                         variant='destructive'
//                         className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//                         onClick={handleDeleteSelected}
//                     >
//                         Delete Selected
//                     </Button>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {categories.map((category) => (
//                     <div key={category._id} className="bg-white shadow-md rounded-lg overflow-hidden">
//                         <img
//                             src={category.imgPath}
//                             alt={category.title}
//                             className="w-full h-48 object-cover aspect-square"
//                         />
//                         <div className="p-4">
//                             <h3 className="text-lg font-medium">{category.title}</h3>
//                             <p className="text-xs text-gray-600 mb-4">{category.description}</p>
//                             <div className='flex items-center gap-2'>
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedCategories.includes(category._id)}
//                                     onChange={handleSelectChange(category._id)}
//                                 />
//                                 <Link
//                                     className='px-3 py-2 rounded bg-blue-600 text-white'
//                                     to={'/admin/categories/' + category._id}
//                                 >
//                                     Update
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {loading && <p className="text-center mt-4">Loading...</p>}

//             {!loading && currentPage < totalPages && (
//                 <div className="text-center mt-4">
//                     <Button
//                         onClick={handleLoadMore}
//                         className="text-blue-600 underline"
//                     >
//                         Load More
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Categories;