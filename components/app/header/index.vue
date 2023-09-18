<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
import { MoonIcon, SunIcon, EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/solid';

const colorMode = useColorMode();
const activeGameStore = useActiveGameStore();

const colorModeIcon = computed(() => {
    if (colorMode.preference === 'system') {
        if (colorMode.value === 'dark') {
            return SunIcon;
        } else {
            return MoonIcon;
        }
    } else if (colorMode.preference === 'dark') {
        return SunIcon;
    } else {
        return MoonIcon;
    }
});

function toggleColorPreference() {
    if (colorMode.preference === 'system') {
        if (colorMode.value === 'dark') {
            colorMode.preference = 'light';
        } else {
            colorMode.preference = 'dark';
        }
    } else if (colorMode.preference === 'dark') {
        colorMode.preference = 'light';
    } else {
        colorMode.preference = 'dark';
    }
}
</script>

<template>
    <div class="flex justify-between items-center py-2">
        <img src="/logo.svg" class="w-20 h-20" alt="Cards Against My Sanity Logo" />
        <nav class="flex justify-evenly items-center list-none gap-x-2 text-lg">
            <client-only>
                <UiButton class="px-2 py-1" @click="toggleColorPreference">
                    <component class="h-4 w-4 inline cursor-pointer" :is="colorModeIcon" />
                </UiButton>
            </client-only>
            <AppHeaderInGame v-if="activeGameStore.exists" />
            <AppHeaderNoGame v-else />
        </nav>
    </div>
</template>