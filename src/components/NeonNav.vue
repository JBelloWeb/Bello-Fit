<script setup>
import { ref } from 'vue'
import { PhHouse, PhBarbell, PhDropSimple } from '@phosphor-icons/vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
})

const activeTab = ref('home')
const slicerRef = ref(null)
const emit = defineEmits(['change', 'open-panel'])

const navItems = [
  { name: 'exercise', icon: PhBarbell },
  { name: 'home', icon: PhHouse },
  { name: 'metrics', icon: PhDropSimple },
]

const selectTab = (name) => {
  if (props.disabled) return
  activeTab.value = name
  emit('change', name)
}

let dragStartY = 0
let didDrag = false
const DRAG_THRESHOLD = 25

const onSlicerStart = (e) => {
  if (props.disabled) return
  if (slicerRef.value && e.pointerId !== undefined) {
    try {
      slicerRef.value.setPointerCapture(e.pointerId)
    } catch (_) {}
  }
  dragStartY = e.clientY
  didDrag = false
}

const onSlicerMove = (e) => {
  if (props.disabled || didDrag) return
  if (dragStartY - e.clientY > DRAG_THRESHOLD) {
    didDrag = true
    emit('open-panel')
  }
}

const onSlicerEnd = () => {
  if (props.disabled) return
  if (!didDrag) emit('open-panel')
  didDrag = false
}
</script>

<template>
  <nav class="neon-navbar" :class="{ 'is-disabled': disabled }">
    <div
      ref="slicerRef"
      class="slicer"
      :class="{ 'is-disabled': disabled }"
      title="Toca o arrastra hacia arriba para abrir el panel"
      @pointerdown="onSlicerStart"
      @pointermove="onSlicerMove"
      @pointerup="onSlicerEnd"
      @pointercancel="onSlicerEnd"
    >
      <span class="slicer-bar"></span>
    </div>

    <div class="nav-background">
      <svg
        width="100%"
        preserveAspectRatio="none"
        viewBox="0 0 611 118"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        >
        <path
          d="M35 1H232.738C235.986 1 238.575 3.21086 239.889 6.29883C241.204 9.39242 241.13 13.1432 239.246 15.9199C230.879 28.2486 226 43.0646 226 59C226 74.9354 230.879 89.7514 239.246 102.08C241.13 104.857 241.204 108.608 239.889 111.701C238.575 114.789 235.986 117 232.738 117H35C16.2064 117 1 102.023 1 83.583V34.417L1.01074 33.5547C1.47583 15.5125 16.5001 1 35 1ZM377.262 1H576C594.794 1.00001 610 15.9773 610 34.417V83.583C610 102.023 594.794 117 576 117H377.262C374.014 117 371.425 114.789 370.111 111.701C368.796 108.608 368.87 104.857 370.754 102.08C379.121 89.7514 384 74.9354 384 59C384 43.0646 379.121 28.2486 370.754 15.9199C368.87 13.1432 368.796 9.39242 370.111 6.29883C371.425 3.21087 374.014 1 377.262 1Z"
          fill="#1F2428"
          fill-opacity="1"
          stroke="#D72638"
          stroke-width="3"
        />
      </svg>
    </div>

    <ul class="nav-items">
      <li
        v-for="item in navItems"
        :key="item.name"
        @click="selectTab(item.name)"
        :class="{ active: activeTab === item.name }"
      >
        <component
          :is="item.icon"
          :size="30"
          :weight="activeTab === item.name ? 'fill' : 'regular'"
        />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.neon-navbar {
  position: fixed;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 400px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition:
    transform 0.35s cubic-bezier(0.1, 0.8, 0.2, 1),
    opacity 0.3s ease;
}

.neon-navbar.is-disabled {
  pointer-events: none;
  transform: translateX(-50%) translateY(-130%);
  opacity: 0;
}

.slicer {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  z-index: 2;
  transition: opacity 0.3s ease;
}

.slicer.is-disabled {
  cursor: default;
  opacity: 0.5;
}

.slicer:active {
  cursor: grabbing;
}

.slicer-bar {
  width: 52px;
  height: 5px;
  border-radius: 999px;
  background-color: rgba(215, 38, 56, 0.6);
  box-shadow:
    0 0 4px rgba(215, 38, 56, 0.7),
    0 0 10px rgba(215, 38, 56, 0.3);
  transition:
    width 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.slicer:hover .slicer-bar,
.slicer:active .slicer-bar {
  width: 70px;
  background-color: rgba(215, 38, 56, 0.9);
  box-shadow:
    0 0 6px rgba(215, 38, 56, 0.9),
    0 0 14px rgba(215, 38, 56, 0.5);
}

.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: drop-shadow(0 0 2px rgba(215, 38, 56, 0.8)) drop-shadow(0 0 4px rgba(215, 38, 56, 0.4))
    drop-shadow(0 0 8px rgba(215, 38, 56, 0.1));
}

.nav-items {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 0 30px;
  list-style: none;
  margin: 0;
  transform: translateY(-20px);
}

.nav-items li {
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-items li.active {
  color: var(--bello-red);
  filter: drop-shadow(0 0 4px rgba(215, 38, 56, 0.8)) drop-shadow(0 0 12px rgba(215, 38, 56, 0.4));
}
</style>
