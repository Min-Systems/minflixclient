import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";

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