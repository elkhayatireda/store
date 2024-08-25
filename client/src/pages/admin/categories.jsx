import categoryColumns from "@/components/admin/categories/columns";
import { CategoriesTable } from "@/components/admin/categories/table";
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCategories } from '@/contexts/category';

function Categories() {
    const { data } = useCategories()

    return (
        <div>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <p className='text-sm'>Here you can manage the categories in your store</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-white'
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