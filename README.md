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
* **Autenticación con JWT, NextAuth**
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
