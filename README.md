# BELLO-FIT 🚀

> Una aplicación web progresiva (SPA) diseñada para el seguimiento diario de métricas de salud (agua, sueño) y rutinas de entrenamiento muscular, con visualización de datos en tiempo real.

![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-orange)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4CAF50?logo=vuedotjs)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## 📌 Características Principales

* **Gestión de Hábitos:** Registro diario de consumo de agua y horas de sueño.
* **Tracking de Entrenamiento:** Carga detallada de ejercicios (músculo, series, repeticiones y peso).
* **Calendario Deslizable:** Navegación fluida entre fechas históricas mediante un carrusel horizontal.
* **Panel de Analíticas ("Dark Mode"):** Un *bottom sheet* interactivo con gráficos de rendimiento muscular histórico y promedios de hábitos.
* **Sincronización en la Nube:** Persistencia de datos en tiempo real utilizando PostgreSQL.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Vue 3 (Composition API) + Vite.
* **Estilos:** CSS3 puro con variables y estructura de componentes *Scoped*.
* **Gráficos:** ApexCharts (vue3-apexcharts) con estética de gradientes neón.
* **Backend / Base de Datos:** Supabase (BaaS).
* **Arquitectura:** Centralización de estado global (`estadoGlobal.js`) y separación estricta entre Vistas (`views`) y Componentes (`components`).

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura modular para garantizar su escalabilidad:

```text
src/
├── assets/
│   └── main.css               # Estilos globales y variables
├── components/
│   ├── CalendarioSemanal.vue  # Carrusel de navegación de fechas
│   ├── FormularioEjercicio.vue# Componente emisor de datos de entrenamiento
│   ├── PanelEstadisticas.vue  # Bottom sheet con gráficos (ApexCharts)
│   └── ResumenDiario.vue      # Tarjeta de progreso de métricas
├── funcs/
│   └── estadoGlobal.js        # Única fuente de la verdad (Memoria central y DB)
├── views/
│   ├── VistaCarga.vue         # Pantalla principal de hábitos
│   └── VistaCargaEjercicio.vue# Pantalla de rutinas
├── App.vue                    # Controlador de tráfico y Layout base
├── main.js                    # Punto de entrada de Vue y Plugins
└── supabase.js                # Configuración de conexión al backend