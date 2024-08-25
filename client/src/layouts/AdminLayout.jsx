import { Outlet } from "react-router-dom";
import SideBar, { SidebarItem } from "@/components/admin/sideBar";
import {
    MessageSquareText  ,
    MessageSquare ,
    Users,
    BarChart,
    ShoppingCart ,
    Shapes ,
    Package,
    Tag ,
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
                <SidebarItem icon={<BarChart size={21} />} text={'Dashboard'} location={"/admin/dashboard"} />
                <SidebarItem icon={<Package size={21} />} text={'Products'} location={"/admin/products"} />
                <SidebarItem icon={<ShoppingCart  size={21} />} text={'Orders'} location={"/admin/orders"} />
                <SidebarItem icon={<Shapes  size={21} />} text={'Categories'} location={"/admin/categories"} />
                <SidebarItem icon={<MessageSquareText    size={21} />} text={'Reviews'} location={"/admin/reviews"} />
                <SidebarItem icon={<Tag  size={21} />} text={'Coupons'} location={"/admin/coupons"} />
                <SidebarItem icon={<Users size={21} />} text={'Customers'} location={"/admin/customers"} />
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