<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
const allDisabled = computed(() => !activeGameStore.iAmTheHost);

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

    if (game.value.settings.roundIntermissionSeconds < 0) {
        game.value.settings.roundIntermissionSeconds = 0;
    }

    if (game.value.settings.gameWinIntermissionSeconds < 0) {
        game.value.settings.gameWinIntermissionSeconds = 0;
    }

    waitingForSettingsAck.value = true;

    await nuxtApp.$socket.emitWithAck('changeGameSettings', {
        settings: game.value.settings
    });

    waitingForSettingsAck.value = false;
}

const plaintextPassword = ref<string>("");
async function updatePassword() {
    waitingForSettingsAck.value = true;

    await nuxtApp.$socket.emitWithAck('changeGameSettings', {
        settings: {
            password: plaintextPassword.value
        }
    });

    waitingForSettingsAck.value = false;

    nuxtApp.$sendSuccessNotification("The password was set.", "Note: If you modify the password field again, it will be overridden.")
    setTimeout(() => plaintextPassword.value = "", 500);
}

async function clearPassword() {
    waitingForSettingsAck.value = true;

    await nuxtApp.$socket.emitWithAck('changeGameSettings', {
        settings: {
            password: ""
        }
    });

    waitingForSettingsAck.value = false;

    nuxtApp.$sendSuccessNotification("The password was removed.", "")
}
</script>

<template>
    <div class="grid grid-cols-4 auto-rows-min gap-x-4 gap-y-6">
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
            <FormNumberInput v-model="game.settings.roundIntermissionSeconds" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="0">
            </FormNumberInput>
        </div>
        <div>
            <UiCaptionedTitle title="Game Win Intermission" title-classes="font-bold text-sm"
                caption="Measured in seconds." />
            <FormNumberInput v-model="game.settings.gameWinIntermissionSeconds" @input="updateSettings"
                :disabled="allDisabled || waitingForSettingsAck" :min="0" />
        </div>
        <div>
            <UiCaptionedTitle title="Mid-Game Joining" title-classes="font-bold text-sm"
                caption="Can players join mid-game?" />
            <FormSelectInput :model-value="game.settings.allowPlayersToJoinMidGame ? 'true' : 'false'"
                :disabled="allDisabled || waitingForSettingsAck" @input="handleAllowPlayersToJoinMidGame($event)" :options="{ 'false': 'No', 'true': 'Yes' }" />
        </div>
        <div class="col-span-2">
            <UiCaptionedTitle title="Game Password" title-classes="font-bold text-sm"
                caption="A password users must enter to join. Leave empty for none. You must click away to apply the password." />
            <div class="flex justify-evenly gap-x-2">
                <FormStringInput type="password" v-model="plaintextPassword" @change="updatePassword"
                    :disabled="allDisabled || waitingForSettingsAck"
                    :placeholder="game.settings.hasPassword ? 'A password is set.' : 'No password is set.'" />
                <UiButton v-if="game.settings.hasPassword && activeGameStore.iAmTheHost" :disabled="allDisabled || waitingForSettingsAck" @click="clearPassword" class="text-xs w-40 flex justify-center items-center">Remove Password</UiButton>
            </div>
        </div>
    </div>
</template>