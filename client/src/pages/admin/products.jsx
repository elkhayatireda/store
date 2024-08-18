import productColumns from "@/components/admin/products/columns";
import { ProductsTable } from "@/components/admin/products/table";
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useProducts } from '@/contexts/product';

function Products() {
    const { data } = useProducts()

    return (
        <div>
            <div className=' flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className="text-2xl font-semibold">Products</h2>
                    <p className='text-sm'>Here you can manage the products in your store</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-3 py-1.5 rounded bg-blue-950 text-white'
                    to={'/admin/products/add'}
                >
                    New Product  <Plus size={18} />
                </Link>
            </div>
                <ProductsTable columns={productColumns} data={data} />
        </div >
    );
}

export default Products;