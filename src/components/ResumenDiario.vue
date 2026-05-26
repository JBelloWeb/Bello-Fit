<script setup>
    defineProps({
        agua:{
            type: Number,
            required: true,
            default: 0
        },
        suenio: {
            type: Number,
            required: true,
            default: 0
        }
    });
</script>

<template>
    <div class="tarjeta-resumen">
        <h3>Progreso de Hoy</h3>

        <div class="contenedor-metrices">
            <div class="metrica">
                <span class="icono">💧</span>
                <div>
                    <p class="valor">{{ agua }}</p>
                    <p class="etiqueta">Vasos</p>
                </div>
            </div>

            <div class="metrica">
                <span class="icono">💤</span>
                <div>
                    <p class="valor">{{ suenio }}</p>
                    <p class="etiqueta">Horas</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tarjeta-resumen {
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
h3 {
    margin-top: 0;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 15px;
}
.contenedor-metricas {
    display: flex;
    justify-content: space-around;
}
.metrica {
    display: flex;
    align-items: center;
    gap: 10px;
}
.icono {
    font-size: 2rem;
}
.valor {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
}
.etiqueta {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
}
</style>