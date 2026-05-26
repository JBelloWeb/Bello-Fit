<script setup>
import { ref, onMounted } from 'vue';
import { estadoDia, cargarDatosDelDia } from '../funcs/estadoGlobal.js';

const diasDelCalendario = ref([]);

const generarDias = () => {
    // 1. ACÁ DECLARAMOS LA VARIABLE (La caja vacía)
    const arrayTemporal = [];
    const fechaActual = new Date();
    
    for (let i = -14; i <= 2; i++) {
        const diaCalculado = new Date(fechaActual);
        diaCalculado.setDate(fechaActual.getDate() + i);
        
        const iso = diaCalculado.toISOString().split('T')[0];
        const nombreDia = diaCalculado.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
        const numeroDia = diaCalculado.getDate();
        
        // 2. ACÁ LA LLENAMOS
        arrayTemporal.push({
            iso: iso,
            nombre: nombreDia,
            numero: numeroDia
        });
    }
    
    // 3. ACÁ LA USAMOS (Asegurate de que esté ADENTRO de la función generarDias)
    diasDelCalendario.value = arrayTemporal;
};

const seleccionarDia = (iso) => {
    estadoDia.fecha = iso;
    cargarDatosDelDia();
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
    <div class="calendariio-contenedor">
        <div class="dias-scroll">
            <div v-for="dia in diasDelCalendario"
            :key="dia.iso"
            class="dia-tarjeta"
            :class="{ 'activo': estadoDia.fecha === dia.iso }""
            @click="seleccionarDia(dia.iso)">
                <span class="nombre">{{ dia.nombre }}</span>
                <span class="numero">{{ dia.numero }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendario-contenedor {
    margin-bottom: 20px;
    background-color: transparent;
}

.dias-scroll {
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

.dia-tarjeta {
    min-width: 60px;
    height: 75px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: 1px solid #eee;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.dia-tarjeta .nombre {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 5px;
}

.dia-tarjeta .numero {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
}

/* El estilo dinámico cuando el día está seleccionado */
.dia-tarjeta.activo {
    background-color: var(--bello-red, #D72638); /* Usa tu variable o un rojo por defecto */
    border-color: var(--bello-red, #D72638);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(215, 38, 56, 0.3);
}

.dia-tarjeta.activo .nombre, 
.dia-tarjeta.activo .numero {
    color: white;
}
</style>