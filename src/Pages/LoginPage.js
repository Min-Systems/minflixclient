import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from '../Components/AuthenticationForm';
import styles from '../Styling/LoginPage.css';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';

/*
  This page allows the user to login
*/
const LoginPage = () => {
    const navigate = useNavigate();

    return (
     <GradientBackground>
      <div className='wrapper'>
        <h1 className='minflix'> MinFlix</h1>
        <h1>Login </h1>
          <AuthenticationForm isLogin={true} />
        <div className = 'register-link'>
        <p className = 'register-link'> Dont have an account?
          <ActionButton label='Register' onClick={() => {navigate('/register')}}/>
        </p>
        </div>
      </div>
     </GradientBackground>
    );
}

export default LoginPage;