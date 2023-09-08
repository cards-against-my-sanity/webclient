<script setup lang="ts">
const { title, caption, type } = defineProps<{
    type: "text" | "email" | "password",
    title: string,
    caption?: string,
    placeholder: string,
    modelValue: string
}>();

const emit = defineEmits<{(e: 'update:modelValue', value: string): Event}>();

function handleInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
    <label class="block">
        <span class="text-gray-700 dark:text-gray-100">{{ title }}</span>

        <span v-if="caption" class="text-xs text-gray-500 dark:text-gray-600 block">
            {{ caption }}
        </span>

        <input 
            :type="type" 
            :value="modelValue"
            @input="handleInput"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring 
                            focus:ring-indigo-200 focus:ring-opacity-50 text-black dark:text-gray" 
            :placeholder="placeholder" 
        />
    </label>
</template>