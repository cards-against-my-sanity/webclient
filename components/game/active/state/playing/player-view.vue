<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const hand = computed(() => activeGameStore.hand);
const blackCard = computed(() => activeGameStore.blackCard!);


const cardsToggled = ref<string[]>([]);
function toggleCard(card: string) {
    if (alreadyPlayed.value) {
        return;
    }
    
    if (cardsToggled.value.includes(card)) {
        if (blackCard.value.pick > 1) {
            const idx = cardsToggled.value.findIndex(c => c === card);
            cardsToggled.value.splice(idx, 1);
        } else {
            cardsToggled.value.length = 0;
        }
    } else {
        if (cardsToggled.value.length == blackCard.value.pick) {
            return;
        }

        cardsToggled.value.push(card);
    }
}

const alreadyPlayed = ref<boolean>(false);
const readyToConfirm = computed(() => cardsToggled.value.length === blackCard.value.pick);
async function confirmPlay() {
    if (!activeGameStore.needToPlay || !readyToConfirm.value || alreadyPlayed.value) {
        return;
    }

    const resp = await nuxtApp.$socketOps.playCards(cardsToggled.value);
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Cards not played. ${resp.message}`);
    } else {
        activeGameStore.discardCards(cardsToggled.value);
        cardsToggled.value.length = 0;
        alreadyPlayed.value = true;
    }
}

const pluralizedCardWord = computed(() => blackCard.value.pick > 1 ? 'cards' : 'card');
const pluralizedItWord = computed(() => blackCard.value.pick > 1 ? 'them' : 'it');
</script>

<template>
    <div class="flex flex-col items-center mb-1">
        <GameCardBlackCard :card="blackCard" />
        <p class="mt-4 text-xs">Play {{ blackCard.pick }} {{ pluralizedCardWord }} in the order you want {{ pluralizedItWord }} to be judged.</p>
    </div>
    <div v-if="activeGameStore.needToPlay" class="flex overflow-x-auto p-2 py-4 gap-x-4">
        <GameCardWhiteCard v-for="(card, idx) in hand" :key="'white-card-' + idx" :content="card.content"
            @click="toggleCard(card.id)" :is-selected="cardsToggled.includes(card.id)" />
    </div>
    <div v-else class="mt-4 flex justify-center items-center">
        <p>Your play has been received. Please wait for the other players to submit their cards.</p>
    </div>
    <div v-if="readyToConfirm" class="flex justify-center items-center">
        <UiButton @click="confirmPlay">Confirm Play</UiButton>
    </div>
</template>