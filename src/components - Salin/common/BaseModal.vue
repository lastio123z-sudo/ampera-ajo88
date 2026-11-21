<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeOnBackdrop && $emit('update:modelValue', false)">
        <div class="modal-box" :style="{ maxWidth: width }">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '480px' },
  closeOnBackdrop: { type: Boolean, default: true }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(18, 38, 27, 0.52);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 16px;
}
.modal-box {
  background: var(--color-white);
  border: 1px solid rgba(255,255,255,0.65);
  border-radius: 20px;
  box-shadow: 0 28px 80px rgba(13, 35, 22, 0.28);
  width: 100%;
  max-height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #edf0e9;
}
.modal-title { font-size: 15px; font-weight: 650; color: #2a4735; letter-spacing: -0.2px; }
.modal-close {
  background: none; border: none;
  width: 30px; height: 30px; border-radius: 9px;
  font-size: 13px; cursor: pointer; color: var(--color-text-muted);
  line-height: 1; padding: 4px; transition: background 0.2s, color 0.2s;
}
.modal-close:hover { background: #fae9e7; color: var(--color-danger); }
.modal-body { padding: 22px; overflow-y: auto; flex: 1; }
.modal-footer {
  padding: 14px 22px;
  border-top: 1px solid #edf0e9;
  display: flex; gap: 8px; justify-content: flex-end;
}

/* Transition */
.modal-enter-active, .modal-leave-active { transition: all 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.95); }
</style>
