<template>
  <div class="product-card" :class="{ 'product-card--unavailable': !product.tersedia }">
    <div class="product-card__header">
      <span class="product-card__kategori">{{ product.kategori }}</span>
      <span :class="['badge', product.tersedia ? 'badge-success' : 'badge-danger']">
        {{ product.tersedia ? 'Tersedia' : 'Habis' }}
      </span>
    </div>
    <div class="product-card__image">
      <img
        v-if="product.gambar && !imageFailed"
        :src="product.gambar"
        :alt="`Foto ${product.nama}`"
        @error="handleImageError"
      />
      <span v-else class="product-card__icon" aria-hidden="true">{{ fallbackIcon }}</span>
    </div>
    <h3 class="product-card__name">{{ product.nama }}</h3>
    <p class="product-card__desc">{{ product.deskripsi }}</p>
    <div class="product-card__footer">
      <span class="product-card__harga">{{ formatHarga(product.harga) }}</span>
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const imageFailed = ref(false)
const fallbackIcon = computed(() => {
  const name = props.product.nama.toLowerCase()
  if (name.includes('ayam')) return '🍗'
  if (name.includes('ikan')) return '🐟'
  if (name.includes('telur')) return '🍳'
  if (name.includes('nasi')) return '🍚'
  if (name.includes('sambal')) return '🌶️'
  if (name.includes('sayur') || name.includes('cubadak')) return '🥬'
  if (name.includes('perkedel')) return '🥔'
  if (name.includes('dendeng')) return '🥩'
  if (name.includes('rendang') || name.includes('gulai')) return '🍛'
  return '🍽️'
})

watch(() => props.product.gambar, () => {
  imageFailed.value = false
})

function handleImageError() {
  imageFailed.value = true
}

function formatHarga(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 22px;
  box-shadow: 0 8px 24px rgba(34, 49, 39, 0.045);
  padding: 11px;
  display: flex; flex-direction: column; gap: 8px;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}
.product-card:hover {
  border-color: rgba(45, 106, 79, 0.28);
  box-shadow: 0 18px 38px rgba(34, 49, 39, 0.12);
  transform: translateY(-5px);
}
.product-card--unavailable { opacity: 0.6; }
.product-card__header { display: flex; align-items: center; justify-content: space-between; padding: 4px 3px 1px; }
.product-card__kategori {
  font-size: 10px; font-weight: 600; letter-spacing: 0.25px;
  color: #286044; background: #eaf3e9;
  padding: 5px 10px; border-radius: 20px;
}
.product-card__image {
  height: 184px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 15px;
  background:
    radial-gradient(circle at 50% 46%, rgba(255, 255, 255, 0.9) 0 29%, transparent 30%),
    radial-gradient(circle at 50% 52%, rgba(235, 190, 128, 0.38), transparent 60%),
    linear-gradient(145deg, #f7edda, #f5f4e9 60%, #e5eee4);
}
.product-card__image img { width: 100%; height: 100%; object-fit: cover; }
.product-card__icon { font-size: 62px; filter: drop-shadow(0 10px 9px rgba(80, 57, 28, 0.16)); }
.product-card__name { padding: 4px 3px 0; font-size: 16px; font-weight: 650; color: #273b30; letter-spacing: -0.25px; }
.product-card__desc { padding: 0 3px; font-size: 11px; color: #7b817b; line-height: 1.55; flex: 1; }
.product-card__footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 5px; padding: 12px 3px 3px;
  border-top: 1px solid #f0eee8;
}
.product-card__harga { font-size: 16px; font-weight: 700; color: #bd644c; letter-spacing: -0.3px; }
@media (max-width: 600px) {
  .product-card__image { height: 158px; }
  .product-card__name { font-size: 15px; }
}
</style>
