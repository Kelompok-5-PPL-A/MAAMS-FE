import { useState } from "react";
import Login from "../login";
import Register from "../register";
import poto from "/";

const Auth: React.FC = () => {
  const [form, setForm] = useState<"Login" | "Register">("Login");

  const showLoginForm = () => {
    setForm("Login");
  };

  const showRegisterForm = () => {
    setForm("Register");
  };

  return (
    <div className="bg-slate-100 h-screen w-full flex items-center justify-center ">
      <div className="max-w-xl w-full flex flex-col items-center justify-center ">
        {/* Your Logo */}
        <a href="#" className="mb-6">
          <img src={poto.src} className="h-318 w-318" alt="Maams Auth" />
        </a>
        {/* Conditional Rendering for Login/Register */}
        {form === "Login" ? (
          <Login showRegisterForm={showRegisterForm} />
        ) : (
          <Register showLoginForm={showLoginForm} />
        )}
      </div>
    </div>
  );
};
export default Auth;