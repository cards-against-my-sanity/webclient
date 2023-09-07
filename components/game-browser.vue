<script setup>
import { useModalStore } from '~/stores/modal.store';
import { useUserStore } from '~/stores/user.store';

const userStore = useUserStore();
const modalStore = useModalStore();

function doCreateGame() {
    if (userStore.isAuthenticated) {
        // actually do it
    } else {
        modalStore.loginModalOpen = true;
        modalStore.flashMessage = "You need to sign in to create a game!";
    }
}
</script>
<template>
    <div class="w-full rounded-md border-2 border-black px-4 py-4">
        <div class="flex justify-between">
            <h1 class="text-2xl">Game Browser</h1>
            <BasicButton @click="doCreateGame">Create a Game</BasicButton>
        </div>
    </div>
</template>