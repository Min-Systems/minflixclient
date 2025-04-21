import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";

/*
  This button will log a user out of the webapp
  It does this by removing the session token from local memory, then navigating to the login page
*/
const LogoutButton = () => {
    const navigate = useNavigate();

    return (
        <div>
            <ActionButton label="Logout" id="logoutButton" onClick={() => {
                // remove info from session
                localStorage.clear();
                // navigate back to login
                navigate("/");
            }} />
        </div>
    );
};

export default LogoutButton;