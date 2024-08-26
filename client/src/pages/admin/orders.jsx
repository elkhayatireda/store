import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { OrdersTable } from '@/components/admin/orders/table';
import orderColumns from '@/components/admin/orders/columns';
import { useOrders } from '@/contexts/order';

function Orders() {
    const { data } = useOrders()

    return (
        <div>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className="text-2xl font-semibold">Orders</h2>
                    <p className='text-sm'>Here you can manage the orders of your clients</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-white'
                    to={'/admin/orders/add'}
                >
                    Create <Plus size={18} />
                </Link>
            </div>
            <p className='mt-2 text-sm'>Info: <span className='text-red-500'>red phone number</span> means client is in blacklist</p>
            <OrdersTable columns={orderColumns} data={data} />
        </div >
    );
}

export default Orders;