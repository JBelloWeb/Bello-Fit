import { reactive } from 'vue';
import { supabase } from '../supabase.js';    
    
export const estadoDia = reactive({
    fecha: new Date().toISOString().split('T')[0], 
    metricas: { agua: 0, suenio: 0 },
    ejercicios: []
});

export const inputsMetricas = reactive({ agua: null, suenio: null });


export const cargarDatosDelDia = async () => {
    const fechaSeleccionada = estadoDia.fecha;
    if(!fechaSeleccionada) return;

    estadoDia.ejercicios = [];
    estadoDia.metricas.agua = 0;
    estadoDia.metricas.suenio = 0;

    try{
        const { data: diario } = await supabase.from('registro_diario').select('*').eq('dia_id', fechaSeleccionada).single();
        if(ejercicioBD && ejercicioBD.length > 0) {
            ejercicioBD.forEach(ej => {
                estadoDia.ejercicio.push({
                    musuclo: ej.musculo, ejercicio: ej.ejercicio, peso: ej.peso,
                    series: ej.series_x_repeticiones.split('X')[0] || 0,
                    repeticiones: ej.series_x_repeticiones.split('X')[1] || 0
                });
            });
        }
    } catch (error){
        if(error.code !== 'PGRST116') console.error("Error al recuperar:", error);
    }
};

    export const guardarDiaEnNube = async () => {
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