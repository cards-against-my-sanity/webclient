import { io } from 'socket.io-client'

export default defineNuxtPlugin(nuxtApp => {
    console.log("registering socket plugin")

    const socket = io(useRuntimeConfig().public.ws, { 
        autoConnect: false,
        withCredentials: true
    });

    return {
        provide: {
            socket
        }
    }
})