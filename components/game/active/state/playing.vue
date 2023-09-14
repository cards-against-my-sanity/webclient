<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const hand = computed(() => activeGameStore.hand);
const blackCard = computed(() => activeGameStore.blackCard!);

const cardsToggled = ref<string[]>([]);
function toggleCard(card: string) {
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

const readyToConfirm = computed(() => cardsToggled.value.length === blackCard.value.pick);
async function confirmPlay() {
    if (!readyToConfirm.value) {
        return;
    }

    const resp = await nuxtApp.$socketOps.playCards(cardsToggled.value);
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Cards not played. ${resp.message}`);
    }
}
</script>

<template>
    <div class="grid grid-cols-10 gap-x-4">
        <div v-if="!activeGameStore.iAmTheJudge" class="col-span-10 flex justify-center items-center mb-5">
            <p>Please play {{ blackCard.pick }} cards in the order you wish them to be judged.</p>
        </div>
        <div class="col-span-2">
            <GameCardBlackCard :card="blackCard" />
        </div>
        <div class="col-span-8 grid grid-cols-5 gap-4 mb-6">
            <div v-if="activeGameStore.iAmTheJudge" class="col-span-5 flex justify-center items-center">
                <p>You are the judge. Please wait for players to play their cards.</p>
            </div>
            <GameCardWhiteCard v-else v-for="(card, idx) in hand" :key="'white-card-' + idx" :card="card" @click="toggleCard(card.id)" :is-selected="cardsToggled.includes(card.id)" />
        </div>
        <div v-if="readyToConfirm" class="col-span-10 flex justify-center items-center">
            <UiButton @click="confirmPlay">Confirm Play</UiButton>
        </div>
    </div>
</template>