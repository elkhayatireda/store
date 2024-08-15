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
                element: <h1>tttttt</h1>
            },
            {
                path: "/admin/products/add",
                element: <AdminAddProduct />
            },
        ]
    },
    {
        path: '*',
        element: <h1>heyyyyyy</h1>

    }
])