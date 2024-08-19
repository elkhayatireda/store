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
import Categories from '@/pages/admin/categories';
import Products from '@/pages/admin/products';
import { CategoriesProvider } from '@/contexts/category';
import { ProductsProvider } from '@/contexts/product';
import AddOrder from '@/pages/admin/add-order';
import { OrdersProvider } from '@/contexts/order';
import Orders from '@/pages/admin/orders';
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
                path: "/admin/products/add",
                element: <AdminAddProduct />
            },
            {
                path: "/admin/products",
                element: <ProductsProvider><Products /></ProductsProvider>
            },
            {
                path: "/admin/orders/add",
                element: <AddOrder />
            },
            {
                path: "/admin/orders",
                element: <OrdersProvider><Orders /></OrdersProvider>
            },
        ]
    },
    {
        path: '*',
        element: <h1>heyyyyyy</h1>

    }
])