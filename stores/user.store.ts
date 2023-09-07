import { defineStore } from "pinia";
import { UserType } from "~/types/user.interface";

export const useUserStore = defineStore('user', () => {
    /**
     * The stored user information
     */
    const user = ref<UserType | null>(null);

    /**
     * Clears the stored user information by setting 
     * it to null.
     */
    const clear = () => user.value = null;

    return {
        user,
        clear
    }
});