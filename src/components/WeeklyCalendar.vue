<script setup>
import { ref, computed, onMounted } from 'vue';
import { PhCalendarCheck } from '@phosphor-icons/vue';
import { dayState, loadDayData } from '../funcs/globalState.js';

const todayIso = new Date().toISOString().split('T')[0];
const isNotToday = computed(() => dayState.date !== todayIso);

const calendarDays = ref([]);

const generateDays = () => {
    // 1. ACÁ DECLARAMOS LA VARIABLE (La caja vacía)
    const days = [];
    const today = new Date();

    for (let i = -14; i <= 3; i++) {
        const currentDay = new Date(today);
        currentDay.setDate(today.getDate() + i);

        const iso = currentDay.toISOString().split('T')[0];
        const dayName = currentDay.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
        const dayNumber = currentDay.getDate();

        // 2. ACÁ LA LLENAMOS
        days.push({
            iso: iso,
            name: dayName,
            number: dayNumber
        });
    }

    // 3. ACÁ LA USAMOS (Asegurate de que esté ADENTRO de la función generateDays)
    calendarDays.value = days;
};

const selectDay = (iso) => {
    dayState.date = iso;
    loadDayData();
};

const goToToday = () => {
    dayState.date = todayIso;
    loadDayData();
    setTimeout(() => {
        const activeEl = document.querySelector('.day-card.active');
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, 50);
};

onMounted(() => {
    generateDays();
    setTimeout(() => {
        const container = document.querySelector('.days-scroll');
        if (container) {
            const activeEl = container.querySelector('.day-card.active');
            if (activeEl) {
                activeEl.scrollIntoView({ inline: 'center', block: 'nearest' });
            } else {
                container.scrollLeft = container.scrollWidth;
            }
        }
    }, 100);
});
</script>

<template>
    <div class="calendar-container">
        <div class="days-scroll">
            <div v-for="day in calendarDays"
            :key="day.iso"
            class="day-card"
            :class="{ 'active': dayState.date === day.iso }"
            @click="selectDay(day.iso)">
            <span class="number">{{ day.number }}</span>
                <span class="name">{{ day.name }}</span>
            </div>
        </div>
        <button
            v-if="isNotToday"
            class="today-btn"
            @click="goToToday"
            title="Volver al día de hoy"
        >
            <PhCalendarCheck :size="14" weight="bold" />
            <span>Hoy</span>
        </button>
    </div>
</template>

<style scoped>
.calendar-container {
    background-color: transparent;
    position: relative;
}

.today-btn {
    position: absolute;
    top: calc(100% + 6px);
    right: 16px;
    z-index: 6;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background-color: var(--bello-red, #D72638);
    color: var(--bello-cream, #fff5e1);
    border: none;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.3px;
    box-shadow: 0 0 8px rgba(215, 38, 56, 0.45);
    transition: all 0.2s ease;
}

.today-btn:hover {
    background-color: #ff2a55;
    transform: scale(1.05);
    box-shadow: 0 0 12px rgba(255, 42, 85, 0.7);
}

.today-btn:active {
    transform: scale(0.97);
}

.days-scroll {
    mask-image: linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 90%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding: 10px 0;
    /* Ocultar barra de scroll para que se vea como app nativa */
    scrollbar-width: none; 
}
.days-scroll::-webkit-scrollbar {
    display: none;
}

.day-card {
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

.day-card .name {
    font-size: 0.6rem;
    color: var(--bello-cream);
    margin-bottom: 5px;
}

.day-card .number {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--bello-red);
}

.day-card.active {
    background-color: var(--bello-red, #D72638);
    border-color: var(--bello-red, #D72638);
    transform: translateY(-2px);
    box-shadow: 0 0px 9px 1px rgb(215 38 56 / 58%);
}

.day-card.active .name, 
.day-card.active .number {
    color: var(--bello-cream);
}
</style>
