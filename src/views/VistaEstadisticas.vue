<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase.js';

// Variable para mostrar un "Cargando..." mientras Supabase busca los datos
const cargando = ref(true);

// 1. CONFIGURACIÓN VISUAL DEL GRÁFICO
const opcionesGrafico = ref({
  chart: { 
      type: 'bar', 
      toolbar: { show: false } // Oculta el menú de descargar/zoom
  },
  plotOptions: { 
      bar: { borderRadius: 4, horizontal: true } 
  },
  colors: ['#D72638'], // Tu color var(--bello-red)
  dataLabels: { enabled: true },
  xaxis: { 
      categories: [] // Acá irán los nombres de los músculos
  }
});

// 2. LOS DATOS REALES
const seriesGrafico = ref([{
  name: 'Veces entrenado',
  data: [] // Acá irán las cantidades
}]);

// 3. LA LÓGICA MATEMÁTICA
const calcularEstadisticas = async () => {
  cargando.value = true;
  
  try {
    // Traemos absolutamente todos los ejercicios de la base de datos
    const { data: ejercicios, error } = await supabase
      .from('ejercicio')
      .select('musculo');

    if (error) throw error;

    if (ejercicios && ejercicios.length > 0) {
        // Objeto temporal para contar: { "PECHO": 4, "ESPALDA": 2 }
        const conteoMusculos = {};
        
        ejercicios.forEach(ej => {
            // Pasamos todo a mayúsculas y quitamos espacios para que "Pecho" y "pecho " sumen juntos
            const musculoLimpiado = ej.musculo.trim().toUpperCase();
            
            if (conteoMusculos[musculoLimpiado]) {
                conteoMusculos[musculoLimpiado]++;
            } else {
                conteoMusculos[musculoLimpiado] = 1;
            }
        });

        // Inyectamos el resultado en las variables del gráfico
        opcionesGrafico.value.xaxis.categories = Object.keys(conteoMusculos);
        seriesGrafico.value[0].data = Object.values(conteoMusculos);
    }
  } catch (error) {
    console.error("Error calculando estadísticas:", error);
  } finally {
    cargando.value = false;
  }
};

// Disparamos el cálculo al abrir la pestaña
onMounted(() => {
  calcularEstadisticas();
});
</script>

<template>
  <main>
    <h1>Estadísticas 📊</h1>
    
    <div v-if="cargando" class="mensaje-carga">
      <p>Calculando tu progreso histórico...</p>
    </div>

    <div v-else class="tarjeta-grafico">
      <h3>Distribución Muscular</h3>
      
      <apexchart 
        type="bar" 
        height="350" 
        :options="opcionesGrafico" 
        :series="seriesGrafico"
      ></apexchart>
      
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
.tarjeta-grafico {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-top: 20px;
}
h3 {
  margin-top: 0;
  text-align: center;
  color: #333;
  font-size: 1.1rem;
}
.mensaje-carga {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 40px;
}
</style>