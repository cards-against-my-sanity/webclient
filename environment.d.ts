// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Next from 'next'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_AUTH_API_BASE: string,
      NEXT_PUBLIC_GAME_SERVER_API_BASE: string
      NEXT_PUBLIC_GAME_SERVER_SOCKET: string
    }
  }
}