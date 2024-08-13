import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../pages/loading";

export default function AdminAuthRoute({ children }) {
    const {
        getAdmin,
        isLoggedIn,
        isFetchingUser,
        setCurrentLocation,  
    } = useContext(authContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        setCurrentLocation(window.location.pathname);
        if (!isLoggedIn && localStorage.getItem('token') != null )  {
            getAdmin();
        } else if (!isLoggedIn && !isFetchingUser) {
            navigate('/admin/login');
        }
    }, [isLoggedIn,isFetchingUser]);
  
    return ( !isFetchingUser && isLoggedIn ) ? children : <LoadingPage />;
}
