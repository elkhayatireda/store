import { useContext, createContext } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "../ui/button"
import { Menu, X } from "lucide-react"

const SidebarContext = createContext()

export default function SideBar({ children, expanded, setExpanded, isHoverEnabled, setIsHoverEnabled }) {
    const handleMenuClick = () => {
        setExpanded((curr) => !curr);
        setIsHoverEnabled((curr) => !curr);
    };

    return (
        <aside className="side-nav h-screen w-fit fixed top-0 left-0 z-50 shadow bg-white">
            <nav className="h-full flex flex-col bg-background">
                <div className="p-4 flex justify-between items-center">
                    <Button onClick={handleMenuClick}>
                        {!isHoverEnabled ? <X /> : <Menu />}
                    </Button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <div
                        onMouseEnter={() => isHoverEnabled && setExpanded(true)}
                        onMouseLeave={() => isHoverEnabled && setExpanded(false)}
                        className="flex-1 px-3 pt-5"
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

            className={`
        relative flex items-center ${expanded ? 'justify-start' : 'justify-center'} p-2 
        font-medium rounded-md cursor-pointer
        transition-colors group  text-gray-100 `}
        >
            <div className={`group flex items-center p-2 w-36 ${expanded ? "w-36" : "w-fit"} rounded hover:bg-[#edf3ff] `}>
                {icon}
                <span
                    className={`overflow-hidden transition-all ${expanded ? "pl-3" : "hidden"} text-[#222222]`}
                >
                    {text}
                </span>
            </div>
            {/* alert is for notifications */}
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-primary ${expanded ? "" : "top-2"}`}
                />
            )}

            {!expanded && (
                <div
                    className={`
          whitespace-nowrap absolute left-full px-2 py-1 ml-6
          bg-secondary text-primary text-sm
          invisible opacity-20 translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0   rounded`}
                >
                    {text}
                </div>
            )}
        </NavLink>
    )
}