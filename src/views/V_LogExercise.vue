<script setup>
import { onMounted } from 'vue'
import {
  dayState,
  loadDayData,
  saveDayToCloud,
} from '../funcs/globalState.js'
import ExerciseForm from '../components/ExerciseForm.vue'

const onNewExercise = (data) => {
  dayState.exercises.push(data)
}

onMounted(() => {
  loadDayData()
})
</script>

<template>
  <div class="section">
    <h2>Ejercicio</h2>

    <!-- INYECTAMOS NUESTRO COMPONENTE MUEBLE Y ESCUCHAMOS SU EVENTO -->
    <ExerciseForm @new-exercise="onNewExercise" />

    <div class="results-list">
      <ul>
        <li v-for="(ex, index) in dayState.exercises" :key="'ex-' + index">
          <h4>{{ ex.muscle }}</h4>
          <p>
            Realizados: {{ ex.exercise }}. Detalle: {{ ex.sets }}X{{
              ex.reps
            }}
            utilizando {{ ex.weight }}kg
          </p>
        </li>
      </ul>
    </div>
  </div>

  <button @click="saveDayToCloud" class="btn-giant">Guardar Día Completo</button>
</template>
