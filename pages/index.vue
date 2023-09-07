<script setup lang="ts">
import { useAuth } from '~/composables/use-auth';

const auth = useAuth();
const nuxtApp = useNuxtApp();

const socketMessages: Ref<any[]> = ref([]);

function startSocketIo() {
    nuxtApp.$socket.onAny((event, ...args) => socketMessages.value.push({ event, ...args }));
    nuxtApp.$socket.connect();
}
</script>

<template>
    <h1>Cards against my Sanity</h1>
    <p>Are you authenticated? {{ auth.isAuthenticated() }}</p>
    <div v-if="!auth.isAuthenticated()">
        <button @click="auth.logIn('administrator', 'password123')">log in</button>
    </div>
    <div v-else>
        <button @click="auth.logOut">log out</button>
    </div>
    <br />
    <button @click="startSocketIo">start socket</button>
    <br />
    <ul>
        <li v-for="(message, idx) in socketMessages" :key="'socket-message-' + idx">
            {{ message }}
        </li>
    </ul>
</template> 