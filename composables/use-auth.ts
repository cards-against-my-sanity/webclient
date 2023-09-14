import { FetchError } from "ofetch";
import ICreateUserDto from "~/shared-types/user/create-user.dto.interface";
import { IUser } from "~/shared-types/user/user.interface";
import { useUserStore } from "~/stores/user.store";

export const useAuth = () => {
    const nuxtApp = useNuxtApp();
    const store = useUserStore();

    const fetch = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBase,
        credentials: 'include',
        headers: useRequestHeaders(["cookie"]) as HeadersInit
    })

    async function signUp(dto: ICreateUserDto): Promise<Record<string, any>> {
        nuxtApp.$socket.close();

        // TODO: figure out the return value of this thing

        try {
            await fetch("users", {
                method: "POST",
                body: dto
            });

            await logIn(dto.nickname, dto.password);
            return {};
        } catch (err) {
            return (err as FetchError).data;
        }
    }

    async function logIn(nickname: string, password: string): Promise<boolean> {
        nuxtApp.$socket.close();

        try {
            store.user = await fetch<IUser>("auth/login", {
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
        try {
            store.user = await fetch<IUser>("users");
        } catch {
            store.clear();
        }
    }

    return {
        signUp,
        logIn,
        logOut,
        fetchCurrentUser
    }
}