<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const activeGameStore = useActiveGameStore();
const cardsBeingJudged = computed(() => activeGameStore.cardsBeingJudged);
const blackCard = computed(() => activeGameStore.blackCard!);
</script>

<template>
    <div class="col-span-2">
        <GameCardBlackCard :card="blackCard" />
    </div>
    <div class="col-span-8 grid grid-cols-5 gap-4 mb-6">
        <div v-for="(cards, setIdx) in cardsBeingJudged" :key="'white-cards-' + setIdx" class="border-2 col-span-2 dark:border-white p-4 flex">
            <GameCardWhiteCard v-for="(card, cardIdx) in cards" :key="'white-cards-' + setIdx + '-card-' + cardIdx"
                :content="card.content" />
        </div>
    </div>
</template>