import { useContext, createContext } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "../ui/button"
import { LayoutDashboard, Menu, X } from "lucide-react"

const SidebarContext = createContext()

export default function SideBar({ children, expanded, setExpanded, isHoverEnabled, setIsHoverEnabled }) {
    const handleMenuClick = () => {
        setExpanded((curr) => !curr);
        setIsHoverEnabled((curr) => !curr);
    };

    return (
        <aside className="side-nav p-2 h-screen w-fit fixed top-0 left-0 z-50 bg-[#202939] text-white">
            <nav className="h-full flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    {
                        expanded && <h1 className="font-bold text-2xl">ADMIN</h1>
                    }
                    <Button onClick={handleMenuClick} className={`${!isHoverEnabled ? 'p-0' : 'p-2'}`}>
                        {!isHoverEnabled ? <X /> : expanded ? '' : <LayoutDashboard />}
                    </Button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <div
                        onMouseEnter={() => isHoverEnabled && setExpanded(true)}
                        onMouseLeave={() => isHoverEnabled && setExpanded(false)}
                        className="flex-1"
                    >
                        {children}
                    </div>
                </SidebarContext.Provider>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, location, alert }) {
    const { expanded } = useContext(SidebarContext)

    return (
        <NavLink
            to={location}
            className={`my-2 flex justify-center items-center font-medium rounded-md cursor-pointer transition-all`}
        >
            <div className={`p-2 group flex items-center gap-2 w-36 ${expanded ? "w-36" : "w-fit"} rounded hover:bg-[#000080] transition-all`}>
                {icon}
                {expanded && (
                    <div
                        className={`whitespace-nowrap font-light`}
                    >
                        {text}
                    </div>
                )}
            </div>
            {/* alert is for notifications */}
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-primary ${expanded ? "" : "top-2"}`}
                />
            )}
        </NavLink>
    )
}