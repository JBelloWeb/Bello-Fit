<script setup>
defineProps({
  agua: {
    type: Number,
    required: true,
    default: 0,
  },
  suenio: {
    type: Number,
    required: true,
    default: 0,
  },
  ejercicio: {
    type: Number,
    required: true,
    default: 0,
  },
})
</script>

<template>
  <div class="bello-stat">
    <div class="suenio" :style="{ '--fill': suenio + '%' }"></div>

    <div class="ejercicio" :style="{ '--fill': ejercicio + '%' }"></div>

    <div class="agua" :style="{ '--fill': agua + '%' }"></div>
  </div>
</template>

<style scoped>
.bello-stat {
  display: flex;
  justify-content: space-between;
  height: 100px;
  width: 100px;
  align-items: end;
  margin: auto;
}

.suenio,
.ejercicio,
.agua {
  background-color: var(--bello-red);
  height: var(--fill);
  width: 20px;
}

.suenio {
  mask-image: url(../assets/img/izq-mask.png);
  mask-position: center center;
  mask-size: contain;
  mask-mode: alpha;
  mask-repeat: no-repeat;
}
.ejercicio {
  mask-image: url(../assets/img/cent-mask.png);
  mask-position: center center;
  mask-size: contain;
  mask-mode: alpha;
  mask-repeat: no-repeat;
}
.agua {
  mask-image: url(../assets/img/der-mask.png);
  mask-position: center center;
  mask-size: contain;
  mask-mode: alpha;
  mask-repeat: no-repeat;
}
</style>
