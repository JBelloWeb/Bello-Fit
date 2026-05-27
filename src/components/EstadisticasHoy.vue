<script setup>
defineProps({
    agua: {
        type: Number,
        required: true,
        default: 0
    },
    suenio: {
        type: Number,
        required: true,
        default: 0
    },
    ejercicio: {
        type: Number,
        required: true,
        default: 0
    }
});
</script>

<template>
    <div class="bello-stat">
        <div class="suenio" :style="{'--fill': suenio + '%' }"></div>
        
        <div class="ejercicio" :style="{'--fill': ejercicio + '%' }"></div>
        
        <div class="agua" :style="{'--fill': agua + '%' }"></div>
    </div>
</template>

<style scoped>
    .bello-stat {
        display: flex;
        justify-content: space-between;
        height: 100px;
        width: 100px;
        align-items: end;
        margin: auto;
    }

    .suenio, .ejercicio, .agua {
        background-color: var(--bello-red);
        height: var(--fill);
        width: 20px; /* Le agregué un ancho para que las barras sean visibles */
    }
</style>