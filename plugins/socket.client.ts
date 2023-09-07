import { io } from 'socket.io-client'

export default defineNuxtPlugin(nuxtApp => {
    const socket = io(useRuntimeConfig().public.ws, { withCredentials: true });
    
    return {
        provide: {
            socket
        }
    }
})