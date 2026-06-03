<script setup>
import { onMounted } from 'vue'
import {
  dayState,
  loadDayData,
  saveDayToCloud,
} from '../funcs/globalState.js'
import ExerciseForm from '../components/ExerciseForm.vue'

const recibirEjercicioDelHijo = (datos) => {
  dayState.exercises.push(datos)
}

onMounted(() => {
  loadDayData()
})
</script>

<template>
  <CalendarioSemanal />

  <div class="seccion">
    <h2>Ejercicio</h2>

    <!-- INYECTAMOS NUESTRO COMPONENTE MUEBLE Y ESCUCHAMOS SU EVENTO -->
    <ExerciseForm @new-exercise="recibirEjercicioDelHijo" />

    <div class="lista-resultados">
      <ul>
        <li v-for="(ej, index) in dayState.exercises" :key="'ej-' + index">
          <h4>{{ ej.muscle }}</h4>
          <p>
            Realizados: {{ ej.exercise }}. Detalle: {{ ej.sets }}X{{
              ej.reps
            }}
            utilizando {{ ej.weight }}kg
          </p>
        </li>
      </ul>
    </div>
  </div>

  <button @click="saveDayToCloud" class="btn-gigante">Guardar Día Completo</button>
</template>
