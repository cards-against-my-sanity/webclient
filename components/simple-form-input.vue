<script setup lang="ts">
const props = withDefaults(defineProps<{
    type: "text" | "email" | "password" | "number",
    title: string,
    titleClasses?: string,
    caption?: string,
    placeholder?: string,
    modelValue?: string | number,
    disabled?: boolean
}>(), {
    titleClasses: "",
    caption: undefined,
    placeholder: undefined,
    disabled: false
});

const emit = defineEmits<{(e: 'update:modelValue', value: string): Event}>();

function handleInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
    <label class="block">
        <SimpleTitle :title="props.title" :title-classes="props.titleClasses" :caption="props.caption" />
        <input 
            :type="props.type" 
            :value="props.modelValue"
            @input="handleInput"
            :disabled="disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring 
                            focus:ring-indigo-200 focus:ring-opacity-50 text-black dark:text-gray" 
            :placeholder="props.placeholder || undefined" 
        />
    </label>
</template>