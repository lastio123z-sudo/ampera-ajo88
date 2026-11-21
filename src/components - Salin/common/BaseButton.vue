<template>
  <button
    :class="['base-btn', `base-btn--${variant}`, `base-btn--${size}`, { 'base-btn--block': block, 'base-btn--loading': loading }]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="base-btn__spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, success, warning, outline, ghost
  size: { type: String, default: 'md' },          // sm, md, lg
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.base-btn:disabled { opacity: 0.58; cursor: not-allowed; box-shadow: none; }
.base-btn:hover:not(:disabled) { transform: translateY(-1px); }

/* Sizes */
.base-btn--sm { padding: 7px 12px; font-size: 11px; }
.base-btn--md { padding: 9px 16px; font-size: 12px; }
.base-btn--lg { padding: 12px 21px; font-size: 13px; }
.base-btn--block { width: 100%; }

/* Variants */
.base-btn--primary { background: var(--color-primary); color: #fff; box-shadow: 0 5px 12px rgba(40, 88, 63, 0.16); }
.base-btn--primary:hover:not(:disabled) { background: var(--color-primary-dark); box-shadow: 0 8px 16px rgba(24, 59, 44, 0.2); }

.base-btn--secondary { background: var(--color-secondary); color: #3a3023; }
.base-btn--secondary:hover:not(:disabled) { background: #f0bf80; box-shadow: 0 6px 14px rgba(201, 119, 85, 0.18); }

.base-btn--success { background: var(--color-success); color: #fff; }
.base-btn--success:hover:not(:disabled) { background: #28583f; box-shadow: 0 6px 14px rgba(50, 116, 77, 0.18); }

.base-btn--danger { background: var(--color-danger); color: #fff; }
.base-btn--danger:hover:not(:disabled) { background: #c1121f; }

.base-btn--warning { background: var(--color-warning); color: #333; }
.base-btn--warning:hover:not(:disabled) { background: #d4a017; }

.base-btn--outline {
  background: #fff;
  border: 1px solid #d5e0d4;
  color: var(--color-primary);
}
.base-btn--outline:hover:not(:disabled) { border-color: var(--color-primary); background: #edf3eb; }

.base-btn--ghost { background: transparent; color: var(--color-text); }
.base-btn--ghost:hover:not(:disabled) { background: #f0f3ed; }

/* Spinner */
.base-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
