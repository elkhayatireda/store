import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Menu } from 'lucide-react'; // Importing icons from Lucid
import { Outlet } from "react-router-dom";

function GuestLayout() {
    return (
        <>
            <Navbar />
            <main className="bg-white mt-[72px] min-h-screen">
                <Outlet />
            </main>
            <footer className='mt-10 p-4 text-center border-t'>
                <h2 className='text-xl font-semibold text-gray-800'>YourLogo</h2>
                <p className='text-sm text-gray-500'>all rights reserved, 2024</p>
            </footer>
        </>
    );
}

function Navbar() {
    return (
        <nav className="fixed left-0 right-0 top-0 bg-white shadow-sm px-4 py-3 flex justify-between items-center z-10">
            {/* Hamburger Menu */}
            <Button variant='ghost' className="text-gray-700">
                <Menu size={24} />
            </Button>

            {/* Logo in the Middle */}
            <div className="flex-grow flex justify-center">
                <h1 className="text-2xl font-bold text-gray-800">YourLogo</h1>
            </div>

            {/* Icons (Search and Cart) */}
            <div className="flex items-center gap-2">
                <Button variant='ghost' className="text-gray-700">
                    <Search size={24} />
                </Button>
                <Button variant='ghost' className="text-gray-700">
                    <ShoppingCart size={24} />
                </Button>
            </div>
        </nav >
    );
}

export default GuestLayout;