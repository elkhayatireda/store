import { Outlet } from "react-router-dom";

function GuestLayout() {

    return (
        <div className="">
            <main className="">
                <Outlet />
            </main>          
        </div>
    );
}

export default GuestLayout;