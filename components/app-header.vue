<script setup lang="ts">
import { useUserStore } from '~/stores/user.store';
import { useModalStore } from '~/stores/modal.store';

const auth = useAuth();
const user = useUserStore();
const modal = useModalStore();
</script>

<template>
    <div class="flex justify-between items-center my-5">
        <img src="/logo.svg" class="fill-black" alt="Cards Against My Sanity Logo" />
        <nav class="flex justify-evenly list-none gap-x-4 text-lg">
            <nuxt-link to="/">Home</nuxt-link>
            <nuxt-link to="/about">About</nuxt-link>
            <template v-if="!user.user">
                <a href="#" @click="modal.loginModalOpen = true">Log In</a>
                <a href="#" @click="modal.signupModalOpen = true">Sign Up</a>
            </template>
            <a href="#" v-else @click="auth.logOut">Log Out</a>
        </nav>
    </div>
</template>