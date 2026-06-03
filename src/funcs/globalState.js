import { reactive } from 'vue'
import { supabase } from '../supabase.js'

export const dayState = reactive({
  date: new Date().toISOString().split('T')[0],
  metrics: { water: 0, sleep: 0 },
  exercises: [],
})

export const metricsInputs = reactive({ water: null, sleep: null })

export const loadDayData = async () => {
  const selectedDate = dayState.date
  if (!selectedDate) return

  dayState.exercises = []
  dayState.metrics.water = 0
  dayState.metrics.sleep = 0

  try {
    const { data: daily, error: dailyError } = await supabase
      .from('registro_diario')
      .select('*')
      .eq('dia_id', selectedDate)
      .maybeSingle()

    if (dailyError) throw dailyError

    if (daily) {
      dayState.metrics.water = daily.agua || 0
      dayState.metrics.sleep = daily.suenio || 0
    }

    const { data: exercisesDb, error: exercisesError } = await supabase
      .from('ejercicio')
      .select('*')
      .eq('dia_fk', selectedDate)

    if (exercisesError) throw exercisesError

    if (exercisesDb && exercisesDb.length > 0) {
      exercisesDb.forEach((ex) => {
        dayState.exercises.push({
          muscle: ex.musculo,
          exercise: ex.ejercicio,
          weight: ex.peso,
          sets: ex.series_x_repeticiones.split('X')[0] || 0,
          reps: ex.series_x_repeticiones.split('X')[1] || 0,
        })
      })
    }
  } catch (error) {
    console.error('Error al recuperar los datos de Supabase:', error)
  }
}

export const saveDayToCloud = async () => {
  const date = dayState.date
  if (!date) {
    alert('Seleccioná una fecha')
    return
  }

  const newWater = metricsInputs.water ? Number(metricsInputs.water) : 0
  const newSleep = metricsInputs.sleep ? Number(metricsInputs.sleep) : 0
  dayState.metrics.water += newWater
  dayState.metrics.sleep += newSleep
  const didExercise = dayState.exercises.length > 0

  try {
    const { error: dayError } = await supabase.from('registro_diario').upsert({
      dia_id: date,
      agua: dayState.metrics.water,
      suenio: dayState.metrics.sleep,
      ejercicios: didExercise,
    })
    if (dayError) throw dayError

    await supabase.from('ejercicio').delete().eq('dia_fk', date)

    if (dayState.exercises.length > 0) {
      const exercisesPayload = dayState.exercises.map((ex) => ({
        dia_fk: date,
        musculo: ex.muscle,
        ejercicio: ex.exercise,
        peso: ex.weight,
        series_x_repeticiones: `${ex.sets}X${ex.reps}`,
      }))
      const { error: exError } = await supabase.from('ejercicio').insert(exercisesPayload)
      if (exError) throw exError
    }
    alert('¡Día guardado con éxito!')
    metricsInputs.water = null
    metricsInputs.sleep = null
  } catch (error) {
    console.error('Error al guardar:', error)
    alert(`Hubo un error: ${error.message}`)
  }
}
