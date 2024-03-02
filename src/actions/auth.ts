// import axios from 'axios';

type LoginResult = {
  statusCode: number
  message: string
}

export const login = async (username: string, password: string): Promise<LoginResult> => {
  // TODO: post login, handle return values through error codes and messages
  console.log(username, password)

  const response = 'axios post here'

  const result: LoginResult = {
    statusCode: 200,
    message: response
  }

  console.log(`will post to the following base url: ${process.env.NEXT_PUBLIC_API_BASE_URL}`)

  return result
}
