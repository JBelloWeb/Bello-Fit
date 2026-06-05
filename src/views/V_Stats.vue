<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

// Variable para mostrar un "Cargando..." mientras Supabase busca los datos
const loading = ref(true)

// 1. CONFIGURACIÓN VISUAL DEL GRÁFICO
const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false }, // Oculta el menú de descargar/zoom
  },
  plotOptions: {
    bar: { borderRadius: 4, horizontal: true },
  },
  colors: ['#9b7dff'], // Token: var(--bello-purple)
  dataLabels: { enabled: true },
  xaxis: {
    categories: [], // Acá irán los nombres de los músculos
  },
})

// 2. LOS DATOS REALES
const chartSeries = ref([
  {
    name: 'Veces entrenado',
    data: [], // Acá irán las cantidades
  },
])

// 3. LA LÓGICA MATEMÁTICA
const calculateStats = async () => {
  loading.value = true

  try {
    // Traemos absolutamente todos los ejercicios de la base de datos
    const { data: exercises, error } = await supabase.from('ejercicio').select('musculo')

    if (error) throw error

    if (exercises && exercises.length > 0) {
      // Objeto temporal para contar: { "PECHO": 4, "ESPALDA": 2 }
      const muscleCount = {}

      exercises.forEach((ex) => {
        // Pasamos todo a mayúsculas y quitamos espacios para que "Pecho" y "pecho " sumen juntos
        const cleanedMuscle = ex.musculo.trim().toUpperCase()

        if (muscleCount[cleanedMuscle]) {
          muscleCount[cleanedMuscle]++
        } else {
          muscleCount[cleanedMuscle] = 1
        }
      })

      // Inyectamos el resultado en las variables del gráfico
      chartOptions.value.xaxis.categories = Object.keys(muscleCount)
      chartSeries.value[0].data = Object.values(muscleCount)
    }
  } catch (error) {
    console.error('Error calculando estadísticas:', error)
  } finally {
    loading.value = false
  }
}

// Disparamos el cálculo al abrir la pestaña
onMounted(() => {
  calculateStats()
})
</script>

<template>
  <main>
    <h1>Estadísticas 📊</h1>

    <div v-if="loading" class="loading-message">
      <p>Calculando tu progreso histórico...</p>
    </div>

    <div v-else class="chart-card">
      <h3>Distribución Muscular</h3>

      <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>
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
  color: var(--bello-red);
  text-shadow: rgb(215 38 56 / 80%) 0px 0px 7px;
}
.chart-card {
  background: white;
  border: 1px solid var(--bello-border);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
}
h3 {
  margin-top: 0;
  text-align: center;
  color: #333;
  font-size: 1.1rem;
}
.loading-message {
  text-align: center;
  color: var(--bello-text-muted);
  font-style: italic;
  margin-top: 40px;
}
</style>
