import React from "react";
import { useNavigate } from "react-router";
import AuthenticationForm from '../Components/AuthenticationForm'
import GradientBackground from "../Components/GradientBackground";
import ActionButton from "../Components/ActionButton";

/*
  This is the page that allows a user to register an account
*/
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
                <ActionButton label='Login' onClick={() => {navigate('/')}}/>
              </p>
            </div>
         </div>
       </GradientBackground>
    );
};

export default RegistrationPage;