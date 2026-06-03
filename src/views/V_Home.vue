<script setup>
import { onMounted } from 'vue'
<<<<<<< HEAD
import { dayState, loadDayData } from '../funcs/globalState'
import TodayStats from '../components/TodayStats.vue'

onMounted(() => {
  loadDayData()
=======
import { estadoDia, cargarDatosDelDia } from '../funcs/estadoGlobal'
import EstadisticasHoy from '../components/EstadisticasHoy.vue'

onMounted(() => {
  cargarDatosDelDia()
>>>>>>> 20226b31c21bfb61027002dd8d77c1ee6fb53207
})
</script>

<template>
  <main>
    <h1>BELLO-FIT</h1>

<<<<<<< HEAD
    <TodayStats
      :water="dayState.metrics.water"
      :sleep="dayState.metrics.sleep"
      :exercise="dayState.exercises.length"
=======
    <EstadisticasHoy
      :agua="estadoDia.metricas.agua"
      :suenio="estadoDia.metricas.suenio"
      :ejercicio="estadoDia.ejercicios.length"
>>>>>>> 20226b31c21bfb61027002dd8d77c1ee6fb53207
    />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  margin: auto;
  margin-top: 50px;
  color: var(--bello-red);
  text-shadow: rgb(215 38 56 / 80%) 0px 0px 7px;
}
.sticky-component {
  position: sticky;
  top: 10px;
  z-index: 10;
}
</style>
