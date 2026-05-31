<script setup>
import { ref } from 'vue';
import V_Home from './views/V_Home.vue';
import VistaCargaMetricas from './views/VistaCarga.vue';
import VistaCargaEjercicio from './views/VistaCargaEjercicio.vue';
import PanelEstadisticas from './components/PanelEstadisticas.vue'; // <-- Importamos el panel

const currentView = ref('home'); 
const panelAbierto = ref(false); // <-- Nueva variable para controlar la ventana
</script>

<template>
  <div class="contenedor-principal">
    
    <V_Home v-if="currentView === 'home'" />
    <VistaCargaMetricas v-if="currentView === 'carga'" />
    <VistaCargaEjercicio v-if="currentView === 'ejercicio'" />

    <PanelEstadisticas 
        :abierto="panelAbierto" 
        :currentView="currentView" 
        @cerrar="panelAbierto = false"
    />

    <nav class="menu-inferior">
      <button :class="{ activo: currentView === 'carga' }" @click="currentView = 'carga'">
        📝 Cargar métricas
      </button>
      <button :class="{ activo: currentView === 'ejercicio' }" @click="currentView = 'ejercicio'">
        💪 Cargar ejercicio
      </button>
      
      <button @click="panelAbierto = true">
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
