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
    const [isHoverEnabled, setIsHoverEnabled] = useState(true);

    // Sidebar width, adjust according to your sidebar's width
    const sidebarWidth = !isHoverEnabled ? '100px' : '0px';

    return (
        <>
            <TopNav />
            <SideBar
                expanded={expanded}
                setExpanded={setExpanded}
                isHoverEnabled={isHoverEnabled}
                setIsHoverEnabled={setIsHoverEnabled}
            >
                <SidebarItem icon={<BarChart />} text={'Dashboard'} location={"/admin/dashboard"} />
                <SidebarItem icon={<Users />} text={'Clients'} location={"/admin/clients"} />
                <SidebarItem icon={<Headset />} text={'Employees'} location={"/admin/employees"} />
                <SidebarItem icon={<Headset />} text={'Contacts'} location={"/admin/contacts"} />
                <SidebarItem icon={<Settings />} text={'Settings'} location={"/admin/settings"} />
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