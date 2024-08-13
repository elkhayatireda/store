import { Outlet } from "react-router-dom";
import SideBar, { SidebarItem } from "@/components/admin/sideBar";
import 
{ 
    LayoutDashboard,
    Box   ,
    PanelsTopLeft   ,
    Clapperboard  ,
    SquarePlay   ,
    Wallet  ,
    Settings ,
    UserPlus   ,
    Headset ,
    Users ,
 } from 'lucide-react';
import TopNav from "../components/admin/TopNav";


function AdminLayout() {
    return (
        <>
          <TopNav />
           <SideBar>
                <SidebarItem icon={<LayoutDashboard color="#222222" size={22} />} text={'Dashboard'} location={"/admin/dashboard"} />
                <SidebarItem icon={<Users       color="#222222" size={22}/>} text={'clients'} location={"/admin/clients"} />
                <SidebarItem icon={<Headset        color="#222222" size={22}/>} text={'employees'} location={"/admin/employees"} />
                <SidebarItem icon={<Headset        color="#222222" size={22}/>} text={'contacts'} location={"/admin/contacts"} />
                <SidebarItem icon={<Settings      color="#222222" size={22}/>} text={'settings'} location={"/admin/settings"} />
            </SideBar>
            <main className="bg-[#fbfcff]">
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;