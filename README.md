<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


DATABASE_URL=postgresql://ricardo-next-tasktrkr:1996@localhost:5432/task_db_1?schema=public -->


Perfecto, aquí tienes tu **README ajustado al nuevo stack con Next.js + Prisma + PostgreSQL**, manteniendo el espíritu del original pero adaptándolo a la arquitectura moderna que usarás.

---

# 📝 TaskTrackr: Gestión de Tareas Colaborativa (Full-Stack con Next.js)

## 🚀 Visión General del Proyecto

**TaskTrackr** es una aplicación de gestión de tareas construida con un stack **full-stack moderno basado en Next.js 15**, donde el *frontend* y el *backend* conviven en un mismo proyecto gracias a:

✅ **App Router**
✅ **Route Handlers (`server/api/...`)**
✅ **Server Actions**
✅ **Prisma + PostgreSQL**

Este proyecto sirve como plataforma de aprendizaje completa para dominar:

* **Next.js + React + TypeScript**
* **Prisma ORM**
* **Autenticación con JWT o NextAuth (a elegir)**
* **Patrones modernos de arquitectura full-stack**

---

# 🧩 Stack Tecnológico

| Componente                   | Tecnologías Clave                            | Propósito                                            |
| :--------------------------- | :------------------------------------------- | :--------------------------------------------------- |
| **Full-Stack (single repo)** | Next.js 15 (App Router), React, TypeScript   | UI + API + lógica del servidor en un mismo proyecto. |
| **Backend interno**          | Route Handlers `/app/api/**`, Server Actions | Endpoints REST y lógica del backend integrada.       |
| **Base de Datos**            | PostgreSQL, Prisma ORM                       | Manejo de esquemas, migraciones y consultas tipadas. |
| **Desarrollo**               | Docker, dotenv, Turbopack                    | Entorno aislado y *Hot Reload* rapidísimo.           |

---

# 🏗️ Estructura del Proyecto

La estructura ahora es mucho más compacta:

```
TaskTrkr/
├── app/
│   ├── api/            # Endpoints del backend
│   │   └── tasks/
│   │       └── route.ts
│   ├── dashboard/      # UI protegida
│   ├── login/
│   └── layout.tsx
│
├── prisma/
│   └── schema.prisma   # Modelos + migraciones
│
├── lib/
│   └── prisma.ts       # Cliente de Prisma con singleton
│
├── .env
├── package.json
└── README.md
```

No existe carpeta `/server`: **Next ya es el servidor**.

---

# 🛠️ Guía de Inicio Rápido

## 1️⃣ Prerrequisitos

Necesitas tener instalado:

* Node.js LTS
* Docker Desktop (para PostgreSQL)

---

## 2️⃣ 💾 Levantar la Base de Datos con Docker

Ejecuta:

```bash
docker run --name tasktrkr-postgres \
  -e POSTGRES_USER=ricardo-tasktrkr \
  -e POSTGRES_PASSWORD=1996 \
  -e POSTGRES_DB=task_db \
  -p 5432:5432 \
  -d postgres
```

---

## 3️⃣ 🔑 Configurar Variables de Entorno `.env`

En la raíz del proyecto:

```env
DATABASE_URL="postgresql://ricardo-tasktrkr:1996@localhost:5432/task_db?schema=public"

# Si usas JWT
JWT_SECRET="cadena_super_secreta_de_32_caracteres_o_mas"
```

---

## 4️⃣ 📦 Instalar dependencias

```bash
npm install
```

---

## 5️⃣ 🗂️ Crear tablas con Prisma

```bash
npx prisma migrate dev --name init_models
```

---

## 6️⃣ 🚀 Iniciar el Proyecto

```bash
npm run dev
```

Abre:

👉 `http://localhost:3000`

---

# 📚 Scripts Útiles

| Script                   | Descripción                                  |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Inicia Next.js con HMR (Turbopack).          |
| `npx prisma studio`      | Abre GUI para ver y editar la base de datos. |
| `npx prisma migrate dev` | Aplica migraciones y actualiza la BD.        |
| `npm run build`          | Construye la app para producción.            |

---

# 🧠 ¿Por qué este stack es ideal para aprender?

### ✔ Aprendes **frontend + backend en un mismo proyecto**

No tienes que hacer configuración de CORS, proxys ni mantener dos repos.

### ✔ Next te enseña conceptos modernos como:

* Server Components
* Data Fetching avanzado
* Mutaciones con Server Actions
* Route Handlers (mini-Express dentro de Next)

### ✔ Prisma es perfecto para aprender SQL de forma segura

Lo hace progresivo:
**primero ORM, luego SQL real cuando estés listo.**

### ✔ Puedes migrar más tarde a Express sin dolor

Todo lo aprendido en Next.js:

* rutas,
* handlers,
* auth,
* acceso a BD con Prisma
  se trasladan perfectamente a Express.

---

# 🎁 Si quieres, te preparo *también* el `schema.prisma` para el clon de Trello:

* User
* Board
* List
* Card
* Activity Log
* Memberships

---------------------------------------------------------------

Perfecto, con **4 horas al día x 5 días = 20 horas semanales**, puedes avanzar *muy deprisa*.
Con ese ritmo, esto es lo que puedes esperar **realísticamente**:

---

# ⏳ **Tiempo total estimado con 20h/semana**

## 👉 **2.5 a 3 semanas**

para tener tu clon de Trello **completo, funcional y bonito** con Next + Prisma.

Y si quieres la versión Express **después**, esa serían otras **2 semanas**.

---

# 📅 **Plan realista semana por semana (20h/semana)**

## 🟦 **SEMANA 1 (20h): Fundamentos + Auth + Boards**

> **Resultado:** App funcionando, login, signup, ver tableros.

**Día 1–2 (8h): Setup**

* Crear proyecto Next.js
* Crear BD con Docker
* Instalar Prisma + schema
* Migraciones
* Crear primeras rutas de API
* Test de endpoints

**Día 3 (4h): Persistencia**

* CRUD de `Board`
* Server Actions o API Routes
* Comprobar que Next ↔ Prisma funciona bien

**Día 4–5 (8h): Autenticación**

* Login / Signup
* Protect routes
* Layout con sesión
* Navbar con usuario

👉 Aquí ya tienes una app que te deja registrarte, entrar y ver tus tableros.

---

## 🟩 **SEMANA 2 (20h): Lists + Cards + UI**

> **Resultado:** Un Trello visible y útil.

**Día 1–2 (8h): Listas**

* CRUD de `List` dentro del board
* Pintar listas en UI
* Server Actions para crear / editar / borrar

**Día 3–4 (8h): Tarjetas**

* CRUD de `Card`
* Interfaz tipo Trello
* Modal o inline-edit para tarjetas

**Día 5 (4h): Refinar UI**

* Estilos
* Bordes, sombras
* Empty states
* Scroll suave y overflow

👉 Aquí tienes un Trello donde puedes crear listas y tarjetas como un usuario normal.

---

## 🟧 **SEMANA 3 (20h): Drag & Drop + roles + mejoras**

> **Resultado:** Tu clon es **“Trello-like”**, usable y profesional.

**Día 1–2 (8h): Drag & Drop**

* Añadir react-beautiful-dnd o dnd-kit
* Reordenar tarjetas
* Reordenar listas
* Guardar cambios en BD

**Día 3 (4h): Roles y compartir tableros**

* Invitar usuarios por email
* Owner / guest / member (simple)

**Día 4–5 (8h): Optimizaciones**

* Mejorar rendimiento
* Loading states
* Errores
* Test básicos
* Vista móvil
* Deploy final (Vercel + Railway)

👉 Tu clon de Trello está **terminado**.

---

# 🧠 Resultado si sigues este ritmo

En 3 semanas:

### ✔ tienes un clon de Trello con funcionalidades reales

### ✔ entiendes backend moderno con Next

### ✔ entiendes base de datos + Prisma

### ✔ entiendes arquitectura de proyecto

### ✔ tienes un portfolio potente

### ✔ estás preparado para rehacer la API con Express

---

# ¿Quieres que te prepare un Planning Detallado Día por Día?

Con tareas exactas para cada sesión de 4 horas (como un plan de entrenamiento 🏋️‍♂️ para devs).


--------------------------------------------------------------------------------

Perfecto. Aquí tienes un **planning completo, día por día**, pensado para:

* **4 horas de trabajo por día**
* **5 días por semana (20 horas)**
* **Duración total: 3 semanas**
* **Objetivo: clon de Trello completo con Next.js + Prisma + PostgreSQL**

Está diseñado para que cada día avances una “pieza” concreta sin bloquearte.

---

# 🗓️ **SEMANA 1 — Fundamentos + Auth + Boards**

> Objetivo: tener la base, la BD, la arquitectura y la parte de tableros + autenticación.

---

## **Día 1 — Setup del proyecto (4h)**

### 🎯 Objetivo: dejar todo listo para poder empezar

**Tareas:**

* Crear proyecto Next.js con TypeScript
* Crear contenedor PostgreSQL con Docker
* Instalar Prisma (`npm install prisma @prisma/client`)
* Inicializar Prisma (`npx prisma init`)
* Crear `.env`
* Crear el schema inicial (`User`, `Board`, `List`, `Card`)
* Ejecutar `prisma migrate dev`
* Crear primer “hello world” con Server Action o API Route
* Probar conexión BD ↔ Next

**Resultado del día:**
Tu proyecto arranca, tu BD existe, y tu backend ya habla con tu base de datos.

---

## **Día 2 — Primeros modelos y endpoints (4h)**

### 🎯 Objetivo: tener boards mínimos funcionando

**Tareas:**

* Crear endpoint o Server Action para crear un Board
* Crear endpoint para obtener Boards del usuario
* Probar con Thunder Client o Postman
* Crear página `/boards` que liste tus boards
* Crear botón "Crear Board"

**Resultado:**
Puedes crear tableros y verlos en la UI.

---

## **Día 3 — Autenticación: registro (4h)**

### 🎯 Objetivo: que el usuario pueda registrarse

**Tareas:**

* Instalar bcrypt
* Crear formulario de registro
* Crear Server Action `/signup`
* Validar correo ya existente
* Guardar usuario en BD
* Redirigir a login

**Resultado:**
Registro funcional.

---

## **Día 4 — Autenticación: login + sesión (4h)**

### 🎯 Objetivo: iniciar sesión y mantenerla

**Tareas:**

* Crear formulario de login
* Crear Server Action `/login`
* Crear JWT con `jsonwebtoken`
* Crear cookie segura
* Middleware para proteger rutas (middleware.ts)
* Proteger `/boards`

**Resultado:**
Login real, cookie de sesión, rutas privadas.

---

## **Día 5 — Layout + Navbar + UX inicial (4h)**

**Tareas:**

* Crear layout para usuarios logueados
* Barra superior con links: Boards / Perfil / Logout
* Crear página de perfil
* Logout eliminando cookie
* Estilos base con Tailwind
* Limpiar estructura de carpetas

**Resultado:**
UX básica funcionando como una app real.

---

# 🗓️ **SEMANA 2 — Lists + Cards + UI**

> Objetivo: construir el 70% del Trello.

---

## **Día 6 — CRUD de Lists (4h)**

**Tareas:**

* Crear Server Actions:

  * createList
  * updateList
  * deleteList
* Mostrar listas dentro del tablero
* UI con tarjetas vacías
* Inputs + botones de añadir lista

**Resultado:**
Tienes listas dentro de cada tablero como en Trello.

---

## **Día 7 — CRUD de Cards (4h)**

**Tareas:**

* Server Actions:

  * createCard
  * updateCard
  * deleteCard
* Mostrar tarjetas dentro de listas
* Crear modal o inline-edit para card
* Añadir estados de carga

**Resultado:**
Tu tablero ya tiene tarjetas editables y reales.

---

## **Día 8 — UI más avanzada (4h)**

**Tareas:**

* Mejorar diseño estilo Trello
* Sombreado a listas, bordes, colores
* Crear layout horizontal de listas con scroll-X
* Añadir iconos
* Mejorar formularios

**Resultado:**
Ya parece una aplicación de verdad.

---

## **Dye 9 — Vista del tablero y UX (4h)**

**Tareas:**

* Header del tablero con título editable
* Botón de borrar tablero
* Estados vacíos (cuando no hay listas)
* Loader global o skeletons
* Manejar errores visualmente

**Resultado:**
Toda la UX básica está refinada.

---

## **Día 10 — Limpieza + estado global (4h)**

**Tareas:**

* Elegir si usar Zustand o mantener Server Actions
* Extraer lógica repetida
* Crear hooks
* Reorganizar carpetas (`app/boards/[id]/...`)
* Revisar seguridad en Server Actions

**Resultado:**
Tu código queda limpio y escalable.

---

# 🗓️ **SEMANA 3 — Drag & Drop + Roles + Deploy**

> Objetivo: completar la parte avanzada y lanzar tu clon.

---

## **Día 11 — Drag & Drop: fundamentos (4h)**

**Tareas:**

* Instalar DnD Kit (recomendado)
* Hacer draggable una tarjeta
* Hacer droppable una lista
* Mover tarjeta dentro de una misma lista

**Resultado:**
Movimiento básico funcionando.

---

## **Día 12 — Drag & Drop: niveles pro (4h)**

**Tareas:**

* Mover tarjetas entre listas
* Guardar posición en BD
* Reordenación estable
* Animaciones suaves

**Resultado:**
DnD como Trello: fluido y estable.

---

## **Día 13 — Drag & Drop de listas (4h)**

**Tareas:**

* Hacer listas draggeables
* Ordenarlas horizontalmente
* Guardar orden en BD
* Actualizar UI dinámicamente

**Resultado:**
Toda la estructura del tablero es flexible.

---

## **Día 14 — Roles + sharing (4h)**

**Tareas:**

* Añadir modelo `BoardMember` (opcional)
* Invitar usuario por email
* Owner / Member
* Validación antes de editar
* Control de acceso en Server Actions

**Resultado:**
Tu app tiene colaboración real.

---

## **Día 15 — Deploy + optimizaciones finales (4h)**

**Tareas:**

* Deploy frontend en Vercel
* Deploy BD + backend (Railway / Neon / Supabase)
* Reconfigurar env
* Revisar Lighthouse performance
* Repaso final del código
* Documentar en README

**Resultado final:**
Tu clon de Trello está **publicado**, con UI pulida, drag & drop, CRUD completo, roles y auth.

---

# 🎉 Resultado final en 3 semanas

Si sigues este plan:

### ✔ Tendrás un clon de Trello totalmente funcional

### ✔ Aprenderás full-stack moderno real (Next + Prisma)

### ✔ Tendrás un portfolio muy sólido

### ✔ Estarás preparado para rehacer la API en Express

---

Si quieres, puedo hacerte también:

* **Checklist imprimible**
* **Plantilla de carpetas**
* **Schema Prisma completo**
* **Plan igual de detallado para la versión Express**

¿Quieres alguno de esos?
