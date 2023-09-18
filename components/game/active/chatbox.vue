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
    <div class="h-full relative flex flex-col gap-y-4 text-xs">
        <div class="h-full flex flex-col-reverse overflow-y-auto gap-y-2">
            <div v-for="(message, idx) in activeGameStore.messages" :key="'chat-message-' + idx"
                class="relative flex flex-col gap-y-1">
                <div class="absolute top-0 right-0">[{{ dayjs(message.timestamp).format('hh:mm:ss A') }}]</div>
                <div class="font-bold">
                    <span v-if="message.type === 'chat'">{{ message.sender!.nickname }}</span>
                    <span v-else-if="message.type === 'system'">System</span>
                </div>
                <div class="indent-1"><span>{{ message.content }}</span></div>
            </div>
        </div>
        <form class="flex gap-x-4 justify-center items-center " @submit.prevent="sendChat">
            <FormStringInput type="text" v-model="chatToSend" placeholder="Type a message..." />
            <UiButton class="text-xs h-10 w-28 flex justify-center items-center">
                <input type="submit" value="Send Chat" />
            </UiButton>
        </form>
    </div>
</template>