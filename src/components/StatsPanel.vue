<script setup>
import { ref, watch } from 'vue';
import { supabase } from '../supabase.js';

// Recibimos instrucciones desde el App.vue
const props = defineProps({
    isOpen: Boolean,
    currentView: String // Puede ser 'carga' o 'ejercicio'
});

// Le avisamos al App.vue cuando queremos cerrar el panel
const emit = defineEmits(['close']);

const loading = ref(false);

// --- ESTADO PARA EJERCICIOS ---
const chartOptions = ref({
    chart: { 
        type: 'bar', 
        toolbar: { show: false },
        background: 'transparent', // Fundamental para que tome el color de tu panel
        foreColor: '#8a99af' // Color de los textos de los ejes (gris claro)
    },
    theme: {
        mode: 'dark' // Activa tooltips oscuros automáticamente
    },
    plotOptions: { 
        bar: { 
            borderRadius: 6, // Bordes bien redondeados
            horizontal: true,
            barHeight: '30%', // Hace las barras más finas y elegantes
        } 
    },
    // El color base (el naranja de tu imagen)
    colors: ['#ff8c00'], 
    
    // LA MAGIA DEL NEÓN: Gradiente horizontal
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ffed4a'], // Termina en un amarillo/naranja brillante
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 0.9,
            stops: [0, 100]
        }
    },
    
    // EL BRILLO (Glow effect)
    dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 5,
        color: '#ff8c00', // El brillo del mismo color que la barra
        opacity: 0.5
    },

    dataLabels: { 
        enabled: false // Los apagamos para mantener el diseño limpio
    },
    
    // Limpieza de las líneas de fondo
    grid: {
        borderColor: 'rgba(255, 255, 255, 0.05)', // Líneas de fondo casi invisibles
        strokeDashArray: 4, // Líneas punteadas
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } }
    },
    xaxis: { 
        categories: [],
        axisBorder: { show: false }, // Oculta la línea dura del eje X
        axisTicks: { show: false }   // Oculta las marquitas
    }
});
const chartSeries = ref([{ name: 'Veces', data: [] }]);

// --- ESTADO PARA MÉTRICAS ---
const metricsStats = ref({ totalWater: 0, averageSleep: 0 });

// --- LÓGICA DINÁMICA ---
const loadData = async () => {
    loading.value = true;

    try {
        if (props.currentView === 'ejercicio') {
            // Lógica de músculos (la que ya armaste)
            const { data: exercises } = await supabase.from('ejercicio').select('musculo');
            if (exercises) {
                const count = {};
                exercises.forEach(ex => {
                    const m = ex.musculo.trim().toUpperCase();
                    count[m] = (count[m] || 0) + 1;
                });
                chartOptions.value.xaxis.categories = Object.keys(count);
                chartSeries.value[0].data = Object.values(count);
            }
        } else {
            // Lógica nueva para Agua y Sueño
            const { data: dailies } = await supabase.from('registro_diario').select('agua, suenio');
            if (dailies && dailies.length > 0) {
                let waterSum = 0;
                let sleepSum = 0;
                dailies.forEach(d => {
                    waterSum += d.agua || 0;
                    sleepSum += d.suenio || 0;
                });
                metricsStats.value.totalWater = waterSum;
                metricsStats.value.averageSleep = (sleepSum / dailies.length).toFixed(1);
            }
        }
    } catch (error) {
        console.error("Error cargando estadísticas:", error);
    } finally {
        loading.value = false;
    }
};

// watch observa la propiedad 'isOpen'. Si cambia a true, dispara la carga de datos.
watch(() => props.isOpen, (open) => {
    if (open) loadData();
});
</script>

<template>
  <div class="dark-backdrop" :class="{ 'visible': isOpen }" @click="emit('close')"></div>

  <div class="sliding-panel" :class="{ 'raised': isOpen }">
    <div class="panel-header">
        <h3>Estadísticas de {{ currentView === 'ejercicio' ? 'Entrenamiento' : 'Hábitos' }}</h3>
        <button class="btn-close" @click="emit('close')">✕</button>
    </div>

    <div class="panel-content">
        <p v-if="loading" class="loading-text">Calculando...</p>
        
        <div v-else>
            <div v-if="currentView === 'ejercicio'">
                <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries"></apexchart>
            </div>

            <div v-else class="metrics-summary">
                <div class="stat-box">
                    <h4>💧 Agua Total Histórica</h4>
                    <p class="giant-number">{{ metricsStats.totalWater }}</p>
                    <p>vasos consumidos</p>
                </div>
                <div class="stat-box">
                    <h4>💤 Promedio de Sueño</h4>
                    <p class="giant-number">{{ metricsStats.averageSleep }}</p>
                    <p>horas por noche</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo que oscurece el resto de la app */
.dark-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 999;
}
.dark-backdrop.visible {
    opacity: 1;
    pointer-events: all;
}

/* El panel que viene desde abajo (Dark Mode) */
.sliding-panel {
    position: fixed;
    bottom: 0; left: 0; width: 100vw;
    /* Un gris muy oscuro/azulado en lugar de blanco */
    background: #1a1c23;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 25px rgba(0,0,0,0.5);
    transform: translateY(100%); /* Arranca escondido abajo de la pantalla */
    transition: transform 0.3s cubic-bezier(0.1, 0.8, 0.2, 1);
    z-index: 1000;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}
.sliding-panel.raised {
    transform: translateY(0); /* Sube a su posición original */
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.panel-header h3 { margin: 0; font-size: 1.2rem; color: #ffffff; }
.btn-close { background: none; border: none; font-size: 1.5rem; color: #8a99af; cursor: pointer; }

.panel-content {
    padding: 20px;
    overflow-y: auto;
}
.loading-text { text-align: center; color: #888; font-style: italic; }

.metrics-summary {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.stat-box {
    background: rgba(255, 255, 255, 0.03); /* Un blanco casi transparente */
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 12px;
    text-align: center;
}
.stat-box h4 { margin: 0 0 10px 0; color: #8a99af; }
.stat-box p { color: #8a99af; }
.giant-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ff8c00;
    text-shadow: 0 0 10px rgba(255, 140, 0, 0.4);
    margin: 0;
}
</style>
