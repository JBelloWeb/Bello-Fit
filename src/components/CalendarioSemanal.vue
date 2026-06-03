<script setup>
import { ref, onMounted } from 'vue';
import { dayState, loadDayData } from '../funcs/globalState.js';

const calendarDays = ref([]);

const generarDias = () => {
    // 1. ACÁ DECLARAMOS LA VARIABLE (La caja vacía)
    const temporaryArray = [];
    const today = new Date();
    
    for (let i = -14; i <= 3; i++) {
        const currentDay = new Date(today);
        currentDay.setDate(today.getDate() + i);
        
        const iso = currentDay.toISOString().split('T')[0];
        const dayName = currentDay.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
        const dayNumber = currentDay.getDate();
        
        // 2. ACÁ LA LLENAMOS
        temporaryArray.push({
            iso: iso,
            name: dayName,
            number: dayNumber
        });
    }
    
    // 3. ACÁ LA USAMOS (Asegurate de que esté ADENTRO de la función generarDias)
    calendarDays.value = temporaryArray;
};

const seleccionarDia = (iso) => {
    dayState.date = iso;
    loadDayData();
};

onMounted(() => {
    generarDias();
    setTimeout(() => {
        const contenedor = document.querySelector('.dias-scroll');
        if(contenedor) contenedor.scrollLeft = contenedor.scrollWidth;
    }, 100);
});
</script>

<template>
    <div class="calendario-contenedor">
        <div class="dias-scroll">
            <div v-for="day in calendarDays"
            :key="day.iso"
            class="day-tarjeta"
            :class="{ 'active': dayState.date === day.iso }"
            @click="seleccionarDia(day.iso)">
            <span class="number">{{ day.number }}</span>
                <span class="name">{{ day.name }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendario-contenedor {
    background-color: transparent;
}

.dias-scroll {
    mask-image: linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 90%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding: 10px 0;
    /* Ocultar barra de scroll para que se vea como app nativa */
    scrollbar-width: none; 
}
.dias-scroll::-webkit-scrollbar {
    display: none;
}

.day-tarjeta {
    padding: 10px;
    min-width: 60px;
    min-height: 60px;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 3px solid var(--bello-cream);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.day-tarjeta .name {
    font-size: 0.6rem;
    color: var(--bello-cream);
    margin-bottom: 5px;
}

.day-tarjeta .number {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--bello-red);
}

.day-tarjeta.active {
    background-color: var(--bello-red, #D72638);
    border-color: var(--bello-red, #D72638);
    transform: translateY(-2px);
    box-shadow: 0 0px 9px 1px rgb(215 38 56 / 58%);
}

.day-tarjeta.active .name, 
.day-tarjeta.active .number {
    color: var(--bello-cream);
}
</style>