import couponColumns from "@/components/admin/coupons/columns";
import { CouponsTable } from "@/components/admin/coupons/table";
import { Link } from 'react-router-dom';
import { CirclePlus  } from 'lucide-react';
import { useCoupons } from '@/contexts/coupon';

function Coupons() {
    const { data } = useCoupons()

    return (
        <div>
            <div className=' flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className="text-2xl font-semibold">Coupons</h2>
                    <p className='text-sm'>Here you can manage the coupons in your store</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-4 py-2 rounded bg-green-500 text-white font-semibold'
                    to={'/admin/coupons/create'}
                >
                    New Coupon  <CirclePlus  size={20}  color="white"/>
                </Link>
            </div>
                <CouponsTable columns={couponColumns} data={data} />
        </div >
    );
}

export default Coupons;