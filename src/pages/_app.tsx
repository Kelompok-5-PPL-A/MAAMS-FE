import React from 'react'
import { AppProps } from 'next/app'
import '../styles/global.css'
import { Toaster } from 'react-hot-toast'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Toaster />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default MyApp
