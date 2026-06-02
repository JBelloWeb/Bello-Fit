<script setup>
import { onMounted } from 'vue'
import {
  estadoDia,
  inputsMetricas,
  cargarDatosDelDia,
  guardarDiaEnNube,
} from '../funcs/estadoGlobal.js'
import FormularioEjercicio from '../components/FormularioEjercicio.vue'

const recibirEjercicioDelHijo = (datos) => {
  estadoDia.ejercicios.push(datos)
}

onMounted(() => {
  cargarDatosDelDia()
})
</script>

<template>
  <CalendarioSemanal />

  <div class="seccion">
    <h2>Ejercicio</h2>

    <!-- INYECTAMOS NUESTRO COMPONENTE MUEBLE Y ESCUCHAMOS SU EVENTO -->
    <FormularioEjercicio @nuevo-ejercicio="recibirEjercicioDelHijo" />

    <div class="lista-resultados">
      <ul>
        <li v-for="(ej, index) in estadoDia.ejercicios" :key="'ej-' + index">
          <h4>{{ ej.musculo }}</h4>
          <p>
            Realizados: {{ ej.ejercicio }}. Detalle: {{ ej.series }}X{{
              ej.repeticiones
            }}
            utilizando {{ ej.peso }}kg
          </p>
        </li>
      </ul>
    </div>
  </div>

  <button @click="guardarDiaEnNube" class="btn-gigante">Guardar Día Completo</button>
</template>
