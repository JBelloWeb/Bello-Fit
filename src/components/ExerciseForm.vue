<script setup>
    import { reactive } from 'vue';

    const emit = defineEmits(['new-exercise']);
    const form = reactive ({
        muscle: '', exercise: '', weight: null, sets: null, reps: null
    });

    const submit = () =>{
        if (!form.muscle || !form.exercise || !form.weight || !form.sets || !form.reps) {
            alert('Falta especificar algún dato del ejercicio');
            return;
        }

        emit('new-exercise', {
            muscle: form.muscle,
            exercise: form.exercise,
            weight: Number(form.weight),
            sets: Number(form.sets),
            reps: Number(form.reps)
        });

        form.muscle = ''; 
        form.exercise = ''; 
        form.weight = null;
        form.sets = null; 
        form.reps = null;
    };
</script>

<template>
    <div class="form-container">
        <label>Musculo</label><br>
        <input type="text" v-model="form.muscle"><br>
        
        <label>Ejercicio</label><br>
        <input type="text" v-model="form.exercise"><br>

        <label>Peso</label><br>
        <input type="number" step="0.5" v-model="form.weight"><br>

        <label>Series X Repeticiones</label><br>
        <input type="number" v-model="form.sets" style="width: 60px;"> 
        <span> X </span> 
        <input type="number" v-model="form.reps" style="width: 60px;"> <br><br>

        <button @click="submit" type="button" class="btn-secondary">Cargar Ejercicio</button>
    </div>
</template>

<style scoped>
.form-container {
    padding: 10px 0;
}
input {
    margin-top: 5px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}
.btn-secondary {
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
