<script setup lang="ts">
import { useModalStore } from '~/stores/modal.store';

const modal = useModalStore();

const { open } = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const auth = useAuth();

const nickname = ref<string>("");
const password = ref<string>("");

async function doLogIn() {
    modal.flashMessage = null;

    if (!nickname.value) {
        modal.flashMessage = "Nickname was not provided"
    }

    if (!password.value || password.value.length < 8) {
        modal.flashMessage = "Password must have at least 8 characters";
    }

    const resp = await auth.logIn(nickname.value, password.value);
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
        <div v-if="modal.flashMessage" class="mt-2 text-center text-red-400">{{ modal.flashMessage }}</div>
        <div class="mt-5">
            <div class="grid grid-cols-1 gap-6 px-4">
                <SimpleFormInput 
                    type="text"    
                    title="Nickname"
                    placeholder="epicCAHPlayer123" 
                    v-model="nickname" />
                
                <SimpleFormInput 
                    type="password"    
                    title="Password" 
                    placeholder="mySup3rP@ssw0rd" 
                    v-model="password" />

                <p>No account? You can <a href="#" @click.prevent="transferToSignUp">sign up here</a>.</p>

                <BasicButton @click="doLogIn">Go</BasicButton>
            </div>
        </div>
    </ModalBasic>
</template>