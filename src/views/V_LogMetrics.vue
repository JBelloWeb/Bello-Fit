<script setup>
import { onMounted } from 'vue'
import {
  dayState,
  metricsInputs,
  loadDayData,
  saveDayToCloud,
} from '../funcs/globalState.js'

onMounted(() => {
  loadDayData()
})
</script>

<template>
  <main>
    <div class="section">
      <h2>Métricas diarias (Sumar)</h2>
      <label>Agua (Vasos a sumar)</label> <br />
      <input type="number" v-model="metricsInputs.water" /> <br /><br />
      <label>Sueño (Horas a sumar)</label> <br />
      <input type="number" step="0.5" v-model="metricsInputs.sleep" /> <br /><br />
      <p>
        <em
          >Total actual en BD: {{ dayState.metrics.water }} vasos |
          {{ dayState.metrics.sleep }} horas</em
        >
      </p>
    </div>

    <br />
    <button @click="saveDayToCloud" class="btn-giant">Guardar Día Completo</button>
  </main>
</template>

<style scoped>
main {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
h1 {
  text-align: center;
  color: #333;
}
.section {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}
input {
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-secondary {
  background-color: var(--bello-purple);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.btn-giant {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background-color: var(--bello-red);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.results-list {
  margin-top: 15px;
}
</style>
