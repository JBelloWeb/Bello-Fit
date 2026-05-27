<script setup>
import { ref, watch } from 'vue';
import { supabase } from '../supabase.js';

// Recibimos instrucciones desde el App.vue
const props = defineProps({
    abierto: Boolean,
    vistaActual: String // Puede ser 'carga' o 'ejercicio'
});

// Le avisamos al App.vue cuando queremos cerrar el panel
const emit = defineEmits(['cerrar']);

const cargando = ref(false);

// --- ESTADO PARA EJERCICIOS ---
const opcionesGrafico = ref({
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
const seriesGrafico = ref([{ name: 'Veces', data: [] }]);

// --- ESTADO PARA MÉTRICAS ---
const statsMetricas = ref({ aguaTotal: 0, suenioPromedio: 0 });

// --- LÓGICA DINÁMICA ---
const cargarDatos = async () => {
    cargando.value = true;

    try {
        if (props.vistaActual === 'ejercicio') {
            // Lógica de músculos (la que ya armaste)
            const { data: ejercicios } = await supabase.from('ejercicio').select('musculo');
            if (ejercicios) {
                const conteo = {};
                ejercicios.forEach(ej => {
                    const m = ej.musculo.trim().toUpperCase();
                    conteo[m] = (conteo[m] || 0) + 1;
                });
                opcionesGrafico.value.xaxis.categories = Object.keys(conteo);
                seriesGrafico.value[0].data = Object.values(conteo);
            }
        } else {
            // Lógica nueva para Agua y Sueño
            const { data: diarios } = await supabase.from('registro_diario').select('agua, suenio');
            if (diarios && diarios.length > 0) {
                let aguaSum = 0;
                let suenioSum = 0;
                diarios.forEach(d => {
                    aguaSum += d.agua || 0;
                    suenioSum += d.suenio || 0;
                });
                statsMetricas.value.aguaTotal = aguaSum;
                statsMetricas.value.suenioPromedio = (suenioSum / diarios.length).toFixed(1);
            }
        }
    } catch (error) {
        console.error("Error cargando estadísticas:", error);
    } finally {
        cargando.value = false;
    }
};

// watch observa la propiedad 'abierto'. Si cambia a true, dispara la carga de datos.
watch(() => props.abierto, (estaAbierto) => {
    if (estaAbierto) cargarDatos();
});
</script>

<template>
  <div class="fondo-oscuro" :class="{ 'mostrar': abierto }" @click="emit('cerrar')"></div>

  <div class="panel-deslizante" :class="{ 'subir': abierto }">
    <div class="cabecera-panel">
        <h3>Estadísticas de {{ vistaActual === 'ejercicio' ? 'Entrenamiento' : 'Hábitos' }}</h3>
        <button class="btn-cerrar" @click="emit('cerrar')">✕</button>
    </div>

    <div class="contenido-panel">
        <p v-if="cargando" class="texto-carga">Calculando...</p>
        
        <div v-else>
            <div v-if="vistaActual === 'ejercicio'">
                <apexchart type="bar" height="300" :options="opcionesGrafico" :series="seriesGrafico"></apexchart>
            </div>

            <div v-else class="metricas-resumen">
                <div class="caja-stat">
                    <h4>💧 Agua Total Histórica</h4>
                    <p class="numero-gigante">{{ statsMetricas.aguaTotal }}</p>
                    <p>vasos consumidos</p>
                </div>
                <div class="caja-stat">
                    <h4>💤 Promedio de Sueño</h4>
                    <p class="numero-gigante">{{ statsMetricas.suenioPromedio }}</p>
                    <p>horas por noche</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo que oscurece el resto de la app */
.fondo-oscuro {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 999;
}
.fondo-oscuro.mostrar {
    opacity: 1;
    pointer-events: all;
}

/* El panel que viene desde abajo */
.panel-deslizante {
    position: fixed;
    bottom: 0; left: 0; width: 100vw;
    background: white;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 15px rgba(0,0,0,0.2);
    transform: translateY(100%); /* Arranca escondido abajo de la pantalla */
    transition: transform 0.3s cubic-bezier(0.1, 0.8, 0.2, 1);
    z-index: 1000;
    height: 95vh;
    display: flex;
    flex-direction: column;
}
.panel-deslizante.subir {
    transform: translateY(0); /* Sube a su posición original */
}

.cabecera-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}
.cabecera-panel h3 { margin: 0; font-size: 1.2rem; color: #333; }
.btn-cerrar { background: none; border: none; font-size: 1.5rem; color: #888; cursor: pointer; }

.contenido-panel {
    padding: 20px;
    overflow-y: auto;
}
.texto-carga { text-align: center; color: #888; font-style: italic; }

.metricas-resumen {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.caja-stat {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 12px;
    text-align: center;
}
.caja-stat h4 { margin: 0 0 10px 0; color: #555; }
.numero-gigante { font-size: 2.5rem; font-weight: bold; color: var(--bello-purple, #6a1b9a); margin: 0; }

/* Modificamos el panel para que sea estilo Dark Mode */
.panel-deslizante {
    position: fixed;
    bottom: 0; left: 0; width: 100vw;
    /* Un gris muy oscuro/azulado en lugar de blanco */
    background: #1a1c23; 
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 25px rgba(0,0,0,0.5);
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.1, 0.8, 0.2, 1);
    z-index: 1000;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

/* Ajustamos los textos para que se lean sobre fondo oscuro */
.cabecera-panel {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.cabecera-panel h3 { color: #ffffff; }
.btn-cerrar { color: #8a99af; }

/* Ajustamos las cajas de métricas (Agua y Sueño) para que hagan juego */
.caja-stat {
    background: rgba(255, 255, 255, 0.03); /* Un blanco casi transparente */
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 12px;
    text-align: center;
}
.caja-stat h4 { color: #8a99af; }
.caja-stat p { color: #8a99af; }
.numero-gigante { color: #ff8c00; text-shadow: 0 0 10px rgba(255, 140, 0, 0.4); }
</style>