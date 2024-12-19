import * as jose from 'jose'
import Axios, { AxiosError } from "axios";
import User from "@/types/User";
import LogInRequestDto from "@/types/dto/out/http/LogInRequestDto";
import ApiError from "@/types/dto/out/http/ApiError";
import { parse as parseCookies } from "cookie";
import BaseConfig from './axiosConfig'
import SignUpRequestDto from '@/types/dto/out/http/SignUpRequestDto';
import ResetPasswordRequestDto from '@/types/dto/out/http/ResetPasswordRequestDto';

export const authClient = Axios.create({
  ...BaseConfig,
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_BASE
})

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/;`
}

function isTokenExpired(token: string) {
  const { exp } = jose.decodeJwt(token)
  return !!exp && ((exp * 1000) < Date.now());
}

function extractAccessTokenFromCookies(): string | undefined {
  const cookies = parseCookies(document.cookie)
  return cookies.access_token
}

export async function refreshAccessToken(): Promise<string | undefined> {
  let accessToken = extractAccessTokenFromCookies()

  if (!accessToken || isTokenExpired(accessToken)) {
    try {
      await authClient.post('/refresh', {
        type: 'access'
      })

      accessToken = extractAccessTokenFromCookies()
    } catch {}
  }

  return accessToken
}

export async function refreshWebsocketToken(): Promise<string | null> {
  try {
    const resp = await authClient.post('/refresh', {
      type: 'websocket'
    })

    return resp.data.token
  } catch {
    return null
  }
}

export async function logIn(data: LogInRequestDto): Promise<void> {
  const { email, password, rememberMe } = data

  try {
    await authClient.post('/login', { email, password, rememberMe })
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const resp = err.response
      switch (resp.status) {
        case 401:
          throw new Error(resp.data.message)
        case 403:
          throw new Error(resp.data.message)
        case 409:
          throw new Error("You are already logged in")
        case 500:
          throw new Error("Something went wrong. Please try again later.")
      }
    }
  }
}

export async function logOut(): Promise<ApiError | undefined> {
  try {
    await authClient.delete('/logout')
    deleteCookie('access_token')
    deleteCookie('refresh_token')
    return undefined
  } catch {
    throw new Error("You are not logged in")
  }
}

export async function signUp(data: SignUpRequestDto): Promise<void> {
  const { email, nickname, password, passwordConfirmation } = data

  try {
    await authClient.post('/signup', { email, nickname, password, passwordConfirmation })
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      switch (err.response.status) {
        case 409:
          throw new Error("A user with those details already exists")
      }
    }
  }
}

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    return (await authClient.get<User>('/me')).data
  } catch {
    return undefined
  }
}

export async function confirmAccount(token: string): Promise<void> {
  try {
    await authClient.post('/confirm', {
      token
    })
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      switch (err.response.status) {
        case 400:
          throw new Error(err.response.data.message)
        case 404:
          throw new Error('Could not find the user to confirm, please try requesting a new link.')
      }
    }
  }
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  try {
    await authClient.post('/resend_confirmation', {
      email
    }, {
      headers: {
        'x-request-discriminator': email
      }
    })
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      switch (err.response.status) {
        case 400:
          throw new Error(err.response.data.message)
        case 429:
          throw new Error('You have requested a new confirmation email too recently. Please try again later.')
        case 500:
          throw new Error(err.response.data.message)
      }
    }
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await authClient.post('/forgot_password', {
      email
    }, {
      headers: {
        'x-request-discriminator': email
      }
    })
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      switch (err.response.status) {
        case 429:
          throw new Error('You have requested a new password too recently. Please try again later.')
        case 500:
          throw new Error(err.response.data.message)
      }
    }
  }
}

export async function resetPassword(data: ResetPasswordRequestDto): Promise<void> {
  const { token, newPassword, newPasswordConfirmation } = data
  try {
    await authClient.post('/reset_password', {
      token,
      newPassword,
      newPasswordConfirmation
    })
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      switch (err.response.status) {
        case 400:
          throw new Error(err.response.data.message)
        case 404:
          throw new Error('Could not find the user to reset password for, please try requesting a new link.')
        case 500:
          throw new Error(err.response.data.message)
        }
      }
  }
}
