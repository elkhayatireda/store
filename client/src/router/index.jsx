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
        element: <AdminAuthRoute><AdminLayout /></AdminAuthRoute>,
        children: [
            {
                path: "/admin/dashboard",
                element: <h1>tttttt</h1>
            },
        ]
    },
    {
        path: '*',
        element: <h1>heyyyyyy </h1>

    }
])