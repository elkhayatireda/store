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
import Categories from '@/pages/admin/categories';
import Products from '@/pages/admin/products';
import { CategoriesProvider } from '@/contexts/category';
import { ProductsProvider } from '@/contexts/product';
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
                path: "/admin/products/update/:id",
                element: <ProductUpdate />
            },
        ]
    },
    {
        path: '*',
        element: <h1>heyyyyyy</h1>

    }
])