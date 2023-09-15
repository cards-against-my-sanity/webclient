<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
const allDisabled = computed(() => !activeGameStore.isHost);

function handleAllowPlayersToJoinMidGame(event: InputEvent) {
    game.value.settings.allowPlayersToJoinMidGame =
        (event.target as HTMLSelectElement).value === 'true' ? true : false;

    updateSettings();
}

const waitingForSettingsAck = ref<boolean>(false)
async function updateSettings() {
    if (game.value.settings.maxPlayers < 3) {
        game.value.settings.maxPlayers = 3;
    }

    if (game.value.settings.maxSpectators < 0) {
        game.value.settings.maxSpectators = 0;
    }

    if (game.value.settings.maxScore < 1) {
        game.value.settings.maxScore = 1;
    }

    if (game.value.settings.roundIntermissionTimer < 0) {
        game.value.settings.roundIntermissionTimer = 0;
    }

    if (game.value.settings.gameWinIntermissionTimer < 0) {
        game.value.settings.gameWinIntermissionTimer = 0;
    }

    if (game.value.settings.playingTimer < 15) {
        game.value.settings.playingTimer = 15;
    }

    if (game.value.settings.judgingTimer < 15) {
        game.value.settings.judgingTimer = 15;
    }
    
    waitingForSettingsAck.value = true;

    const resp = await nuxtApp.$socketOps.changeGameSettings(game.value.settings);
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Game settings not updated. ${resp.message}`);
    }

    waitingForSettingsAck.value = false;
}
</script>

<template>
    <div class="grid grid-cols-2 auto-rows-min gap-x-4 gap-y-6">
        <div>
            <UiCaptionedTitle title="Max Players" title-classes="font-bold text-sm" caption="Don't add too many." />
            <FormNumberInput v-model="game.settings.maxPlayers" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="3" />
        </div>
        <div>
            <UiCaptionedTitle title="Max Spectators" title-classes="font-bold text-sm" caption="How many creeps?" />
            <FormNumberInput v-model="game.settings.maxSpectators" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="0" />
        </div>
        <div>
            <UiCaptionedTitle title="Max Score" title-classes="font-bold text-sm" caption="How many rounds?" />
            <FormNumberInput v-model="game.settings.maxScore" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="1" />
        </div>
        <div>
            <UiCaptionedTitle title="Round Intermission" title-classes="font-bold text-sm" caption="Measured in seconds." />
            <FormNumberInput v-model="game.settings.roundIntermissionTimer" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="0">
            </FormNumberInput>
        </div>
        <div>
            <UiCaptionedTitle title="Game Win Intermission" title-classes="font-bold text-sm"
                caption="Measured in seconds." />
            <FormNumberInput v-model="game.settings.gameWinIntermissionTimer" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="0" />
        </div>
        <div>
            <UiCaptionedTitle title="Playing Timer" title-classes="font-bold text-sm"
                caption="How long to play cards. Measured in seconds." />
            <FormNumberInput v-model="game.settings.playingTimer" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="15" />
        </div>
        <div>
            <UiCaptionedTitle title="Judging Timer" title-classes="font-bold text-sm"
                caption="How long to judge cards. Measured in seconds." />
            <FormNumberInput v-model="game.settings.judgingTimer" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="15" />
        </div>
        <div>
            <UiCaptionedTitle title="Mid-Game Joining" title-classes="font-bold text-sm"
                caption="Can players join mid-game?" />
            <FormSelectInput :model-value="game.settings.allowPlayersToJoinMidGame ? 'true' : 'false'"
                :disabled="allDisabled || waitingForSettingsAck" @input="handleAllowPlayersToJoinMidGame($event)" :options="{ 'false': 'No', 'true': 'Yes' }" />
        </div>
    </div>
</template>