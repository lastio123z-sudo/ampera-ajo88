<template>
  <BaseModal v-model="show" title="Nota Pembayaran" width="420px" :close-on-backdrop="false">
    <div v-if="transaction" class="receipt">
      <div class="receipt__header">
        <div class="receipt__logo">🍛</div>
        <h2 class="receipt__title">AMPERA AJO</h2>
        <p class="receipt__sub">Warung Padang Spesial</p>
        <div class="receipt__divider">- - - - - - - - - - - - - - -</div>
        <div class="receipt__meta">
          <div class="receipt__meta-row">
            <span>No. Nota</span>
            <span>{{ transaction.nomorNota }}</span>
          </div>
          <div class="receipt__meta-row">
            <span>Kasir</span>
            <span>{{ transaction.kasir.nama }}</span>
          </div>
          <div class="receipt__meta-row">
            <span>Tanggal</span>
            <span>{{ formatTanggal(transaction.tanggal) }}</span>
          </div>
        </div>
        <div class="receipt__divider">- - - - - - - - - - - - - - -</div>
      </div>

      <div class="receipt__items">
        <div v-for="item in transaction.items" :key="item.produkId" class="receipt__item">
          <div class="receipt__item-name">{{ item.nama }}</div>
          <div class="receipt__item-detail">
            <span>{{ item.jumlah }} x {{ formatHarga(item.harga) }}</span>
            <span>{{ formatHarga(item.subtotal) }}</span>
          </div>
        </div>
      </div>

      <div class="receipt__divider">- - - - - - - - - - - - - - -</div>
      <div class="receipt__summary">
        <div class="receipt__summary-row">
          <span>Total</span>
          <strong>{{ formatHarga(transaction.total) }}</strong>
        </div>
        <div class="receipt__summary-row">
          <span>Bayar</span>
          <span>{{ formatHarga(transaction.bayar) }}</span>
        </div>
        <div class="receipt__summary-row receipt__summary-row--kembalian">
          <span>Kembalian</span>
          <strong>{{ formatHarga(transaction.kembalian) }}</strong>
        </div>
      </div>
      <div class="receipt__divider">- - - - - - - - - - - - - - -</div>
      <p class="receipt__thank">Terima kasih telah berkunjung!</p>
      <p class="receipt__thank">Selamat makan 🙏</p>
    </div>

    <template #footer>
      <BaseButton variant="outline" @click="show = false">Tutup</BaseButton>
      <BaseButton variant="primary" @click="handlePrint">🖨️ Cetak Nota</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  transaction: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue'])

const show = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

function formatHarga(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

function formatTanggal(iso) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function handlePrint() {
  window.print()
}
</script>

<style scoped>
.receipt {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #333;
  text-align: center;
}
.receipt__logo { font-size: 32px; }
.receipt__title { font-size: 18px; font-weight: 700; margin: 4px 0 2px; }
.receipt__sub { font-size: 12px; color: #666; }
.receipt__divider { color: #999; margin: 10px 0; letter-spacing: 2px; }
.receipt__meta { text-align: left; display: flex; flex-direction: column; gap: 4px; }
.receipt__meta-row {
  display: flex; justify-content: space-between; gap: 8px;
  font-size: 12px;
}
.receipt__items { text-align: left; }
.receipt__item { margin-bottom: 6px; }
.receipt__item-name { font-weight: 600; }
.receipt__item-detail { display: flex; justify-content: space-between; color: #555; font-size: 12px; }
.receipt__summary { display: flex; flex-direction: column; gap: 4px; }
.receipt__summary-row { display: flex; justify-content: space-between; padding: 2px 0; }
.receipt__summary-row--kembalian { color: #2D6A4F; font-weight: 700; font-size: 15px; }
.receipt__thank { margin: 6px 0; font-size: 12px; color: #666; }
</style>
