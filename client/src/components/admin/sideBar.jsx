import { useContext, createContext } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "../ui/button";
import { LayoutDashboard, X } from "lucide-react";

const SidebarContext = createContext()

export default function SideBar({ children, expanded, setExpanded }) {

    return (
        <aside className="px-2 py-1 side-nav h-screen w-fit fixed top-0 left-0 z-50 shadow bg-[#202939] text-white">
            <nav className="h-full flex flex-col bg-background">
                <div className="flex justify-between items-center">
                    <h1
                        className={`text-xl font-semibold overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
                    >
                        ADMIN
                    </h1>
                    <Button
                        variant='ghost'
                        onClick={() => setExpanded((curr) => !curr)}
                    >
                        {expanded ? <X /> : <LayoutDashboard />}
                    </Button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <div className="flex-1 mt-6">{children}</div>
                </SidebarContext.Provider>
            </nav>
        </aside>
    )
}

export function SidebarItem({ icon, text, location, alert }) {
    const { expanded } = useContext(SidebarContext)

    return (
        <NavLink
            to={location}
            className={`my-3 relative flex items-center justify-center font-medium rounded-md cursor-pointer transition-colors group`}
        >
            <div className={`p-1 group flex items-center gap-1 ${expanded ? "w-full" : "w-fit"} rounded hover:bg-blue-50 hover:text-blue-950`}>
                {icon}
                <span
                    className={`overflow-hidden transition-all ${expanded ? "pl-3" : "hidden"}`}
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
          card whitespace-nowrap absolute left-full px-2 py-1 ml-6
          bg-secondary text-primary text-sm
          invisible opacity-20 translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 bg-blue-950 text-white rounded`}
                >
                    {text}
                </div>
            )}
        </NavLink>
    )
}