<script setup>
import { reactive, onMounted } from 'vue';
// OJO a la ruta: como estamos en la carpeta 'views', tenemos que subir un nivel ('../') para encontrar a supabase.js
import { supabase } from '../supabase.js'; 

const estadoDia = reactive({
    fecha: new Date().toISOString().split('T')[0], 
    metricas: { agua: 0, suenio: 0 },
    ejercicios: []
});

const inputsMetricas = reactive({ agua: null, suenio: null });
const formEjercicio = reactive({
    musculo: '', ejercicio: '', peso: null, series: null, repeticiones: null
});

const cargarDatosDelDia = async () => {
    const fechaSeleccionada = estadoDia.fecha;
    if (!fechaSeleccionada) return;

    estadoDia.ejercicios = [];
    estadoDia.metricas.agua = 0;
    estadoDia.metricas.suenio = 0;
    inputsMetricas.agua = null;
    inputsMetricas.suenio = null;

    try {
        const { data: diario } = await supabase.from('registro_diario').select('*').eq('dia_id', fechaSeleccionada).single(); 
        if (diario) {
            estadoDia.metricas.agua = diario.agua || 0;
            estadoDia.metricas.suenio = diario.suenio || 0;
        }

        const { data: ejerciciosBD } = await supabase.from('ejercicio').select('*').eq('dia_fk', fechaSeleccionada);
        if (ejerciciosBD && ejerciciosBD.length > 0) {
            ejerciciosBD.forEach(ej => {
                estadoDia.ejercicios.push({
                    musculo: ej.musculo, ejercicio: ej.ejercicio, peso: ej.peso,
                    series: ej.series_x_repeticiones.split('X')[0] || 0,
                    repeticiones: ej.series_x_repeticiones.split('X')[1] || 0
                });
            });
        }
    } catch (error) {
        if (error.code !== 'PGRST116') console.error("Error al recuperar:", error);
    }
};

const agregarEjercicioLocal = () => {
    if (!formEjercicio.musculo || !formEjercicio.ejercicio || !formEjercicio.peso || !formEjercicio.series || !formEjercicio.repeticiones) {
        alert('Falta especificar algún dato del ejercicio');
        return;
    }
    estadoDia.ejercicios.push({
        musculo: formEjercicio.musculo, ejercicio: formEjercicio.ejercicio,
        peso: Number(formEjercicio.peso), series: Number(formEjercicio.series), repeticiones: Number(formEjercicio.repeticiones)
    });
    formEjercicio.musculo = ''; formEjercicio.ejercicio = ''; formEjercicio.peso = null;
    formEjercicio.series = null; formEjercicio.repeticiones = null;
};

const guardarDiaEnNube = async () => {
    const fecha = estadoDia.fecha;
    if (!fecha) { alert("Seleccioná una fecha"); return; }

    let aguaNueva = inputsMetricas.agua ? Number(inputsMetricas.agua) : 0;
    let suenioNuevo = inputsMetricas.suenio ? Number(inputsMetricas.suenio) : 0;
    estadoDia.metricas.agua += aguaNueva;
    estadoDia.metricas.suenio += suenioNuevo;
    const hizoEjercicio = estadoDia.ejercicios.length > 0;

    try {
        const { error: errorDia } = await supabase.from('registro_diario').upsert({
            dia_id: fecha, agua: estadoDia.metricas.agua, suenio: estadoDia.metricas.suenio, ejercicios: hizoEjercicio
        });
        if (errorDia) throw errorDia;

        await supabase.from('ejercicio').delete().eq('dia_fk', fecha);
        
        if (estadoDia.ejercicios.length > 0) {
            const ejerciciosParaBD = estadoDia.ejercicios.map(ej => ({
                dia_fk: fecha, musculo: ej.musculo, ejercicio: ej.ejercicio, peso: ej.peso,
                series_x_repeticiones: `${ej.series}X${ej.repeticiones}`
            }));
            const { error: errorEj } = await supabase.from('ejercicio').insert(ejerciciosParaBD);
            if (errorEj) throw errorEj;
        }
        alert("¡Día guardado con éxito!");
        inputsMetricas.agua = null; inputsMetricas.suenio = null;
    } catch (error) {
        console.error("Error al guardar:", error);
        alert(`Hubo un error: ${error.message}`);
    }
};

onMounted(() => { cargarDatosDelDia(); });
</script>

<template>
  <main>
    <h1>BELLO-FIT 🚀</h1>
    <!-- Todo el HTML que estaba en App.vue va acá intacto -->
    <div class="seccion">
        <h2>Fecha</h2>
        <input type="date" v-model="estadoDia.fecha" @change="cargarDatosDelDia">
    </div>

    <div class="seccion">
        <h2>Métricas diarias (Sumar)</h2>
        <label>Agua (Vasos a sumar)</label> <br>
        <input type="number" v-model="inputsMetricas.agua"> <br><br>
        <label>Sueño (Horas a sumar)</label> <br>
        <input type="number" step="0.5" v-model="inputsMetricas.suenio"> <br><br>
        <p><em>Total actual en BD: {{ estadoDia.metricas.agua }} vasos | {{ estadoDia.metricas.suenio }} horas</em></p>
    </div>

    <div class="seccion">
        <h2>Ejercicio</h2>
        <label>Músculo</label><br>
        <input type="text" v-model="formEjercicio.musculo"> <br>
        <label>Ejercicio</label> <br>
        <input type="text" v-model="formEjercicio.ejercicio"> <br>
        <label>Peso (kg)</label> <br>
        <input type="number" step="0.5" v-model="formEjercicio.peso"> <br>
        <label>Series X Repeticiones</label> <br>
        <input type="number" v-model="formEjercicio.series" style="width: 60px;"> 
        <span> X </span> 
        <input type="number" v-model="formEjercicio.repeticiones" style="width: 60px;"> <br><br>
        
        <button @click="agregarEjercicioLocal" type="button" class="btn-secundario">Cargar Ejercicio</button>

        <div class="lista-resultados">
            <ul>
                <li v-for="(ej, index) in estadoDia.ejercicios" :key="'ej-'+index">
                    <h4>{{ ej.musculo }}</h4>
                    <p>Realizados: {{ ej.ejercicio }}. Detalle: {{ ej.series }}X{{ ej.repeticiones }} utilizando {{ ej.peso }}kg</p>
                </li>
            </ul>
        </div>
    </div>
    <br>
    <button @click="guardarDiaEnNube" class="btn-gigante">Guardar Día Completo</button>
  </main>
</template>

<style scoped>
/* Los estilos específicos de esta vista que teníamos antes */
main { max-width: 500px; margin: 0 auto; padding: 20px; }
h1 { text-align: center; color: #333; }
.seccion { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
input { margin-top: 5px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.btn-secundario { background-color: var(--bello-purple); color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
.btn-gigante { width: 100%; padding: 15px; font-size: 18px; background-color:var(--bello-red); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.lista-resultados { margin-top: 15px; }
</style>