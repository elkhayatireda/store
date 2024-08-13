import { Outlet } from "react-router-dom";
import SideBar, { SidebarItem } from "@/components/admin/sideBar";
import {
    LayoutDashboard,
    Settings,
    Headset,
    Users,
} from 'lucide-react';
import TopNav from "../components/admin/TopNav";
import { useState } from "react";

function AdminLayout() {
    const [expanded, setExpanded] = useState(false);
    const [isHoverEnabled, setIsHoverEnabled] = useState(true);

    // Sidebar width, adjust according to your sidebar's width
    const sidebarWidth = expanded ? '100px' : '0px';

    return (
        <>
            <TopNav />
            <SideBar
                expanded={expanded}
                setExpanded={setExpanded}
                isHoverEnabled={isHoverEnabled}
                setIsHoverEnabled={setIsHoverEnabled}
            >
                <SidebarItem icon={<LayoutDashboard color="#222222" size={22} />} text={'Dashboard'} location={"/admin/dashboard"} />
                <SidebarItem icon={<Users color="#222222" size={22} />} text={'Clients'} location={"/admin/clients"} />
                <SidebarItem icon={<Headset color="#222222" size={22} />} text={'Employees'} location={"/admin/employees"} />
                <SidebarItem icon={<Headset color="#222222" size={22} />} text={'Contacts'} location={"/admin/contacts"} />
                <SidebarItem icon={<Settings color="#222222" size={22} />} text={'Settings'} location={"/admin/settings"} />
            </SideBar>
            <main
                className="bg-[#fbfcff] transition-all duration-300"
                style={{ marginLeft: sidebarWidth }} // Adjusts the margin-left based on sidebar's state
            >
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;