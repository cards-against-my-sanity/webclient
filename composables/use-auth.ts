import { useUserStore } from "~/stores/user.store";

export const useAuth = () => {
    const nuxtApp = useNuxtApp();
    const store = useUserStore();

    const fetch = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBase,
        credentials: 'include',
        headers: useRequestHeaders(["cookie"]) as HeadersInit
    })

    function isAuthenticated() {
        return !!store.user;
    }

    async function logIn(nickname: string, password: string) {
        if (isAuthenticated()) return;
        
        nuxtApp.$socket.close();

        await fetch("auth/login", {
            method: "POST",
            body: {
                nickname,
                password
            },
            onResponse({ response }) {
                store.user = response._data;
            },
            onResponseError() {
                throw new Error("Invalid username or password combination.");
            }
        });

        nuxtApp.$socket.connect();
    };

    async function logOut() {
        if (!isAuthenticated()) return;

        nuxtApp.$socket.close();

        await fetch("auth/logout", {
            ignoreResponseError: true,
            method: "DELETE"
        });

        store.clear();

        nuxtApp.$socket.connect();
    }

    async function getCurrentUser() {
        if (isAuthenticated()) {
            return store.user;
        }

        await fetch("users", {
            ignoreResponseError: true,
            onResponse({ response }) {
                if (response.ok) {
                    store.user = response._data;
                } else {
                    store.clear();
                }
            }
        });
    }

    return {
        isAuthenticated,
        logIn,
        logOut,
        getCurrentUser
    }
}