<script setup>
import { reactive, onMounted, ref } from 'vue'
import { supabase } from './supabase.js'

const vistaActual = ref('carga')

// 1. EL ESTADO DEL DÍA (Lo que viaja a la BD)
const estadoDia = reactive({
  fecha: new Date().toISOString().split('T')[0],
  metricas: { agua: 0, suenio: 0 },
  comidas: [],
  ejercicios: [],
})

// 2. EL ESTADO DE LOS INPUTS (Lo que tipeamos)
const inputsMetricas = reactive({ agua: null, suenio: null })

const formComida = reactive({
  tipo: 'Desayuno',
  proteina: '-',
  verdura: '',
  hidrato: '',
  fruta: '',
  otro: '',
  huevo: 0,
})

const formEjercicio = reactive({
  musculo: '',
  ejercicio: '',
  peso: null,
  series: null,
  repeticiones: null,
})

// 3. LA LÓGICA MIGRADA

const cargarDatosDelDia = async () => {
  const fechaSeleccionada = estadoDia.fecha
  if (!fechaSeleccionada) return

  // Reset de memoria e inputs (Igual que en Vanilla JS)
  estadoDia.comidas = []
  estadoDia.ejercicios = []
  estadoDia.metricas.agua = 0
  estadoDia.metricas.suenio = 0
  inputsMetricas.agua = null
  inputsMetricas.suenio = null

  try {
    // A. Traer métricas (Padre)
    const { data: diario } = await supabase
      .from('registro_diario')
      .select('*')
      .eq('dia_id', fechaSeleccionada)
      .single()

    if (diario) {
      estadoDia.metricas.agua = diario.agua || 0
      estadoDia.metricas.suenio = diario.suenio || 0
    }

    // B. Traer Comidas
    const { data: comidasBD } = await supabase
      .from('comida')
      .select('*')
      .eq('date_fk', fechaSeleccionada)
    if (comidasBD && comidasBD.length > 0) {
      comidasBD.forEach((c) => {
        estadoDia.comidas.push({
          comida: c.comida,
          proteina: c.proteina,
          verdura: c.verdura,
          fruta: c.fruta,
          hidratos: c.hidratos,
          otro: c.otro,
          huevo: c.huevo,
        })
      })
    }

    // C. Traer Ejercicios
    const { data: ejerciciosBD } = await supabase
      .from('ejercicio')
      .select('*')
      .eq('dia_fk', fechaSeleccionada)
    if (ejerciciosBD && ejerciciosBD.length > 0) {
      ejerciciosBD.forEach((ej) => {
        estadoDia.ejercicios.push({
          musculo: ej.musculo,
          ejercicio: ej.ejercicio,
          peso: ej.peso,
          series: ej.series_x_repeticiones.split('X')[0] || 0,
          repeticiones: ej.series_x_repeticiones.split('X')[1] || 0,
        })
      })
    }
  } catch (error) {
    if (error.code !== 'PGRST116') console.error('Error al recuperar:', error)
  }
}

const agregarComidaLocal = () => {
  // Validación
  if (
    formComida.proteina === '-' &&
    !formComida.verdura &&
    !formComida.hidrato &&
    !formComida.fruta &&
    !formComida.otro &&
    formComida.huevo == 0
  ) {
    alert('Añade al menos un alimento')
    return
  }

  let nuevaComida = {
    comida: formComida.tipo,
    proteina: formComida.proteina,
    verdura: formComida.verdura,
    fruta: formComida.fruta,
    hidratos: formComida.hidrato,
    otro: formComida.otro,
    huevo: formComida.huevo ? Number(formComida.huevo) : 0,
  }

  // Estrategia Wipe & Replace local
  let indiceExistente = estadoDia.comidas.findIndex((c) => c.comida === formComida.tipo)
  if (indiceExistente !== -1) {
    estadoDia.comidas[indiceExistente] = nuevaComida
  } else {
    estadoDia.comidas.push(nuevaComida)
  }

  // Limpiar formulario visual
  formComida.tipo = 'Desayuno'
  formComida.proteina = '-'
  formComida.verdura = ''
  formComida.hidrato = ''
  formComida.fruta = ''
  formComida.otro = ''
  formComida.huevo = 0
}

const agregarEjercicioLocal = () => {
  if (
    !formEjercicio.musculo ||
    !formEjercicio.ejercicio ||
    !formEjercicio.peso ||
    !formEjercicio.series ||
    !formEjercicio.repeticiones
  ) {
    alert('Falta especificar')
    return
  }

  estadoDia.ejercicios.push({
    musculo: formEjercicio.musculo,
    ejercicio: formEjercicio.ejercicio,
    peso: Number(formEjercicio.peso),
    series: Number(formEjercicio.series),
    repeticiones: Number(formEjercicio.repeticiones),
  })

  // Limpiar formulario visual
  formEjercicio.musculo = ''
  formEjercicio.ejercicio = ''
  formEjercicio.peso = null
  formEjercicio.series = null
  formEjercicio.repeticiones = null
}

const guardarDiaEnNube = async () => {
  const fecha = estadoDia.fecha
  if (!fecha) {
    alert('Seleccioná una fecha')
    return
  }

  // Acumular métricas
  let aguaNueva = inputsMetricas.agua ? Number(inputsMetricas.agua) : 0
  let suenioNuevo = inputsMetricas.suenio ? Number(inputsMetricas.suenio) : 0
  estadoDia.metricas.agua += aguaNueva
  estadoDia.metricas.suenio += suenioNuevo

  const cantidadComidas = estadoDia.comidas.length
  const hizoEjercicio = estadoDia.ejercicios.length > 0

  try {
    // A. Guardar Padre
    const { error: errorDia } = await supabase.from('registro_diario').upsert({
      dia_id: fecha,
      agua: estadoDia.metricas.agua,
      suenio: estadoDia.metricas.suenio,
      comidas: cantidadComidas,
      ejercicios: hizoEjercicio,
    })
    if (errorDia) throw errorDia

    // B. Guardar Ejercicios (Wipe & Replace)
    await supabase.from('ejercicio').delete().eq('dia_fk', fecha)
    if (estadoDia.ejercicios.length > 0) {
      const ejerciciosParaBD = estadoDia.ejercicios.map((ej) => ({
        dia_fk: fecha,
        musculo: ej.musculo,
        ejercicio: ej.ejercicio,
        peso: ej.peso,
        series_x_repeticiones: `${ej.series}X${ej.repeticiones}`,
      }))
      const { error: errorEj } = await supabase.from('ejercicio').insert(ejerciciosParaBD)
      if (errorEj) throw errorEj
    }

    // C. Guardar Comidas (Wipe & Replace)
    await supabase.from('comida').delete().eq('date_fk', fecha)
    if (estadoDia.comidas.length > 0) {
      const comidasParaBD = estadoDia.comidas.map((c) => ({
        date_fk: fecha,
        comida: c.comida,
        proteina: c.proteina,
        verdura: c.verdura,
        hidratos: c.hidratos,
        fruta: c.fruta,
        otro: c.otro,
        huevo: c.huevo,
      }))
      const { error: errorComida } = await supabase.from('comida').insert(comidasParaBD)
      if (errorComida) throw errorComida
    }

    alert('¡Día guardado con éxito!')

    // Limpiamos los inputs de sumar métricas para no duplicar sumas
    inputsMetricas.agua = null
    inputsMetricas.suenio = null
  } catch (error) {
    console.error('Error al guardar:', error)
    alert(`Hubo un error: ${error.message}`)
  }
}

onMounted(() => {
  cargarDatosDelDia()
})
</script>

<template>
  <main>
    <h1>BELLO-FIT 🚀</h1>

    <div v-if="vistaActual === 'carga'" class="pantalla-carga">
      <div class="seccion">
        <h2>Fecha</h2>
        <input type="date" v-model="estadoDia.fecha" @change="cargarDatosDelDia" />
      </div>

      <div class="seccion">
        <h2>Métricas diarias (Sumar)</h2>
        <label>Agua (Vasos a sumar)</label> <br />
        <input type="number" v-model="inputsMetricas.agua" /> <br />

        <label>Sueño (Horas a sumar)</label> <br />
        <input type="number" step="0.5" v-model="inputsMetricas.suenio" />

        <p>
          <em
            >Total actual en BD: {{ estadoDia.metricas.agua }} vasos |
            {{ estadoDia.metricas.suenio }} horas</em
          >
        </p>
      </div>

      <div class="seccion">
        <h2>Comida</h2>
        <label>Tipo</label><br />
        <select v-model="formComida.tipo">
          <option value="Desayuno">Desayuno</option>
          <option value="Colación">Colación</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Merienda">Merienda</option>
          <option value="Cena">Cena</option>
        </select>
        <br />

        <label>Proteína</label><br />
        <select v-model="formComida.proteina">
          <option value="-">-</option>
          <option value="Carne">Carne</option>
          <option value="Pollo">Pollo</option>
          <option value="Pescado">Pescado</option>
          <option value="Cerdo">Cerdo</option>
        </select>
        <br />

        <label>Verdura</label><br />
        <input type="text" v-model="formComida.verdura" /> <br />
        <label>Hidrato</label><br />
        <input type="text" v-model="formComida.hidrato" /> <br />
        <label>Fruta</label><br />
        <input type="text" v-model="formComida.fruta" /> <br />
        <label>Otro</label><br />
        <input type="text" v-model="formComida.otro" /> <br />
        <label>Cantidad de Huevos</label>
        <input type="number" v-model="formComida.huevo" /> <br /><br />

        <button @click="agregarComidaLocal" type="button">Añadir Comida</button>

        <div>
          <ul>
            <li v-for="(c, index) in estadoDia.comidas" :key="index">
              <h4>{{ c.comida }}</h4>
              <p v-if="c.proteina !== '-'">Proteína: {{ c.proteina }}</p>
              <p v-if="c.verdura">Verdura: {{ c.verdura }}</p>
              <p v-if="c.hidratos">Hidrato: {{ c.hidratos }}</p>
              <p v-if="c.fruta">Fruta: {{ c.fruta }}</p>
              <p v-if="c.otro">Otro: {{ c.otro }}</p>
              <p v-if="c.huevo > 0">{{ c.huevo }} huevo/s</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="seccion">
        <h2>Ejercicio</h2>
        <label>Músculo</label><br />
        <input type="text" v-model="formEjercicio.musculo" /> <br />
        <label>Ejercicio</label> <br />
        <input type="text" v-model="formEjercicio.ejercicio" /> <br />
        <label>Peso</label> <br />
        <input type="number" step="0.5" v-model="formEjercicio.peso" /> <br />
        <label>Series X Repeticiones</label> <br />
        <input type="number" v-model="formEjercicio.series" /> <span>X</span>
        <input type="number" v-model="formEjercicio.repeticiones" /> <br /><br />

        <button @click="agregarEjercicioLocal" type="button">Cargar Ejercicio</button>

        <div>
          <ul>
            <li v-for="(ej, index) in estadoDia.ejercicios" :key="'ej-' + index">
              <h4>{{ ej.musculo }}</h4>
              <p>
                Realizados: {{ ej.ejercicio }}. Detalle: {{ ej.series }}X{{
                  ej.repeticiones
                }}
                utilizando {{ ej.peso }}kg
              </p>
            </li>
          </ul>
        </div>
      </div>

      <br /><br />
      <button @click="guardarDiaEnNube" class="btn-gigante">Guardar Día Completo</button>
    </div>

    <div v-if="vistaActual === 'estadisticas'" class="pantalla-estadisticas">
      <h2>Tus Estadísticas 📊</h2>

      <div class="tarjeta-racha">
        <h3>🔥 Racha Actual</h3>
        <p class="numero-gigante">-- días</p>
      </div>

      <div class="tarjeta-racha">
        <h3>💪 Consistencia de Entrenamiento</h3>
        <p>Has entrenado el <strong>--%</strong> de los días registrados.</p>
      </div>

      <button class="btn-secundario">Calcular Historial</button>
    </div>

    <nav class="menu-inferior">
      <button :class="{ activo: vistaActual === 'carga' }" @click="vistaActual = 'carga'">
        📝 Cargar
      </button>
      <button
        :class="{ activo: vistaActual === 'estadisticas' }"
        @click="vistaActual = 'estadisticas'"
      >
        📊 Estadísticas
      </button>
    </nav>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
}
.seccion {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}
.btn-gigante {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Espacio para que el menú no tape el contenido final */
main {
  padding-bottom: 80px;
}

/* Estilos de la nueva pantalla */
.tarjeta-racha {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  text-align: center;
}
.numero-gigante {
  font-size: 48px;
  font-weight: bold;
  color: #ff5722;
  margin: 10px 0;
}

/* El menú fijo inferior */
.menu-inferior {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
.menu-inferior button {
  background: none;
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  color: #666;
}
.menu-inferior button.activo {
  color: #4caf50;
  font-weight: bold;
  border-bottom: 3px solid #4caf50;
}
</style>
