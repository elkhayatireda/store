import reviewColumns from "@/components/admin/reviews/columns";
import { ReviewsTable } from "@/components/admin/reviews/table";
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useReviews } from '@/contexts/review';

function Reviews() {
    const { data } = useReviews()

    return (
        <div>
            <div className=' flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className="text-2xl font-semibold">Reviews</h2>
                    <p className='text-sm'>Here you can manage the reviews in your store</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-3 py-1.5 rounded bg-green-500 text-white'
                    to={'/admin/reviews/create'}
                >
                    New Review  <Plus size={18} />
                </Link>
            </div>
                <ReviewsTable columns={reviewColumns} data={data} />
        </div >
    );
}

export default Reviews;