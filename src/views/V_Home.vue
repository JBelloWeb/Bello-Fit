<script setup>
import { onMounted } from 'vue'
import { dayState, loadDayData } from '../funcs/globalState'
import TodayStats from '../components/TodayStats.vue'

onMounted(() => {
  loadDayData()
</script>

<template>
  <main>
    <h1>BELLO-FIT</h1>
    <TodayStats
      :water="dayState.metrics.water"
      :sleep="dayState.metrics.sleep"
      :exercise="dayState.exercises.length"
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
