<script setup lang="ts">
const props = withDefaults(defineProps<{
    options: {
        [value: string]: string
    },
    modelValue?: string,
    disabled?: boolean
}>(), {
    disabled: false
});

const emit = defineEmits<{ (e: 'update:modelValue', value: string): InputEvent }>();

function handleInput(event: InputEvent) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
    <select :value="props.modelValue" @change="handleInput($event as InputEvent)" :disabled="disabled" 
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring 
            focus:ring-indigo-200 focus:ring-opacity-50 text-black dark:text-gray text-sm">
        <option v-for="(entry, idx) in Object.entries(props.options)" :key="'option-' + idx" :value="entry[0]">{{ entry[1] }}</option>
    </select>
</template>