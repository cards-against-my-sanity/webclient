<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: number,
    min?: number,
    max?: number,
    disabled?: boolean,
    placeholder?: string
}>(), {
    disabled: false,
    placeholder: undefined
});

const emit = defineEmits<{ (e: 'update:modelValue', value: number): InputEvent }>();

function handleInput(event: InputEvent) {
    emit('update:modelValue', parseInt((event.target as HTMLInputElement).value));
}
</script>

<template>
    <div class="relative">
        <input type="number" :value="props.modelValue" @input="handleInput($event as InputEvent)" :disabled="disabled"
            :min="props.min" :max="props.max" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring 
                            focus:ring-indigo-200 focus:ring-opacity-50 text-black dark:text-gray"
            :placeholder="props.placeholder || undefined" />
        <slot></slot>
    </div>
</template>