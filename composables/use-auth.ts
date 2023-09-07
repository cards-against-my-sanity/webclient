import { FetchError } from "ofetch";
import { useUserStore } from "~/stores/user.store";
import { UserType } from "~/types/user.interface";

export const useAuth = () => {
    const nuxtApp = useNuxtApp();
    const store = useUserStore();

    const fetch = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBase,
        credentials: 'include',
        headers: useRequestHeaders(["cookie"]) as HeadersInit
    })

    async function signUp(nickname: string, password: string, email?: string): Promise<Record<string, any>> {
        const body: Record<string, any> = {
            nickname,
            password
        };

        if (email) body.email = email;

        nuxtApp.$socket.close();

        try {
            await fetch("users", {
                method: "POST",
                body
            });

            await logIn(nickname, password);
            return {};
        } catch (err) {
            return (err as FetchError).data;
        }
    }

    async function logIn(nickname: string, password: string): Promise<boolean> {
        nuxtApp.$socket.close();

        try {
            store.user = await fetch<UserType>("auth/login", {
                method: "POST",
                body: {
                    nickname,
                    password
                }
            });
        } catch (err) {
            return false;
        }

        nuxtApp.$socket.connect();
        return true;
    };

    async function logOut() {
        nuxtApp.$socket.close();

        await fetch("auth/logout", {
            ignoreResponseError: true,
            method: "DELETE"
        });

        store.clear();

        nuxtApp.$socket.connect();
    }

    async function fetchCurrentUser() {
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
        signUp,
        logIn,
        logOut,
        fetchCurrentUser
    }
}