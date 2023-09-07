import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', () => {
    const loginModalOpen = ref<boolean>(false);
    const signupModalOpen = ref<boolean>(false);
    const flashMessage = ref<string | null>(null);

    return { loginModalOpen, signupModalOpen, flashMessage };
});