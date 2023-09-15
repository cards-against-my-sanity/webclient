<script setup lang="ts">
const props = withDefaults(defineProps<{
    type: "text" | "email" | "password",
    modelValue?: string | number,
    disabled?: boolean,
    placeholder?: string
}>(), {
    disabled: false,
    placeholder: undefined
});

const emit = defineEmits<{ 
    (e: 'update:modelValue', value: string): void,
    (e: 'change', value: InputEvent): void 
}>();

function handleInput(event: InputEvent) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
    <input :type="props.type" :value="props.modelValue" @input="handleInput($event as InputEvent)" @change="$emit('change', $event)" :disabled="disabled"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring 
                            focus:ring-indigo-200 focus:ring-opacity-50 text-black dark:text-gray text-sm placeholder:text-sm"
        :placeholder="props.placeholder || undefined" />
    <slot></slot>
</template>