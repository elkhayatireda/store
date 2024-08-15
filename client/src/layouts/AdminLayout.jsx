import { Outlet } from "react-router-dom";
import SideBar, { SidebarItem } from "@/components/admin/sideBar";
import {
    Settings,
    Headset,
    Users,
    BarChart,
} from 'lucide-react';
import TopNav from "../components/admin/TopNav";
import { useState } from "react";

function AdminLayout() {
    const [expanded, setExpanded] = useState(false);

    // Sidebar width, adjust according to your sidebar's width
    const sidebarWidth = expanded ? '190px' : '65px';

    return (
        <>
            <TopNav />
            <SideBar
                expanded={expanded}
                setExpanded={setExpanded}
            >
                <SidebarItem icon={<BarChart size={22} />} text={'Dashboard'} location={"/admin/dashboard"} />
                <SidebarItem icon={<Users size={22} />} text={'Clients'} location={"/admin/clients"} />
                <SidebarItem icon={<Headset size={22} />} text={'Employees'} location={"/admin/employees"} />
                <SidebarItem icon={<Headset size={22} />} text={'Contacts'} location={"/admin/contacts"} />
                <SidebarItem icon={<Settings size={22} />} text={'Settings'} location={"/admin/settings"} />
            </SideBar>
            <main
                className="transition-all duration-300 pb-4 pr-3"
                style={{ marginLeft: sidebarWidth, marginTop: '4.5rem' }} // Adjusts the margin-left based on sidebar's state
            >
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;