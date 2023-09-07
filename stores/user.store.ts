import { defineStore } from "pinia";
import { UserType } from "~/types/user.interface";

export const useUserStore = defineStore('user', () => {
    const user = ref<UserType | null>(null);

    const clear = () => user.value = null;
    const isAuthenticated = computed(() => !!user.value);

    return {
        user,
        clear,
        isAuthenticated
    }
});