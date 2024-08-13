import {
    createBrowserRouter
} from 'react-router-dom';

// layouts 
import AdminLayout from '../layouts/AdminLayout';
import HostLayout from '../layouts/HostLayout';

// protectors 
import AdminAuthRoute from './protectors/AdminAuthRoute';

// pages
import AdminDashboard from '@/pages/admin/dashboard';

// router
export const router = createBrowserRouter([
    {
        element: <HostLayout />,
        children: [
            {
                path: "/admin/login",
                element: <h1>tttttt</h1>
            },
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: "/admin/dashboard",
                element: <AdminDashboard />
            },
        ]
    },
    {
        path: '*',
        element: <h1>heyyyyyy</h1>

    }
])