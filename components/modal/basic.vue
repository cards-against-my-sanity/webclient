<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";

const { open } = defineProps<{ open: boolean }>();
defineEmits<{ (e: 'close'): void }>();
</script>

<template>
    <Teleport to="body">
        <div v-if="open" @keydown.esc="$emit('close')" class="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/80">
            <div class="relative bg-white rounded-md py-8 w-1/3">
                <div class="absolute pr-3 mt-2 right-0 top-0">
                    <XMarkIcon class="h-6 w-6 cursor-pointer" @click="$emit('close')" />
                </div>
                <div class="px-2">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>