import { useRef, useState, useEffect } from "react";
import maams from "../../assets/maams.png"
import MainLayout from "layout/MainLayout";

const Register: React.FC = () => {
  // handling pw dan email best format
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  // Referensi untuk field username, email, password, dan confirm password
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // State untuk menyimpan dan mengelola input username
  const [username, setUsername] = useState("");
  const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
  const [errUsername, setErrUsername] = useState<string | null>();
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);

  // State untuk menyimpan dan mengelola inpu email
  const [userEmail, setuserEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [errMail, setErrMail] = useState<string | null>();
  const [userEmailFocus, setuserEmailFocus] = useState<boolean>(false);

  // State untuk menyimpan dan mengelola input password
  const [password, setpassword] = useState("");
  const [isValidPassword, setisValidPassword] = useState<boolean>(false);
  const [errPassword, setErrPasswortd] = useState<string | null>();
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  // State untuk menyimpan dan mengelola input confirmpassword
  const [confirmpassword, setConfirmpassword] = useState("");
  const [isValidConfirmpassword, setIsValidConfirmpassword] = useState<boolean>(false);
  const [errConfirmpassword, setErrConfirmpassword] = useState<string | null>();
  const [confirmpasswordFocus, setConfirmpasswordFocus] = useState<boolean>(false);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const isValidUsername = true;
    setIsValidUsername(true);
  }, [username]);
  useEffect(() => {
    const isValidEmail = regexEmail.test(userEmail);
    setIsValidEmail(isValidEmail);
  }, [userEmail]);

  useEffect(() => {
    const isValidPassword = regexPassword.test(password);
    setisValidPassword(isValidPassword);
  }, [password]);

  useEffect(() => {
    const isValidConfirmpassword = regexPassword.test(confirmpassword);
    setIsValidConfirmpassword(isValidConfirmpassword);
  }, [confirmpassword]);

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUsername(value);
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setuserEmail(value);
  };

  const handlepasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setpassword(value);
  };

  const handleConfirmpasswordInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setConfirmpassword(value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    setErrUsername(isValidUsername ? null : "Invalid Username");
    setErrMail(isValidEmail ? null : "Invalid email");
    setErrPasswortd(isValidPassword ? null : "Invalid password");
    setErrConfirmpassword(
      isValidConfirmpassword ? null : "Invalid confirmation password"
    );

  };

  return (
    <MainLayout>
          <a href="#" className="mb-6 flex items-center justify-center">
            <img src={maams.src} className="h-318 w-318" alt="Maams Auth" />
          </a>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto lg:max-w-xl">
            <h1 className="text-2xl font-extrabold mb-4 text-center mt-7 mb-7">Buat Akun</h1>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-3">
                Username
              </label>
              <input
                type="text"
                id="username"
                autoComplete="off"
                placeholder="Username..."
                onChange={(e) => handleUsernameInput(e)}
                required
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
                ref={usernameRef}
                className={`w-full px-3 py-3 border ${
                  usernameFocus ? "border-blue-500" : "border-gray-300"
                } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
              />
              <p className="h-3">
                {errUsername && (
                  <span className="text-red-500 text-sm mt-1">{errMail}</span>
                )}
              </p>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-3">
                Email
              </label>
              <input
                type="text"
                id="email"
                autoComplete="off"
                placeholder="Email"
                onChange={(e) => handleEmailInput(e)}
                required
                onFocus={() => setuserEmailFocus(true)}
                onBlur={() => setuserEmailFocus(false)}
                ref={emailRef}
                className={`w-full px-3 py-3 border ${
                  userEmailFocus ? "border-blue-500" : "border-gray-300"
                } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
              />
              <p className="h-3">
                {errMail && (
                  <span className="text-red-500 text-sm mt-1">{errMail}</span>
                )}
              </p>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-3">
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="off"
                placeholder="Password..."
                onChange={(e) => handlepasswordInput(e)}
                required
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                ref={passwordRef}
                className={`w-full px-3 py-3 border ${
                  passwordFocus ? "border-blue-500" : "border-gray-300"
                } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
              />
              <p className="h-3">
                {errPassword && (
                  <span className="text-red-500 text-sm mt-1">{errPassword}</span>
                )}
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 mb-3"
              >
                Ulangi Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="off"
                placeholder="Password..."
                onChange={(e) => handleConfirmpasswordInput(e)}
                required
                onFocus={() => setConfirmpasswordFocus(true)}
                onBlur={() => setConfirmpasswordFocus(false)}
                ref={confirmPasswordRef}
                className={`w-full px-3 py-3 border ${
                  confirmpasswordFocus ? "border-blue-500" : "border-gray-300"
                } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
              />

              <p className="h-3">
                {errConfirmpassword && (
                  <span className="text-red-500 text-sm mt-1">{errConfirmpassword}</span>
                )}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center"> 
              <button
                type="submit"
                className="w-1/4 text-white text-extrabold p-3 rounded transition duration-300 rounded-[15px] bg-[#FBC707]"
              >
                Buat Akun
              </button>
            </div>

            {/* Login Link */}
            <div className="flex gap-1 w-full items-center justify-center pt-5">
              <p className="text-sm text-center">Sudah Punya Akun?</p>
              <p className="text-sm text-center text-blue-500 font-medium cursor-pointer hover:underline">
                Masuk Ke Akun
              </p>
            </div>
          </form>
    </MainLayout>
  );
};

export default Register;
