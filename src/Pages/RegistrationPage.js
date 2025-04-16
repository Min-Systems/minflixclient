import React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from '../Components/AuthenticationForm'
import GradientBackground from "../Components/GradientBackground";

const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
      <GradientBackground>
         <div className="wrapper">
            <h1 className="minflix"> MinFlix</h1>
            <h1>Register</h1> 
                <AuthenticationForm isLogin={false} />
            <div className="register-link">
              <p> Already have an account?
                <a href="/"> Login </a>
              </p>
            </div>
         </div>
       </GradientBackground>


    );
};

export default RegistrationPage;