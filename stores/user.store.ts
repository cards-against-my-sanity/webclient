import { defineStore } from "pinia";
import IUser from "~/shared-types/user/user.interface";

export const useUserStore = defineStore('user', () => {
    const user = ref<IUser | null>(null);

    const clear = () => user.value = null;
    const isAuthenticated = computed(() => !!user.value);

    return {
        user,
        clear,
        isAuthenticated
    }
});