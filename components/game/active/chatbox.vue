<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();

const chatToSend = ref<string>("");
async function sendChat() {
    if (chatToSend.value === "") {
        return;
    }

    await nuxtApp.$socketOps.sendGameChat(chatToSend.value);
    chatToSend.value = "";
}
</script>

<template>
    <div class="grow-0 shrink-0 h-56 2xl:h-96 overflow-y-auto border-2 border-black dark:border-white p-4 rounded-md space-y-4">
        <!-- <div v-for="(message, idx) in activeGameStore.chats" :key="'chat-message-' + idx" class="relative flex flex-col">
            <div class="absolute top-0 right-0 text-xs">[{{ message.received }}]</div>
            <div class="text-lg">
                <span v-if="message.type === 'chat'" class="font-bold">{{ message.user!.nickname }}</span>
                <span v-else class="italic">System</span>
                <span class="text-sm italic font-light">&nbsp;says</span>
            </div>
            <div class="indent-2"><span>{{ message.message }}</span></div>
        </div> -->
    </div>
    <form class="grow-0 flex gap-x-4" @submit.prevent="sendChat">
        <FormStringInput type="text" v-model="chatToSend" placeholder="Type a message..." />
        <UiButton class="text-xs w-28 flex justify-center items-center">
            <input type="submit" value="Send Chat" />
        </UiButton>
    </form>
</template>