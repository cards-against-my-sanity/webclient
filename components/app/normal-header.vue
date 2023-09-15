<script setup lang="ts">
import { useUserStore } from '~/stores/user.store';
import { useModalStore } from '~/stores/modal.store';
import { useActiveGameStore } from '~/stores/active-game.store';
import { MoonIcon, SunIcon, EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/solid';

const nuxtApp = useNuxtApp();
const auth = useAuth();
const user = useUserStore();
const modal = useModalStore();
const colorMode = useColorMode();
const activeGameStore = useActiveGameStore();

const colorModeIcon = computed(() => {
    if (colorMode.preference === 'system') {
        if (colorMode.value === 'dark') {
            return SunIcon;
        } else {
            return MoonIcon;
        }
    } else if (colorMode.preference === 'dark') {
        return SunIcon;
    } else {
        return MoonIcon;
    }
});

function toggleColorPreference() {
    if (colorMode.preference === 'system') {
        if (colorMode.value === 'dark') {
            colorMode.preference = 'light';
        } else {
            colorMode.preference = 'dark';
        }
    } else if (colorMode.preference === 'dark') {
        colorMode.preference = 'light';
    } else {
        colorMode.preference = 'dark';
    }
}

async function doLogOut() {
    if (activeGameStore.exists) {
        await nuxtApp.$socketOps.leaveGame();
    }

    await auth.logOut();
}
</script>

<template>
    <div class="flex justify-between items-center py-5">
        <img src="/logo.svg" class="fill-black" alt="Cards Against My Sanity Logo" />
        <nav class="flex justify-evenly items-center list-none gap-x-4 text-lg">
            <client-only>
                <component @click="toggleColorPreference" class="h-6 w-6 cursor-pointer" :is="colorModeIcon" />
                <template #fallback>
                    <EllipsisHorizontalCircleIcon class="h-6 w-6 cursor-pointer" />
                </template>
            </client-only>
            <template v-if="!user.isAuthenticated">
                <a href="#" @click="modal.loginModalOpen = true">Log In</a>
                <a href="#" @click="modal.signupModalOpen = true">Sign Up</a>
            </template>
            <a href="#" v-else @click="doLogOut">Log Out</a>
        </nav>
    </div>
</template>