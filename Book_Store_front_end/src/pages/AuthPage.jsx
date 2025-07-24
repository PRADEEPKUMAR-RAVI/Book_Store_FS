import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import '../components/css/Auth.css'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(prev => !prev);

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {isLogin ? <LoginForm /> : <RegisterForm />}

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={toggleMode} className="switch-button">
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
