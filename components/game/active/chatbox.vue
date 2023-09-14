<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
import dayjs from 'dayjs';

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
        <div v-for="(message, idx) in activeGameStore.messages" :key="'chat-message-' + idx" class="relative flex flex-col">
            <div class="absolute top-0 right-0 text-xs">[{{ dayjs(message.timestamp).format('hh:mm:ss A') }}]</div>
            <div class="text-lg">
                <span v-if="message.type === 'chat'" class="font-bold">{{ message.sender!.nickname }}</span>
                <span v-else-if="message.type === 'system'" class="italic">System</span>
                <span class="text-sm italic font-light">&nbsp;says</span>
            </div>
            <div class="indent-2"><span>{{ message.content }}</span></div>
        </div>
    </div>
    <form class="grow-0 flex gap-x-4" @submit.prevent="sendChat">
        <FormStringInput type="text" v-model="chatToSend" placeholder="Type a message..." />
        <UiButton class="text-xs w-28 flex justify-center items-center">
            <input type="submit" value="Send Chat" />
        </UiButton>
    </form>
</template>