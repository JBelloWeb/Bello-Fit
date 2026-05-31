<script setup>
    import { onMounted } from 'vue';
    import { estadoDia, cargarDatosDelDia } from '../funcs/estadoGlobal';
    import CalendarioSemanal from '../components/CalendarioSemanal.vue';
    import EstadisticasHoy from '../components/EstadisticasHoy.vue';

    onMounted(() =>{
        cargarDatosDelDia();
    })
</script>

<template>
    <main>
        <CalendarioSemanal class="sticky-component" />

        <h1>BELLO-FIT</h1>

        <EstadisticasHoy 
        :agua="estadoDia.metricas.agua"
        :suenio="estadoDia.metricas.suenio"
        :ejercicio="estadoDia.ejercicios.length" />
    </main>
</template>

<style>
.sticky-component{
    position: sticky;
    top: 10px;
    z-index: 10;
}
</style>