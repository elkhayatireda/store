import { createContext, useState } from "react";
import { axiosClient } from "../api/axios";

export const authContext = createContext({
    isFetchingUser: false,
    setIsFetchingUser: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    user: {},
    setUser: () => { },
    getEmployee: () => { },
    getAdmin: () => { },
    role: "",
    setRole: () => {},
    currentLocation: "",
    setCurrentLocation: () => {}
})

export function AuthWrapper({ children }) {
    const [isFetchingUser, setIsFetchingUser] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const [role, setRole] = useState("guest")
    const [currentLocation, setCurrentLocation] = useState(null)
    

    const getEmployee = async () => {
        try {
            setIsFetchingUser(true);
            const response = await axiosClient.get('http://localhost:5555/employee/get');
            setUser(response.data.user);
            setIsLoggedIn(true);
            setIsFetchingUser(false);
        } catch (err) {
            setIsLoggedIn(false);
            setUser({});
            localStorage.removeItem('token');
            localStorage.removeItem('employee');

        }  finally {
            setIsFetchingUser(false);
        }
    };
    const getAdmin = async () => {
        try {
            setIsFetchingUser(true);
            const response = await axiosClient.get('http://localhost:5555/api/admin');
            setUser(response.data.user);
            setIsLoggedIn(true);
            setIsFetchingUser(false);
        } catch (err) {
            setIsLoggedIn(false);
            setUser({});
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
        }  finally {
            setIsFetchingUser(false);
        }
    };
    

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            setIsLoggedIn(false);
            setUser({});
        } catch (err) {
            console.error("error logging out: ", err);
        }
    };

    return <>
        <authContext.Provider value={{
            isFetchingUser, setIsFetchingUser,
            user, setUser,
            getEmployee,
            getAdmin,
            isLoggedIn, setIsLoggedIn,
            logout , 
            role, setRole,
            currentLocation , setCurrentLocation,
        }}>
            {children}
        </authContext.Provider>
    </>
}