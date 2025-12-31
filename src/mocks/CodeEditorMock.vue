<template>
  <div class="mock-code-editor">
    <textarea :value="modelValue" @input="$emit('update:modelValue', ($event.target as any).value)"></textarea>
  </div>
</template>

<script setup lang="ts">
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>
