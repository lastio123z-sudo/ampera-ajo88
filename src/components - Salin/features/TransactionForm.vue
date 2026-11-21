<template>
  <div class="transaction-form">
    <!-- Search & Filter -->
    <div class="form-search">
      <BaseInput v-model="searchQuery" placeholder="Cari menu..." />
      <BaseInput
        v-model="filterKategori"
        type="select"
        :options="[{ value: '', label: 'Semua Kategori' }, ...kategoriOptions]"
        placeholder="Semua Kategori"
      />
    </div>

    <!-- Menu Grid -->
    <div class="form-menu-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="form-menu-item"
        :class="{ 'form-menu-item--unavailable': !product.tersedia }"
        @click="product.tersedia && addToCart(product)"
      >
        <div class="form-menu-item__icon">🍽️</div>
        <div class="form-menu-item__info">
          <span class="form-menu-item__name">{{ product.nama }}</span>
          <span class="form-menu-item__harga">{{ formatHarga(product.harga) }}</span>
        </div>
        <button v-if="product.tersedia" class="form-menu-item__add">+</button>
        <span v-else class="form-menu-item__habis">Habis</span>
      </div>
    </div>

    <!-- Cart -->
    <div v-if="cart.length" class="form-cart">
      <h4 class="form-cart__title">Keranjang ({{ cart.length }} item)</h4>
      <div class="form-cart__items">
        <div v-for="item in cart" :key="item.produkId" class="form-cart__item">
          <div class="form-cart__item-name">{{ item.nama }}</div>
          <div class="form-cart__item-controls">
            <button class="qty-btn" @click="decreaseQty(item)">−</button>
            <span class="qty-num">{{ item.jumlah }}</span>
            <button class="qty-btn" @click="increaseQty(item)">+</button>
          </div>
          <div class="form-cart__item-subtotal">{{ formatHarga(item.subtotal) }}</div>
          <button class="form-cart__item-remove" @click="removeFromCart(item.produkId)">✕</button>
        </div>
      </div>
      <div class="form-cart__total">
        <span>Total</span>
        <span class="form-cart__total-value">{{ formatHarga(cartTotal) }}</span>
      </div>

      <!-- Pembayaran -->
      <div class="form-payment">
        <BaseInput
          v-model="bayar"
          type="number"
          label="Jumlah Bayar (Rp)"
          placeholder="Masukkan jumlah bayar"
          prefix="Rp"
        />
        <div v-if="Number(bayar) >= cartTotal" class="form-payment__kembalian">
          <span>Kembalian:</span>
          <strong>{{ formatHarga(Number(bayar) - cartTotal) }}</strong>
        </div>
        <div v-if="Number(bayar) > 0 && Number(bayar) < cartTotal" class="form-payment__kurang text-danger">
          Pembayaran kurang {{ formatHarga(cartTotal - Number(bayar)) }}
        </div>
        <BaseButton
          variant="success"
          block
          :disabled="!canProcess"
          :loading="isProcessing"
          @click="processTransaction"
        >
          🧾 Proses Transaksi
        </BaseButton>
      </div>
    </div>
    <div v-else class="form-empty">
      <p>Pilih menu dari daftar di atas untuk memulai transaksi</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['transaction-done'])

const productsStore = useProductsStore()
const transactionsStore = useTransactionsStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const filterKategori = ref('')
const cart = ref([])
const bayar = ref('')
const isProcessing = ref(false)

const kategoriOptions = computed(() =>
  productsStore.kategoris.map(k => ({ value: k, label: k }))
)

const filteredProducts = computed(() => {
  return productsStore.products.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchKategori = !filterKategori.value || p.kategori === filterKategori.value
    return matchSearch && matchKategori
  })
})

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.subtotal, 0))

const canProcess = computed(() =>
  cart.value.length > 0 && Number(bayar.value) >= cartTotal.value
)

function addToCart(product) {
  const existing = cart.value.find(i => i.produkId === product.id)
  if (existing) {
    existing.jumlah++
    existing.subtotal = existing.jumlah * existing.harga
  } else {
    cart.value.push({
      produkId: product.id,
      nama: product.nama,
      harga: product.harga,
      jumlah: 1,
      subtotal: product.harga
    })
  }
}

function decreaseQty(item) {
  if (item.jumlah <= 1) return removeFromCart(item.produkId)
  item.jumlah--
  item.subtotal = item.jumlah * item.harga
}

function increaseQty(item) {
  item.jumlah++
  item.subtotal = item.jumlah * item.harga
}

function removeFromCart(produkId) {
  cart.value = cart.value.filter(i => i.produkId !== produkId)
}

async function processTransaction() {
  if (!canProcess.value) return
  isProcessing.value = true
  try {
    const transaksi = await transactionsStore.createTransaction({
      kasir: authStore.currentUser,
      items: [...cart.value],
      total: cartTotal.value,
      bayar: Number(bayar.value)
    })
    emit('transaction-done', transaksi)
    cart.value = []
    bayar.value = ''
  } finally {
    isProcessing.value = false
  }
}

function formatHarga(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.transaction-form { display: flex; flex-direction: column; gap: 17px; }
.form-search { display: grid; grid-template-columns: 1fr 190px; gap: 12px; }
.form-menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 11px; max-height: 360px; overflow-y: auto; padding: 2px 3px 4px 2px; }
.form-menu-item {
  background: #fff; border: 1px solid #e6eae2;
  border-radius: 14px; padding: 11px; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 3px 10px rgba(35, 54, 41, 0.03);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
}
.form-menu-item:hover:not(.form-menu-item--unavailable) { border-color: #b6cbb7; background: #fbfdf9; box-shadow: 0 8px 18px rgba(35, 54, 41, 0.08); transform: translateY(-2px); }
.form-menu-item--unavailable { opacity: 0.5; cursor: not-allowed; }
.form-menu-item__icon { display: grid; width: 39px; height: 39px; flex: 0 0 39px; place-items: center; border-radius: 12px; background: #f6efdf; font-size: 19px; }
.form-menu-item__info { flex: 1; min-width: 0; }
.form-menu-item__name { display: block; color: #36493b; font-size: 10px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.form-menu-item__harga { display: block; margin-top: 3px; font-size: 9px; color: var(--color-secondary-dark); font-weight: 700; }
.form-menu-item__add {
  background: #eaf2e8; color: var(--color-primary);
  border: none; border-radius: 9px; width: 27px; height: 27px;
  font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.form-menu-item__habis { padding: 4px 7px; border-radius: 99px; background: #fae9e7; color: var(--color-danger); font-size: 8px; }
.form-cart { border: 1px solid #dfe9dd; background: linear-gradient(145deg, #f3f8f0, #f9faf5); border-radius: 17px; padding: 18px; }
.form-cart__title { font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 500; margin-bottom: 12px; color: #2b5038; }
.form-cart__items { display: flex; flex-direction: column; gap: 8px; }
.form-cart__item {
  display: flex; align-items: center; gap: 8px;
  background: #fff; padding: 10px 12px;
  border: 1px solid #edf0e9; border-radius: 11px;
}
.form-cart__item-name { flex: 1; color: #3a4b3e; font-size: 10px; font-weight: 600; }
.form-cart__item-controls { display: flex; align-items: center; gap: 6px; }
.qty-btn {
  background: #e9f1e7; color: #315940; border: none;
  border-radius: 50%; width: 25px; height: 25px; font-size: 14px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.qty-num { font-weight: 600; min-width: 20px; text-align: center; font-size: 11px; }
.form-cart__item-subtotal { color: #315940; font-weight: 700; font-size: 11px; min-width: 80px; text-align: right; }
.form-cart__item-remove {
  background: none; border: none; color: var(--color-danger);
  cursor: pointer; font-size: 12px; padding: 4px 6px;
}
.form-cart__total {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 14px; padding-top: 13px; border-top: 1px solid #dce5d8;
  color: #415b47; font-size: 11px; font-weight: 600;
}
.form-cart__total-value { font-size: 19px; color: #2a543a; }
.form-payment { margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
.form-payment__kembalian {
  display: flex; justify-content: space-between;
  font-size: 11px; padding: 10px 12px;
  background: #e5f1e3; border: 1px solid #d5e7d2; border-radius: 10px; color: var(--color-success);
}
.form-payment__kurang { font-size: 10px; padding: 8px 10px; background: #fff0ef; border-radius: 10px; }
.form-empty { text-align: center; color: var(--color-text-muted); padding: 32px; border: 1px dashed #dfe5dc; background: #fafbf8; border-radius: 14px; font-size: 11px; }
@media (max-width: 640px) {
  .form-search { grid-template-columns: 1fr; }
  .form-menu-grid { grid-template-columns: 1fr; max-height: 280px; }
  .form-cart__item { flex-wrap: wrap; }
  .form-cart__item-name { min-width: 100px; }
  .form-cart__item-subtotal { margin-left: auto; }
}
</style>
