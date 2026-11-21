<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>
    <div class="base-input__wrapper">
      <span v-if="prefix" class="base-input__prefix">{{ prefix }}</span>
      <component
        :is="type === 'textarea' ? 'textarea' : (type === 'select' ? 'select' : 'input')"
        :id="inputId"
        v-bind="inputAttrs"
        :value="modelValue"
        :class="['base-input__field', { 'base-input__field--prefix': prefix }]"
        @input="$emit('update:modelValue', $event.target.value)"
        @change="$emit('change', $event.target.value)"
        @blur="$emit('blur', $event)"
      >
        <template v-if="type === 'select'">
          <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
          <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </template>
      </component>
    </div>
    <p v-if="error" class="base-input__error">{{ error }}</p>
    <p v-if="hint && !error" class="base-input__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  prefix: { type: String, default: '' },
  options: { type: Array, default: () => [] }, // [{ value, label }]
  id: { type: String, default: '' }
})
defineEmits(['update:modelValue', 'change', 'blur'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
const inputAttrs = computed(() => ({
  type: props.type !== 'select' && props.type !== 'textarea' ? props.type : undefined,
  placeholder: props.placeholder,
  disabled: props.disabled,
  required: props.required
}))
</script>

<style scoped>
.base-input { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.base-input__label { font-size: 11px; font-weight: 600; color: #405246; }
.base-input__required { color: var(--color-danger); margin-left: 2px; }
.base-input__wrapper { position: relative; display: flex; }
.base-input__prefix {
  display: flex; align-items: center;
  padding: 0 12px;
  background: #f4f6f1;
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: 10px 0 0 10px;
  color: var(--color-text-muted);
  font-size: 11px;
  white-space: nowrap;
}
.base-input__field {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #dfe5dc;
  border-radius: 10px;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  color: #2f4035;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  width: 100%;
}
.base-input__field--prefix { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.base-input__field:focus { border-color: #83a18b; box-shadow: 0 0 0 3px rgba(45,106,79,0.11); }
.base-input__field:disabled { background: #f4f6f1; cursor: not-allowed; }
.base-input--error .base-input__field { border-color: var(--color-danger); }
.base-input--error .base-input__field:focus { box-shadow: 0 0 0 3px rgba(230,57,70,0.15); }
.base-input__error { font-size: 10px; color: var(--color-danger); }
.base-input__hint { font-size: 10px; color: var(--color-text-muted); line-height: 1.5; }
textarea.base-input__field { resize: vertical; min-height: 88px; }
</style>
