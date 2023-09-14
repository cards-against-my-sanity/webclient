<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const cardsBeingJudged = computed(() => activeGameStore.cardsBeingJudged);
const blackCard = computed(() => activeGameStore.blackCard!);

const cardsToggled = ref<string[]>([]);
function toggleCards(cards: string[]) {
    cardsToggled.value.length = 0;
    cardsToggled.value.push(...cards);
}

const readyToConfirm = computed(() => cardsToggled.value.length !== 0);
async function confirmJudgement() {
    if (!readyToConfirm.value) {
        return;
    }

    const resp = await nuxtApp.$socketOps.judgeCards(cardsToggled.value);
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Cards not judged. ${resp.message}`);
    }
}
</script>

<template>
    <div class="grid grid-cols-10 gap-x-4">
        <div v-if="!activeGameStore.iAmTheJudge" class="col-span-10 flex justify-center items-center mb-5">
            <p>Please choose the {{ blackCard.pick }} winning cards.</p>
        </div>
        <div class="col-span-2">
            <GameCardBlackCard :card="blackCard" />
        </div>
        <div class="col-span-8 grid grid-cols-5 gap-4 mb-6">
            <div v-if="!activeGameStore.iAmTheJudge" class="col-span-5 flex justify-center items-center">
                <p>Please wait for the judge to decide the winner of the round.</p>
            </div>
            <div v-else v-for="(cards, setIdx) in cardsBeingJudged" :key="'white-cards-' + setIdx" class="border-2 col-span-2 dark:border-white p-4 flex">
                <GameCardWhiteCard v-for="(card, cardIdx) in cards" :key="'white-cards-' + setIdx + '-card-' + cardIdx" :card="card" @click="toggleCards(cards.map(c => c.id))" :is-selected="cardsToggled.includes(card.id)" />
            </div>
        </div>
        <div v-if="readyToConfirm" class="col-span-10 flex justify-center items-center">
            <UiButton @click="confirmJudgement">Confirm Judgement</UiButton>
        </div>
    </div>
</template>