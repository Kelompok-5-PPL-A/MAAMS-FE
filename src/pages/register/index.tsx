import { useRef, useState, useEffect } from 'react'
import maams from '../../assets/maams.png'
import MainLayout from 'layout/MainLayout'
import { useRouter } from 'next/router'
import { register } from '../../actions/auth'

const Register: React.FC = () => {
  const router = useRouter()

  // Referensi untuk field username, email, password, dan confirm password
  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const ConfirmPaswordRef = useRef<HTMLInputElement>(null)

  // State untuk menyimpan dan mengelola input username
  const [username, setUsername] = useState('')
  // const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
  // const [errUsername, setErrUsername] = useState<string | null>();
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false)

  // State untuk menyimpan dan mengelola inpu email
  const [userEmail, setuserEmail] = useState('')
  const [userEmailFocus, setuserEmailFocus] = useState<boolean>(false)

  // State untuk menyimpan dan mengelola input password
  const [password, setpassword] = useState('')
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false)

  // State untuk menyimpan dan mengelola input ConfirmPasword
  const [ConfirmPasword, setConfirmPasword] = useState('')
  const [ConfirmPaswordFocus, setConfirmPaswordFocus] = useState<boolean>(false)

  // State untuk mengelola response msg dan validasi register
  const [registMessage, setRegistMessage] = useState('')
  const [isRegistered, setRegistered] = useState<boolean>(false)

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])
  useEffect(() => {
    // Prevent users from accessing login page if user is already authenticated
    const refresh = localStorage.getItem('refresh')
    if (refresh) {
      router.push('/')
    }
  }, [])

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setUsername(value)
  }
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setuserEmail(value)
  }
  const handlepasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setpassword(value)
  }
  const handleConfirmPaswordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setConfirmPasword(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    // TODO: save access token in memory, save refresh token in cookie
    e.preventDefault()
    register(username, userEmail, password, ConfirmPasword)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          setRegistered(true)
          setRegistMessage(res.data.detail)
          localStorage.setItem('access', res.data.access_token)
          localStorage.setItem('refresh', res.data.refresh_token)
          localStorage.setItem('userData', JSON.stringify(res.data.data))
          localStorage.setItem('isLoggedIn', 'true')
          router.push('/')
        }
      })
      .catch((err) => {
        const message = err.response.data.detail
        setRegistered(false)
        setRegistMessage(message)
      })
  }
  return (
    <MainLayout>
      <a href='#' className='mb-6 flex items-center justify-center'>
        <img src={maams.src} className='h-318 w-318' alt='Maams Auth' />
      </a>
      <form onSubmit={handleSubmit} className='w-full max-w-md mx-auto lg:max-w-xl'>
        <h1 className='text-2xl font-extrabold mb-4 text-center mt-7 mb-7'>Buat Akun</h1>
        <div className='mb-4'>
          <label htmlFor='username' className='block text-sm font-medium text-gray-600 mb-3'>
            Username
          </label>
          <input
            type='text'
            id='username'
            autoComplete='off'
            placeholder='Username...'
            onChange={(e) => handleUsernameInput(e)}
            required
            onFocus={() => setUsernameFocus(true)}
            onBlur={() => setUsernameFocus(false)}
            ref={usernameRef}
            className={`w-full px-3 py-3 border ${
              usernameFocus ? 'border-blue-500' : 'border-gray-300'
            } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
          />
          <p className='h-3'>{isRegistered && <span className='text-red-500 text-sm mt-1'>{registMessage}</span>}</p>
        </div>

        {/* Email Input */}
        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-600 mb-3'>
            Email
          </label>
          <input
            type='text'
            id='email'
            autoComplete='off'
            placeholder='Email'
            onChange={(e) => handleEmailInput(e)}
            required
            onFocus={() => setuserEmailFocus(true)}
            onBlur={() => setuserEmailFocus(false)}
            ref={emailRef}
            className={`w-full px-3 py-3 border ${
              userEmailFocus ? 'border-blue-500' : 'border-gray-300'
            } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
          />
          <p className='h-3'>{isRegistered && <span className='text-red-500 text-sm mt-1'>{registMessage}</span>}</p>
        </div>

        {/* Password Input */}
        <div className='mb-4'>
          <label htmlFor='password' className='block text-sm font-medium text-gray-600 mb-3'>
            Password
          </label>
          <input
            type='password'
            id='password'
            autoComplete='off'
            placeholder='Password...'
            onChange={(e) => handlepasswordInput(e)}
            required
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            ref={passwordRef}
            className={`w-full px-3 py-3 border ${
              passwordFocus ? 'border-blue-500' : 'border-gray-300'
            } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
          />
          <p className='h-3'>{isRegistered && <span className='text-red-500 text-sm mt-1'>{registMessage}</span>}</p>
        </div>

        {/* Confirm Password Input */}
        <div className='mb-6'>
          <label htmlFor='ConfirmPasword' className='block text-sm font-medium text-gray-600 mb-3'>
            Ulangi Password
          </label>
          <input
            type='password'
            id='ConfirmPasword'
            autoComplete='off'
            placeholder='Password...'
            onChange={(e) => handleConfirmPaswordInput(e)}
            required
            onFocus={() => setConfirmPaswordFocus(true)}
            onBlur={() => setConfirmPaswordFocus(false)}
            ref={ConfirmPaswordRef}
            className={`w-full px-3 py-3 border ${
              ConfirmPaswordFocus ? 'border-blue-500' : 'border-gray-300'
            } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
          />

          <p className='h-3'>{isRegistered && <span className='text-red-500 text-sm mt-1'>{registMessage}</span>}</p>
        </div>

        {/* Submit Button */}
        <div className='flex justify-center'>
          <button
            type='submit'
            className='w-1/4 text-white text-extrabold p-3 rounded transition duration-300 rounded-[15px] bg-[#FBC707]'
          >
            Buat Akun
          </button>
        </div>

        {/* Login Link */}
        <div className='flex gap-1 w-full items-center justify-center pt-5'>
          <p className='text-sm text-center'>Sudah Punya Akun?</p>
          <p className='text-sm text-center text-blue-500 font-medium cursor-pointer hover:underline'>Masuk Ke Akun</p>
        </div>
      </form>
    </MainLayout>
  )
}

export default Register
