<script setup lang="ts">
import { useModalStore } from '~/stores/modal.store';

const modal = useModalStore();

const { open } = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const auth = useAuth();

const nickname = ref<string>("");
const password = ref<string>("");
const remember = ref<boolean>(false);

async function doLogIn() {
    modal.flashMessage = null;

    if (!nickname.value) {
        modal.flashMessage = "Nickname was not provided"
    }

    if (!password.value || password.value.length < 8) {
        modal.flashMessage = "Password must have at least 8 characters";
    }

    const resp = await auth.logIn(nickname.value, password.value, remember.value);
    if (resp) {
        emit('close');
    } else {
        modal.flashMessage = "Invalid username or password combination"
    }
}

function transferToSignUp() {
    modal.flashMessage = null;
    modal.loginModalOpen = false;
    modal.signupModalOpen = true;
}
</script>

<template>
    <ModalBasic :open="open" @close="$emit('close')">
        <h1 class="text-xl font-bold text-center">Log In</h1>
        <div v-if="modal.flashMessage" class="mt-2 text-center text-xs text-red-400">{{ modal.flashMessage }}</div>
        <div class="mt-5">
            <form @submit.prevent="doLogIn" class="grid grid-cols-1 gap-6 px-4">
                <div>
                    <UiCaptionedTitle title="Nickname" />
                    <FormStringInput type="text" placeholder="epicCAHPlayer123" v-model="nickname" />
                </div>
                <div>
                    <UiCaptionedTitle title="Password" />
                    <FormStringInput type="password" placeholder="mySup3rP@ssw0rd" v-model="password" />
                </div>
                <div class="flex justify-center items-center gap-x-12">
                    <UiCaptionedTitle title="Remember Me" caption="If checked, you'll be remembered for up to a week." />
                    <FormCheckboxInput v-model="remember" />
                </div>

                
                <p>No account? You can <UiLink @click="transferToSignUp">sign up here</UiLink>.</p>

                <UiButton><input type="submit" value="Go" /></UiButton>
            </form>
        </div>
    </ModalBasic>
</template>