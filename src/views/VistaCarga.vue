<script setup>
import { onMounted } from 'vue';
import { estadoDia, inputsMetricas, cargarDatosDelDia, guardarDiaEnNube } from '../funcs/estadoGlobal.js';
import ResumenDiario from '../components/ResumenDiario.vue';

onMounted(() => { 
    cargarDatosDelDia(); 
});
</script>
<template>
  <main>
    <h1>BELLO-FIT 🚀</h1>
    <!-- Todo el HTML que estaba en App.vue va acá intacto -->
    <div class="seccion">
        <h2>Fecha</h2>
        <input type="date" v-model="estadoDia.fecha" @change="cargarDatosDelDia">
    </div>

    <ResumenDiario 
        :agua="estadoDia.metricas.agua" 
        :suenio="estadoDia.metricas.suenio" 
    />

    <div class="seccion">
        <h2>Métricas diarias (Sumar)</h2>
        <label>Agua (Vasos a sumar)</label> <br>
        <input type="number" v-model="inputsMetricas.agua"> <br><br>
        <label>Sueño (Horas a sumar)</label> <br>
        <input type="number" step="0.5" v-model="inputsMetricas.suenio"> <br><br>
        <p><em>Total actual en BD: {{ estadoDia.metricas.agua }} vasos | {{ estadoDia.metricas.suenio }} horas</em></p>
    </div>


    <br>
    <button @click="guardarDiaEnNube" class="btn-gigante">Guardar Día Completo</button>
  </main>
</template>

<style scoped>
/* Los estilos específicos de esta vista que teníamos antes */
main { max-width: 500px; margin: 0 auto; padding: 20px; }
h1 { text-align: center; color: #333; }
.seccion { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
input { margin-top: 5px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.btn-secundario { background-color: var(--bello-purple); color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
.btn-gigante { width: 100%; padding: 15px; font-size: 18px; background-color:var(--bello-red); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.lista-resultados { margin-top: 15px; }
</style>