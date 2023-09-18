<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
import { useUserStore } from '~/stores/user.store';
import { useModalStore } from '~/stores/modal.store';

const activeGameStore = useActiveGameStore();
const nuxtApp = useNuxtApp();
const auth = useAuth();
const user = useUserStore();
const modal = useModalStore();

async function doLogOut() {
    if (activeGameStore.exists) {
        await nuxtApp.$socketOps.leaveGame();
    }

    await auth.logOut();
}
</script>

<template>
    <template v-if="!user.isAuthenticated">
        <UiButton class="px-2 py-1" @click="modal.loginModalOpen = true">
            <span>Log In</span>
        </UiButton>
        <UiButton class="px-2 py-1" @click="modal.signupModalOpen = true">
            <span>Sign Up</span>
        </UiButton>
    </template>
    <UiButton v-else class="px-2 py-1" @click="doLogOut">
        <span>Log Out</span>
    </UiButton>
</template>