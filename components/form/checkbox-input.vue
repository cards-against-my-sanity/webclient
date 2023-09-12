<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: boolean,
    disabled?: boolean
}>(), {
    disabled: false
});

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): InputEvent }>();

function handleInput(event: InputEvent) {
    emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
    <input type="checkbox" :value="props.modelValue" @checked="" @input="handleInput($event as InputEvent)" :disabled="disabled"
        class="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring 
                            focus:ring-indigo-200 focus:ring-opacity-50 text-black dark:text-gray" />
</template>