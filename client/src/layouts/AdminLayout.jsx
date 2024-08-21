import { Outlet } from "react-router-dom";
import SideBar, { SidebarItem } from "@/components/admin/sideBar";
import {
    Settings,
    Headset,
    Users,
    BarChart,
    ShoppingBag,
    Folder,
    Box,
} from 'lucide-react';
import TopNav from "../components/admin/TopNav";
import { useState } from "react";

function AdminLayout() {
    const [expanded, setExpanded] = useState(false);

    // Sidebar width, adjust according to your sidebar's width
    const sidebarWidth = expanded ? '200px' : '75px';

    return (
        <>
            <TopNav />
            <SideBar
                expanded={expanded}
                setExpanded={setExpanded}
            >
                <SidebarItem icon={<BarChart size={22} />} text={'Dashboard'} location={"/admin/dashboard"} />
                <SidebarItem icon={<Folder size={22} />} text={'Categories'} location={"/admin/categories"} />
                <SidebarItem icon={<Box size={22} />} text={'Products'} location={"/admin/products"} />
                <SidebarItem icon={<ShoppingBag size={22} />} text={'Orders'} location={"/admin/orders"} />
                <SidebarItem icon={<Users size={22} />} text={'Customers'} location={"/admin/customers"} />
            </SideBar>
            <main
                className="transition-all duration-300 pb-4 pr-3"
                style={{ marginLeft: sidebarWidth, marginTop: '5rem' }} // Adjusts the margin-left based on sidebar's state
            >
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;