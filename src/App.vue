<script setup>
import { ref } from 'vue'
import V_Home from './views/V_Home.vue'
import V_LogMetrics from './views/V_LogMetrics.vue'
import V_LogExercise from './views/V_LogExercise.vue'
import StatsPanel from './components/StatsPanel.vue'
import WeeklyCalendar from './components/WeeklyCalendar.vue'

const currentView = ref('home')
const openPanel = ref(false)
</script>

<template>
  <WeeklyCalendar class="sticky-component" />

  <div class="main-container">
    <V_Home v-if="currentView === 'home'" />
    <V_LogMetrics v-if="currentView === 'carga'" />
    <V_LogExercise v-if="currentView === 'ejercicio'" />

    <StatsPanel :is-open="openPanel" :current-view="currentView" @close="openPanel = false" />

    <nav class="bottom-nav">
      <span class="panel-slider" @click="openPanel = true">-</span>
      <ul>
        <li
          class="nav-item"
          :class="{ active: currentView === 'carga' }"
          @click="currentView = 'carga'"
        >
          Metricas
        </li>
        <li
          class="nav-item"
          :class="{ active: currentView === 'home' }"
          @click="currentView = 'home'"
        >
          Home
        </li>
        <li
          class="nav-item"
          :class="{ active: currentView === 'ejercicio' }"
          @click="currentView = 'ejercicio'"
        >
          Ejercicio
        </li>
      </ul>
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
  margin: a;
  color: var(--bello-red);
  text-shadow: rgb(215 38 56 / 80%) 0px 0px 7px;
}
.section {
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
.sticky-component {
  position: sticky;
  top: 10px;
  z-index: 10;
}
.btn-secondary {
  background-color: var(--bello-purple);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.btn-giant {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background-color: var(--bello-red);

  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.results-list {
  margin-top: 15px;
}
ul {
  padding-left: 20px;
}
li {
  margin-bottom: 10px;
}

.panel-slider {
  transform: scaleX(5) scaleY(2);
  color: var(--bello-purple);

  &:hover {
    cursor: pointer;
  }
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  mask-image: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(255, 255, 255, 1) 60%,
    rgba(255, 255, 255, 1) 100%
  );
  border: 5px solid var(--bello-red);
  border-radius: 35px 35px 0px 0px;
}

.bottom-nav ul {
  padding: 0px;
  display: flex;
  justify-content: space-evenly;
  gap: 2rem;
  align-items: center;
  list-style: none;
}

.nav-item {
  &:hover {
    cursor: pointer;
  }
}
</style>
