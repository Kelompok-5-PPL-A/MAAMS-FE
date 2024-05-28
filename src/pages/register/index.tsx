import React, { useRef, useState, useEffect } from 'react'
import maams from '../../assets/maams.png'
import { useRouter } from 'next/router'
import { register } from '../../actions/auth'
import { toast } from 'react-hot-toast'
import MainLayout from '../../layout/MainLayout'

const Register: React.FC = () => {
  const router = useRouter()

  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const ConfirmPasswordRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState('')
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false)

  const [userEmail, setuserEmail] = useState('')
  const [userEmailFocus, setuserEmailFocus] = useState<boolean>(false)

  const [password, setpassword] = useState('')
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false)

  const [ConfirmPassword, setConfirmPassword] = useState('')
  const [ConfirmPasswordFocus, setConfirmPasswordFocus] = useState<boolean>(false)

  const [errUsernameMessage, setErrUsernameMessage] = useState('')
  const [errEmailMessage, setErrEmailMessage] = useState('')
  const [errPasswordMessage, setErrPasswordMessage] = useState('')
  const [errConfirmPasswordMessage, setErrConfirmPasswordMessage] = useState('')

  const [errorOccurred, setErrorOccurred] = useState<boolean>(false)

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const refresh = localStorage.getItem('refresh')
    if (refresh) {
      router.push('/')
    }
  }, [])

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setUsername(value)
    setErrUsernameMessage('')
    setErrorOccurred(false)
  }

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setuserEmail(value)
    setErrEmailMessage('')
    setErrorOccurred(false)
  }

  const handlepasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setpassword(value)
    setErrPasswordMessage('')
    setErrConfirmPasswordMessage('')
    setErrorOccurred(false)
  }

  const handleConfirmPasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setConfirmPassword(value)
    setErrConfirmPasswordMessage('')
    setErrorOccurred(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    register(username, userEmail, password, ConfirmPassword)
      .then((res) => {
        console.log('Response from server:', res)
        if (res.status === 201) {
          toast.success('User registered successfully.')
          router.push('/login')
        }
      })
      .catch((err) => {
        let errorMessage = 'An error occurred.'
        if (err.response && err.response.data) {
          if (err.response.data.username) {
            errorMessage = err.response.data.username[0]
            setErrUsernameMessage(errorMessage)
          } else if (err.response.data.email) {
            errorMessage = err.response.data.email[0]
            setErrEmailMessage(errorMessage)
          } else if (err.response.data.password) {
            errorMessage = err.response.data.password[0]
            setErrPasswordMessage(errorMessage)
            setErrConfirmPasswordMessage(errorMessage)
          }
        }
        toast.error('Failed to register, please try again. ')
        setErrorOccurred(true)
      })
  }

  return (
    <>
      <MainLayout>
        <div className='min-h-screen m-10'>
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
              {errorOccurred && (
                <p className='h-3'>
                  <span className='text-red-500 text-sm mt-1'>{errUsernameMessage}</span>
                </p>
              )}
            </div>

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
              {errorOccurred && (
                <p className='h-3'>
                  <span className='text-red-500 text-sm mt-1'>{errEmailMessage}</span>
                </p>
              )}
            </div>

            <div className='mb-4'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-600 mb-3'>
                Password
              </label>
              <input
                type='password'
                data-testid='password'
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
              {errorOccurred && (
                <p className='h-3'>
                  <span className='text-red-500 text-sm mt-1'>{errPasswordMessage}</span>
                </p>
              )}
            </div>

            <div className='mb-6'>
              <label htmlFor='ConfirmPassword' className='block text-sm font-medium text-gray-600 mb-3'>
                Ulangi Password
              </label>
              <input
                type='password'
                data-testid='confirmPassword'
                id='ConfirmPassword'
                autoComplete='off'
                placeholder='Password...'
                onChange={(e) => handleConfirmPasswordInput(e)}
                required
                onFocus={() => setConfirmPasswordFocus(true)}
                onBlur={() => setConfirmPasswordFocus(false)}
                ref={ConfirmPasswordRef}
                className={`w-full px-3 py-3 border ${
                  ConfirmPasswordFocus ? 'border-blue-500' : 'border-gray-300'
                } rounded focus:outline-none focus:shadow-outline-blue bg-[#EDEDED] border-solid border border-[#EDEDED] rounded-[10px] pl-4 text-sm`}
              />
              {errorOccurred && (
                <p className='h-3'>
                  <span className='text-red-500 text-sm mt-1'>{errConfirmPasswordMessage}</span>
                </p>
              )}
            </div>

            <div className='flex justify-center'>
              <button
                type='submit'
                className='w-1/4 text-white text-extrabold p-3 rounded transition duration-300 rounded-[15px] bg-[#FBC707]'
                data-testid='register-button'
              >
                Buat Akun
              </button>
            </div>

            <div className='flex gap-1 w-full items-center justify-center pt-5'>
              <p className='text-sm text-center'>Sudah Punya Akun?</p>
              <p
                className='text-sm text-center text-blue-500 font-medium cursor-pointer hover:underline'
                onClick={() => router.push('/login')}
              >
                Masuk Ke Akun
              </p>
            </div>
            <div className='flex gap-1 w-full items-center justify-center pt-5'></div>
          </form>
        </div>
      </MainLayout>
    </>
  )
}

export default Register
