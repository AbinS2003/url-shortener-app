import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const checkAuth = (Component) => {
  function Wrapper(props) {
    const user = useSelector((store) => store.auth.user);
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
      if (!user) {
        navigate("/login");
      } else {
        setCheckingAuth(false);
      }
    }, [user, navigate]);

    if (checkingAuth) return null; 

    return <Component {...props} />;
  }

  return Wrapper;
};

export default checkAuth;
