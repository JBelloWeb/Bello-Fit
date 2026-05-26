<script setup>
import { ref } from 'vue';
// Importamos las "Habitaciones"
import VistaCargaMetricas from './views/VistaCarga.vue';
import VistaCargaEjercicio from './views/VistaCargaEjercicio.vue';
import VistaEstadisticas from './views/VistaEstadisticas.vue';

const vistaActual = ref('carga'); // Controla qué pantalla se ve
</script>

<template>
  <div class="contenedor-principal">
    
    <!-- Muestra una vista u otra dependiendo del botón que toques -->
    <VistaCargaMetricas v-if="vistaActual === 'carga'" />
    <VistaCargaEjercicio v-if="vistaActual === 'ejercicio'" />
    <VistaEstadisticas v-if="vistaActual === 'estadisticas'" />

    <!-- Nuestro menú sigue viviendo en el controlador para estar siempre visible -->
    <nav class="menu-inferior">
      <button :class="{ activo: vistaActual === 'carga' }" @click="vistaActual = 'carga'">
        📝 Cargar metricas diarias
      </button>
      <button :class="{ activo: vistaActual === 'ejercicio' }" @click="vistaActual = 'ejercicio'">
        💪 Cargar ejercicio
      </button>
      <button :class="{ activo: vistaActual === 'estadisticas' }" @click="vistaActual = 'estadisticas'">
        📊 Estadísticas
      </button>
    </nav>
    
  </div>
</template>

<style scoped>

main {
  max-width: 500px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
}
h1 {
  text-align: center;
  color: var(--bello-red);
  text-shadow: rgb(215 38 56 / 80%) 0px 0px 7px;
}
.seccion {
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
.btn-secundario {
  background-color: var(--bello-purple);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.btn-gigante {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background-color: var(--bello-red);

  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.lista-resultados {
  margin-top: 15px;
}
ul {
  padding-left: 20px;
}
li {
  margin-bottom: 10px;
}
</style>
