<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { useModalStore } from "~/stores/modal.store";

const { open } = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

function doClose() {
    emit('close')
    useModalStore().flashMessage = null;
}
</script>

<template>
    <Teleport to="body">
        <div v-if="open" class="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/95">
            <div @keydown.esc="doClose" class="relative bg-white dark:bg-zinc-900 dark:text-white rounded-md py-8 w-10/12">
                <div class="absolute pr-3 mt-2 right-0 top-0">
                    <XMarkIcon class="h-6 w-6 cursor-pointer" @click="doClose" />
                </div>
                <div class="px-2">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>