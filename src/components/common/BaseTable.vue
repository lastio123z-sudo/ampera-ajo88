<template>
  <div class="base-table-container">
    <div v-if="isLoading" class="base-table__loading">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>
    <div v-else-if="!rows.length" class="base-table__empty">
      <p>{{ emptyText }}</p>
    </div>
    <table v-else class="base-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="col.style">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="row.id || idx">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '-' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label, style? }]
  rows: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  emptyText: { type: String, default: 'Tidak ada data' }
})
</script>

<style scoped>
.base-table-container { overflow-x: auto; border-radius: 12px; }
.base-table {
  width: 100%;
  min-width: 620px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 11px;
}
.base-table th {
  background: #f1f4ed;
  border-bottom: 1px solid #e3e8df;
  color: #607065;
  padding: 11px 14px;
  text-align: left;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.55px;
  text-transform: uppercase;
  white-space: nowrap;
}
.base-table th:first-child { border-radius: 10px 0 0 0; }
.base-table th:last-child { border-radius: 0 10px 0 0; }
.base-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf0e9;
  vertical-align: middle;
  color: #48564b;
  white-space: nowrap;
}
.base-table tbody tr { background: #fff; transition: background 0.15s; }
.base-table tbody tr:hover { background: #f7f9f4; }
.base-table tbody tr:last-child td { border-bottom: none; }
.base-table__loading, .base-table__empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 150px; padding: 32px; border-radius: 12px;
  background: #f8f9f5; color: var(--color-text-muted);
  gap: 12px;
  font-size: 11px;
}
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e3e9df;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
