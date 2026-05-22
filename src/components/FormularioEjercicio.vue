<script setup>
    import { reactive } from 'vue';

    const emit = defineEmits(['nuevo-ejercicio']);
    const form = reactive ({
        musculo: '', ejercicio: '', peso: null, series: null, repeticiones: null
    });

    const enviarAlPadre = () =>{
        if (!form.musculo || !form.ejercicio || !form.peso || !form.series || !form.repeticiones) {
            alert('Falta especificar algún dato del ejercicio');
            return;
        }

        emit('nuevo-ejercicio', {
            musculo: form.musculo,
            ejercicio: form.ejercicio,
            peso: Number(form.peso),
            series: Number(form.series),
            repeticiones: Number(form.repeticiones)
        });

        form.musculo = ''; 
        form.ejercicio = ''; 
        form.peso = null;
        form.series = null; 
        form.repeticiones = null;
    };
</script>

<template>
    <div class="contenedor-formulario">
        <label>Musculo</label><br>
        <input type="text" v-model="form.musculo"><br>
        
        <label>Ejercicio</label><br>
        <input type="text" v-model="form.ejercicio"><br>

        <label>Peso</label><br>
        <input type="number" step="0.5" v-model="form.peso"><br>

        <label>Series X Repeticiones</label><br>
        <input type="number" v-model="form.series" style="width: 60px;"> 
        <span> X </span> 
        <input type="number" v-model="form.repeticiones" style="width: 60px;"> <br><br>

        <button @click="enviarAlPadre" type="button" class="btn-secundario">Cargar Ejercicio</button>
    </div>
</template>

<style scoped>
.contenedor-formulario {
    padding: 10px 0;
}
input {
    margin-top: 5px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}
.btn-secundario {
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}
</style>