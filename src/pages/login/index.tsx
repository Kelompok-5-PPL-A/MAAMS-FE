import { useRef, useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'

import { login } from '../../actions/auth'

const Login: React.FC = () => {
  // Referensi untuk field username, email, password, dan confirm password
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // State untuk menyimpan dan mengelola input username
  const [username, setUsername] = useState('')
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false)

  // save and handling password
  const [password, setPassword] = useState('')
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false)

  //   const [loginMessage, setLoginMessage] = useState("");
  //   const [isValidLogin, setValidLogin] = useState<boolean>(false);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setUsername(value)
    console.log(username)
  }

  const handlepasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setPassword(value)
    console.log(password)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // TODO: call login function, handle status and messages appropriately
    const response = await login(username, password)
    console.log(response)
  }

  return (
    <MainLayout>
      <form onSubmit={handleSubmit} className='w-full max-w-md mx-auto lg:max-w-xl'>
        <h1 className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>Masuk ke akun</h1>

        <div className='mb-4'>
          <label htmlFor='username' className='block text-sm font-medium text-gray-600 mb-3'>
            Username
          </label>
          <input
            type='text'
            id='username'
            placeholder='Username..'
            autoComplete='off'
            onChange={(e) => handleUsernameInput(e)}
            required
            onFocus={() => setUsernameFocus(true)}
            onBlur={() => setUsernameFocus(false)}
            ref={usernameRef}
            className={`w-full px-3 py-3 border ${
              usernameFocus ? 'border-blue-500' : 'border-gray-300'
            } rounded focus:outline-none focus:shadow-outline-blue  focus:outline-none focus:shadow-outline-blue bg-gray-400 bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='password' className='block text-sm font-medium text-gray-600 mb-3'>
            Password
          </label>
          <input
            type='password'
            id='password'
            placeholder='Password...'
            autoComplete='off'
            onChange={(e) => handlepasswordInput(e)}
            required
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            ref={passwordRef}
            className={`w-full px-3 py-3 border ${
              passwordFocus ? 'border-blue-500' : 'border-gray-300'
            } rounded focus:outline-none focus:shadow-outline-blue focus:outline-none focus:shadow-outline-blue bg-gray-400 bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
          />
        </div>
        {/* <p className="h-3">
          {isValidLogin && (
            <span className="text-red-500 text-sm mt-1">{isValidLogin}</span>
          )}
        </p>         */}
        <div className='flex justify-center'>
          <button
            type='submit'
            className='w-1/4 bg-blue-500 text-white text-bold p-3 rounded transition duration-300 rounded-[15px] bg-[#FBC707]'
          >
            Masuk
          </button>
        </div>

        <div className='flex flex-col md:flex-row gap-1 items-center justify-center pt-5'>
          <p className='text-sm text-center md:text-left'>Belum punya akun?</p>
          <p
            // onClick={showRegisterForm}
            className='text-sm text-center md:text-right text-blue-500 font-medium cursor-pointer hover:underline'
          >
            Daftar Sekarang
          </p>
        </div>
      </form>
    </MainLayout>
  )
}

export default Login
