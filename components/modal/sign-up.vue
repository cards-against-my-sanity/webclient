<script setup lang="ts">
import { useModalStore } from '~/stores/modal.store';

const modal = useModalStore();

const { open } = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const auth = useAuth();

const nickname = ref<string>("");
const password = ref<string>("");
const email = ref<string>("");

async function doSignUp() {
    modal.flashMessage = null;

    if (!nickname.value) {
        modal.flashMessage = "Nickname was not provided"
    }

    if (!password.value || password.value.length < 8) {
        modal.flashMessage = "Password must have at least 8 characters";
    }

    const resp = await auth.signUp(nickname.value, password.value, email.value);
    if (Object.keys(resp).length === 0) {
        emit('close');
    } else {
        modal.flashMessage = resp.message[0];
    }
}

function transferToLogIn() {
    modal.flashMessage = null;
    modal.signupModalOpen = false;
    modal.loginModalOpen = true;
}
</script>

<template>
    <ModalBasic :open="open" @close="$emit('close')">
        <h1 class="text-xl font-bold text-center">Create an Account</h1>
        <div v-if="modal.flashMessage" class="mt-2 text-center text-red-400">{{ modal.flashMessage }}</div>
        <div class="mt-5">
            <form @submit.prevent="doSignUp" class="grid grid-cols-1 gap-6 px-4">
                <SimpleFormInput 
                    type="text"    
                    title="Nickname" 
                    caption="This is the name you will use in games. You can change it later if you want." 
                    placeholder="epicCAHPlayer123" 
                    v-model="nickname" />
                
                <SimpleFormInput 
                    type="password"    
                    title="Password" 
                    caption="Choose a good one, numb nuts." 
                    placeholder="'password' is not a good password" 
                    v-model="password" />

                <SimpleFormInput 
                    type="email"    
                    title="Email (optional)" 
                    caption="This just lets me send you password reset emails if you forget the thing. If you don't provide it, you can't reset your password. But that doesn't bother me. So, provide it, or don't. I don't care." 
                    placeholder="yourmom@gmail.com" 
                    v-model="email" />

                <p>Already have an account? You can <a href="#" @click.prevent="transferToLogIn">log in here</a>.</p>

                <BasicButton><input type="submit" value="Finish"></BasicButton>
            </form>
        </div>
    </ModalBasic>
</template>