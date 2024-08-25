import {
    createBrowserRouter
} from 'react-router-dom';

// layouts 
import AdminLayout from '../layouts/AdminLayout';
import HostLayout from '../layouts/HostLayout';

// protectors 
import AdminAuthRoute from './protectors/AdminAuthRoute';
// pages
// import AdminDashboard from '@/pages/admin/dashboard';
import AdminSingnIn from '@/pages/admin/signin';
import AdminAddProduct from '@/pages/admin/add-product';
import CategoryForm from '@/pages/admin/category';
import ProductUpdate from '@/pages/admin/update-product';
import ReviewUpdate from '@/pages/admin/update-review';
import CouponUpdate from '@/pages/admin/update-coupon';
import Categories from '@/pages/admin/categories';
import Products from '@/pages/admin/products';
import { CategoriesProvider } from '@/contexts/category';
import { ProductsProvider } from '@/contexts/product';
import AddOrder from '@/pages/admin/add-order';
import { OrdersProvider } from '@/contexts/order';
import Orders from '@/pages/admin/orders';
import Customers from '@/pages/admin/customers';
import { CustomersProvider } from '@/contexts/customer';
import CreateOrder from '@/pages/admin/add-review';
import CreateCoupon from '@/pages/admin/add-coupon';
import Reviews from '@/pages/admin/reviews';
import Coupons from '@/pages/admin/coupons';
import { ReviewsProvider } from '@/contexts/review';
import { CouponsProvider } from '@/contexts/coupon';
// router
export const router = createBrowserRouter([
    {
        element: <HostLayout />,
        children: [
            {
                path: "/admin/login",
                element: <AdminSingnIn />
            },
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: "/admin/dashboard",
                element: <div>dashboard</div>
            },
            {
                path: "/admin/categories",
                element: <CategoriesProvider><Categories /></CategoriesProvider>
            },
            {
                path: "/admin/categories/:id",
                element: <CategoryForm />
            },
            {
                path: "/admin/products/create",
                element: <AdminAddProduct />
            },
            {
                path: "/admin/products",
                element: <ProductsProvider><Products /></ProductsProvider>
            },
            {
                path: "/admin/orders/:id",
                element: <CustomersProvider><AddOrder /></CustomersProvider>
            },
            {
                path: "/admin/orders",
                element: <OrdersProvider><Orders /></OrdersProvider>
            },
            {
                path: "/admin/reviews",
                element: <ReviewsProvider><Reviews /></ReviewsProvider>
            },
            {
                path: "/admin/reviews/create",
                element: <CreateOrder />
            },
            {
                path: "/admin/coupons/create",
                element: <CreateCoupon />
            },
            {
                path: "/admin/products/update/:id",
                element: <ProductUpdate />
            },
            {
                path: "/admin/customers",
                element: <CustomersProvider><Customers /></CustomersProvider>
            },
            {
                path: "/admin/reviews/update/:id",
                element: <ReviewUpdate />
            },
            {
                path: "/admin/coupons/update/:id",
                element: <CouponUpdate />
            },
            {
                path: "/admin/coupons",
                element: <CouponsProvider><Coupons /></CouponsProvider>
            },
        ]
    },
    {
        path: '*',
        element: <h1>404, page not found</h1>

    }
])