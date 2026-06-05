<script setup>
import { onMounted } from 'vue';
import { animate, svg } from 'animejs';

defineProps({
  water: {
    type: Number,
    required: true,
    default: 0,
  },
  sleep: {
    type: Number,
    required: true,
    default: 0,
  },
  exercise: {
    type: Number,
    required: true,
    default: 0,
  },
})

onMounted(() =>{
  // Animate the transforms properties of .car the motion path values
const carAnimation = animate('.car', {
  ease: 'linear',
  duration: 2000,
  loop: true,
  ...svg.createMotionPath('path')
});

// Line drawing animation following the motion path values
// For demo aesthetic only
animate(svg.createDrawable('path'), {
  draw: '0 1',
  ease: 'linear',
  duration: 2000,
  loop: true,
});
})
</script>

<template>
  <div class="car"></div>
  <div class="bello-stat-container">
    <!-- 1. CORCHETE IZQUIERDO (SUEÑO) -->
    <svg viewBox="0 0 234 671" class="svg-side">
      <defs>
        <clipPath id="molde-izquierdo">
          <path d="M186.22 0H102.911L0 327.862L200.921 671H234L138.44 312.585L186.22 0Z" />
        </clipPath>
      </defs>
      <!-- Fondo (Logo Vacío) -->
      <rect
        width="234"
        height="671"
        style="fill: var(--bello-surface)"
        clip-path="url(#molde-izquierdo)"
      />
      <!-- Relleno Animado -->
      <rect
        width="234"
        :height="(sleep / 100) * 671"
        :y="671 - (sleep / 100) * 671"
        style="fill: var(--bello-red)"
        clip-path="url(#molde-izquierdo)"
        class="liquid-animated"
      />
    </svg>

    <!-- 2. FORMA CENTRAL (AGUA) -->
    <svg viewBox="0 0 393 898" class="svg-center">
      <defs>
        <clipPath id="molde-centro">
          <path
            d="M201.761 289.623L79.7433 792.342C-7.07693 785.279 -25.8489 864.16 37.5064 893.593C88.1906 917.139 110.248 840.613 114.941 799.406L226.399 304.928L339.031 58.8665L393 23.5466L367.189 0L319.085 28.2559L201.761 289.623Z"
          />
        </clipPath>
      </defs>
      <rect
        width="393"
        height="898"
        style="fill: var(--bello-surface)"
        clip-path="url(#molde-centro)"
      />
      <rect
        width="393"
        :height="(water / 100) * 898"
        :y="898 - (water / 100) * 898"
        style="fill: var(--bello-cream)"
        clip-path="url(#molde-centro)"
        class="liquid-animated"
      />
    </svg>

    <!-- 3. CORCHETE DERECHO (EJERCICIO) -->
    <svg viewBox="0 0 236 671" class="svg-side">
      <defs>
        <clipPath id="molde-derecho">
          <path d="M48.1885 0H132.209L236 327.862L33.3613 671H0L88.5 327.862L48.1885 0Z" />
        </clipPath>
      </defs>
      <rect
        width="236"
        height="671"
        style="fill: var(--bello-surface)"
        clip-path="url(#molde-derecho)"
      />
      <rect
        width="236"
        :height="(exercise / 100) * 671"
        :y="671 - (exercise / 100) * 671"
        style="fill: var(--bello-red)"
        clip-path="url(#molde-derecho)"
        class="liquid-animated"
      />
    </svg>
  </div>
</template>

<style scoped>
.bello-stat-container {
  display: flex;
  justify-content: center;
  align-items: center; /* Alinea los 3 elementos al centro */
  gap: 10px; /* Separación entre el centro y los corchetes */
  margin: 30px auto;
  width: 100%;
  max-width: 300px; /* Evita que el logo ocupe toda la pantalla */
}

/* Controlamos el tamaño para que mantengan la proporción original de tu diseño */
.svg-side {
  height: 220px;
  width: auto;
}

.svg-center {
  height: 260px; /* Es un poco más alto que los laterales, como en el boceto */
  width: auto;
}

.liquid-animated {
  /* Animación fluida de abajo hacia arriba */
  transition:
    y 1s cubic-bezier(0.1, 0.8, 0.2, 1),
    height 1s cubic-bezier(0.1, 0.8, 0.2, 1);
}
</style>
