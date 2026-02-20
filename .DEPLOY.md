# 🚀 Guía de Deploy - TaskTrackr (Paso a Paso para Principiantes)

Esta guía te explica **cada paso** para publicar tu app en internet. Si nunca has desplegado nada, está pensada para ti: incluye el **qué**, el **cómo** y el **por qué** de cada acción.

---

## 📖 ¿Qué vamos a hacer y por qué?

Cuando ejecutas `npm run dev` en tu PC, tu app corre en `localhost:3000`. Eso solo existe en tu ordenador. **Deploy** significa poner esa misma app en servidores que están en internet 24/7, para que cualquiera pueda acceder con una URL.

Tu app necesita **dos cosas en la nube**:

1. **Un servidor que ejecute el código** (Next.js, tus API routes, etc.) → Lo haremos con **Vercel**.
2. **Una base de datos PostgreSQL** (usuarios, tableros, listas, tarjetas) → La harás con **Neon** o **Supabase**.

**¿Por qué no usar tu PostgreSQL local?** Porque tu PC no está siempre encendido ni accesible desde internet. Neon/Supabase mantienen la BD en sus servidores para que esté siempre disponible.

---

## ✅ Antes de empezar: Lo que necesitas tener

- [ ] **Cuenta en GitHub** → [github.com](https://github.com) (si no tienes, créala).
- [ ] **Node.js instalado** → (ya lo tienes si el proyecto corre localmente).
- [ ] **Tu proyecto funcionando en local** → `npm run dev` y todo OK.
- [ ] **Git instalado** → Si usas `git` en la terminal, lo tienes.
- [ ] **30-45 minutos** sin interrupciones.

---

# PARTE 0: Conceptos que verás durante el deploy

| Término | Significado sencillo |
|---------|----------------------|
| **Deploy** | Subir tu app a un servidor para que esté disponible en internet. |
| **Repositorio (repo)** | Carpeta de tu proyecto alojada en GitHub. |
| **Variable de entorno** | Datos sensibles (contraseñas, URLs) que no van en el código por seguridad. |
| **Connection string** | URL que contiene usuario, contraseña y dirección de tu base de datos. |
| **Migración** | Script que crea o modifica tablas en la base de datos. |
| **Build** | Proceso que compila tu código para que pueda ejecutarse en producción. |

---

# PARTE 1: Crear la base de datos en la nube

## ¿Por qué esta parte?

Tu app usa Prisma para conectarse a PostgreSQL. En local, la BD está en `localhost:5432`. En producción, necesitas una BD en internet. **Neon** y **Supabase** ofrecen PostgreSQL gratuito y compatible con Prisma.

Elegimos **Neon** por su sencillez. Si prefieres Supabase, hay una sección alternativa al final de esta parte.

---

## 1.1 Entrar en Neon

1. Abre el navegador y ve a **[neon.tech](https://neon.tech)**.
2. Haz clic en **"Sign up"** (arriba a la derecha).
3. Elige **"Sign up with GitHub"**. Esto conecta tu cuenta de GitHub con Neon.
4. Si GitHub te pide permiso, acepta. Neon solo necesita acceso básico para identificar tu cuenta.

**Por qué GitHub:** Es rápido y evita crear otra contraseña. Vercel también usará GitHub, así que todo queda unificado.

---

## 1.2 Crear un proyecto en Neon

1. Una vez dentro, verás el dashboard de Neon.
2. Haz clic en **"New Project"** (o "Create a project").
3. Rellena:
   - **Project name:** `tasktrkr` (o el que prefieras).
   - **Region:** Elige la más cercana a ti (ej: `Europe (Frankfurt)` si estás en España).
4. Haz clic en **"Create project"**.

**Por qué elegir región:** Cuanto más cerca esté el servidor, menos latencia tendrán las peticiones a la base de datos.

---

## 1.3 Obtener la Connection String

1. Tras crear el proyecto, Neon te mostrará un panel con la base de datos.
2. Busca la sección **"Connection string"** o **"Connection details"**.
3. Verás algo como:
   ```
   postgresql://neondb_owner:XXXXXXXXXXXXXXXX@ep-XXXX-XXXX.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Haz clic en **"Copy"** para copiarla al portapapeles.
5. **Guárdala en un bloc de notas temporal** (la vas a usar varias veces). No la compartas ni la subas a GitHub.

**Qué es cada parte de la URL:**
- `postgresql://` → Protocolo de PostgreSQL.
- `neondb_owner` → Usuario de la BD.
- `XXXXXXXXXXXXXXXX` → Contraseña (Neon la genera automáticamente).
- `ep-XXXX.eu-central-1.aws.neon.tech` → Dirección del servidor.
- `neondb` → Nombre de la base de datos.
- `?sslmode=require` → Conexión cifrada (obligatorio en producción).

---

## 1.4 (Opcional pero recomendado) Usar Connection Pooler

Vercel ejecuta tu app en modo **serverless**: cada petición puede usar una conexión distinta a la BD. Las bases de datos tienen un límite de conexiones simultáneas. El **Connection Pooler** agrupa las conexiones para no superar ese límite.

1. En el dashboard de Neon, busca **"Connection pooling"** o **"Pooled connection"**.
2. Si ves una URL que incluye `-pooler` en el host (ej: `ep-xxx-pooler.region.aws.neon.tech`), usa esa en lugar de la normal.
3. O en la sección de conexiones, cambia el modo a **"Pooled"** y copia esa URL.

**Si no encuentras el pooler:** No pasa nada. Usa la URL normal. Si más adelante ves errores de "too many connections", entonces cambias a la URL con pooler.

---

## 1.5 Alternativa: Supabase

Si prefieres usar Supabase:

1. Ve a **[supabase.com](https://supabase.com)** y crea una cuenta.
2. **New project** → Nombre, contraseña de la BD (guárdala) y región.
3. Espera unos minutos a que se cree el proyecto.
4. Ve a **Project Settings** (icono de engranaje) → **Database**.
5. Busca **"Connection string"** → pestaña **"URI"**.
6. Copia la URL. Debe incluir tu contraseña. Si dice `[YOUR-PASSWORD]`, sustituye eso por la contraseña que elegiste al crear el proyecto.
7. Para Vercel, es mejor usar el **Connection pooler**: en la misma pantalla busca "Connection pooling" o el puerto **6543** y usa esa URL.

---

# PARTE 2: Aplicar migraciones a la base de datos en la nube

## ¿Qué son las migraciones y por qué hay que ejecutarlas?

Las migraciones son archivos (en `prisma/migrations/`) que describen la estructura de tus tablas: User, Board, List, Card. En local, ya ejecutaste `prisma migrate dev` y las tablas existen en tu PostgreSQL local.

La base de datos de Neon/Supabase está **vacía**. No tiene tablas. Debes decirle a Prisma que cree las mismas tablas allí. El comando `prisma migrate deploy` hace exactamente eso: aplica las migraciones pendientes a la BD que indique `DATABASE_URL`.

---

## 2.1 Configurar la URL de la BD de producción

Necesitamos que Prisma use la URL de Neon cuando ejecutemos el comando de migración. La forma más sencilla es **temporalmente** cambiar tu archivo `.env`:

1. Abre el archivo `.env` que tienes en la raíz del proyecto (donde está `DATABASE_URL` con tu PostgreSQL local).
2. **Guarda una copia** del contenido actual en un bloc de notas (lo restaurarás después).
3. **Sustituye** la línea `DATABASE_URL=...` por la URL de Neon que copiaste. Debe quedar así (con tu URL real):

   ```env
   DATABASE_URL="postgresql://neondb_owner:XXXXXXXX@ep-XXXX.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="tu_jwt_secret_actual"
   ```

4. Guarda el archivo `.env`.

**Importante:** El archivo `.env` está en `.gitignore`, así que **nunca** se sube a GitHub. Tus credenciales están seguras.

**Por qué cambiar temporalmente:** Prisma lee siempre de `.env`. Al poner ahí la URL de Neon, el siguiente comando usará esa base de datos. Después del paso 2.2, volverás a poner tu `DATABASE_URL` local para seguir desarrollando.

---

## 2.2 Ejecutar las migraciones

1. Con el `.env` ya actualizado con la URL de Neon (paso 2.1), abre la terminal en la raíz del proyecto.
2. Ejecuta:

   ```bash
   npx prisma migrate deploy
   ```

   Prisma leerá `DATABASE_URL` del archivo `.env` y aplicará las migraciones a la base de datos de Neon.

3. Deberías ver algo como:
   ```
   Applying migration `20251124142642_init_models`
   The following migration(s) have been applied:
   migrations/
   └── 20251124142642_init_models/
       └── migration.sql
   All migrations have been successfully applied.
   ```

**Si ves un error:**
- `Can't reach database server` → Revisa que la URL sea correcta y que incluya `?sslmode=require`.
- `Migration X failed` → Copia el mensaje completo y búscalo en internet o revisa que la URL apunte a la BD correcta.

4. **Importante:** Cuando termines, vuelve a abrir `.env` y restaura tu `DATABASE_URL` local (la de tu PostgreSQL en localhost). Así seguirás desarrollando contra tu base de datos local. La URL de Neon solo la necesitas para el deploy; en Vercel la configurarás como variable de entorno.

---

## 2.3 Verificar que las tablas existen (opcional)

Si quieres confirmar que todo salió bien **antes** de restaurar tu `.env` local:

1. Con la URL de Neon todavía en tu `.env`, ejecuta en la terminal:
   ```bash
   npx prisma studio
   ```
2. Se abrirá una ventana del navegador en `http://localhost:5555`.
3. En el panel izquierdo deberías ver: **User**, **Board**, **List**, **Card**.
4. Cierra Prisma Studio con `Ctrl+C` en la terminal.
5. Luego restaura tu `DATABASE_URL` local en `.env` como indicamos en el paso 2.2.

**Por qué verificar:** Te da confianza de que las tablas existen en Neon antes de conectar la app en Vercel. Si prefieres ir directo al deploy, puedes saltarte este paso.

---

# PARTE 3: Subir el código a GitHub

## ¿Por qué GitHub?

Vercel se conecta a tu repositorio de GitHub. Cada vez que haces `git push`, Vercel puede detectar los cambios y hacer un nuevo deploy automático. Es el flujo estándar para este tipo de proyectos.

---

## 3.1 Comprobar que tienes Git inicializado

1. Abre la terminal en la raíz del proyecto.
2. Ejecuta:
   ```bash
   git status
   ```
3. Si ves archivos listados o "On branch master/main", Git está configurado.

**Si dice "not a git repository":**
```bash
git init
git add .
git commit -m "Initial commit"
```

---

## 3.2 Crear el repositorio en GitHub (si aún no existe)

1. Ve a [github.com](https://github.com) e inicia sesión.
2. Clic en el **+** (arriba a la derecha) → **"New repository"**.
3. **Repository name:** `next-tasktrkr` (o el nombre que uses).
4. Deja **Private** o **Public** como prefieras.
5. **No** marques "Add a README" (ya tienes uno).
6. Clic en **"Create repository"**.

---

## 3.3 Conectar tu proyecto local con GitHub y subir

Si el repo ya existe en GitHub:

```bash
git remote add origin https://github.com/TU_USUARIO/next-tasktrkr.git
```

(Sustituye `TU_USUARIO` por tu usuario de GitHub.)

Si ya tenías `origin` configurado, omite ese comando.

Luego:

```bash
git add .
git commit -m "Ready for deploy"
git branch -M main
git push -u origin main
```

**Si tu rama se llama `master` en vez de `main`:**
```bash
git push -u origin master
```

**Qué hace cada comando:**
- `git add .` → Prepara todos los archivos modificados.
- `git commit` → Crea un punto de guardado con ese mensaje.
- `git push` → Envía esos cambios a GitHub.

Tras el `push`, tu código estará en GitHub y Vercel podrá leerlo.

---

# PARTE 4: Deploy en Vercel

## ¿Qué es Vercel?

Vercel es la empresa detrás de Next.js. Su plataforma está pensada para desplegar aplicaciones Next.js con un par de clics. Te dan un dominio (por ejemplo `tasktrkr.vercel.app`) y un servidor que ejecuta tu código.

---

## 4.1 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com).
2. Clic en **"Sign up"**.
3. Elige **"Continue with GitHub"**.
4. Autoriza a Vercel cuando GitHub lo pida.

---

## 4.2 Importar tu proyecto

1. En el dashboard de Vercel, clic en **"Add New..."** → **"Project"**.
2. Verás una lista de tus repositorios de GitHub. Busca `next-tasktrkr` (o el nombre de tu repo).
3. Clic en **"Import"** al lado de tu proyecto.

---

## 4.3 Configurar el proyecto (pantalla de importación)

En la pantalla de configuración verás varias opciones:

| Campo | Qué poner | Por qué |
|-------|-----------|---------|
| **Project Name** | `tasktrkr` o el que quieras | Es el nombre que aparecerá en la URL. |
| **Framework Preset** | Next.js (debería detectarlo) | Ya está bien por defecto. |
| **Root Directory** | Dejar vacío | El proyecto está en la raíz. |
| **Build Command** | `npm run build` (o vacío) | Tu `package.json` ya tiene `"build": "prisma generate && next build"`. |
| **Output Directory** | Dejar vacío | Next.js lo maneja solo. |
| **Install Command** | `npm install` (o vacío) | Normalmente no hace falta cambiarlo. |

**No hagas clic en Deploy todavía.** Primero añadiremos las variables de entorno.

---

## 4.4 Añadir variables de entorno (MUY IMPORTANTE)

Las variables de entorno son valores que tu app necesita en tiempo de ejecución pero que **no deben estar en el código** (por seguridad). En Vercel las defines en la web y se inyectan cuando la app se ejecuta.

### Variable 1: DATABASE_URL

1. En la misma pantalla, busca **"Environment Variables"**.
2. En **Key** escribe: `DATABASE_URL`
3. En **Value** pega la URL completa de Neon (la que copiaste antes).
4. Deja marcado **Production**, **Preview** y **Development** (o al menos **Production**).
5. Clic en **"Add"** o en la tecla Enter.

### Variable 2: JWT_SECRET

Tu app usa JWT para las sesiones. Necesita una clave secreta para firmar los tokens. Debe ser larga y aleatoria.

**Generar una clave segura:**

**Opción A – Terminal (recomendado):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copia la salida (algo como `K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=`).

**Opción B – Generador online:** Busca "random string generator" y genera una cadena de al menos 32 caracteres.

1. En **Key** escribe: `JWT_SECRET`
2. En **Value** pega la clave generada.
3. Marca **Production** (y si quieres también Preview y Development).
4. Clic en **"Add"**.

**Por qué no usar la misma que en local:** En producción es mejor que la clave sea distinta. Si alguien obtuviera la de desarrollo, no tendría acceso a los datos de producción.

---

## 4.5 Hacer el Deploy

1. Comprueba que has añadido **DATABASE_URL** y **JWT_SECRET**.
2. Clic en **"Deploy"**.
3. Verás un log en tiempo real del proceso:
   - **Installing dependencies** → Descarga las dependencias.
   - **Running build** → Ejecuta `prisma generate` y `next build`.
   - **Deploying** → Sube el resultado a los servidores.

**Puede tardar 2–5 minutos.**

---

## 4.6 Si el build falla

1. En la pantalla del deploy, verás un log con mensajes en rojo.
2. Errores frecuentes y qué revisar:

   | Error | Posible causa | Solución |
   |-------|----------------|----------|
   | `Prisma can't find DATABASE_URL` | Variable mal configurada | Revisa que `DATABASE_URL` esté en Vercel sin espacios ni comillas extra. |
   | `JWT_SECRET is not defined` | Falta la variable | Añade `JWT_SECRET` en Environment Variables. |
   | `Can't reach database server` | BD inaccesible o URL mal copiada | Verifica la URL, que tenga `?sslmode=require` y que el proyecto de Neon esté activo. |
   | `Module not found` o error de import | Algún archivo no subido o ruta incorrecta | Comprueba que el proyecto está completo en GitHub. |

3. Después de corregir las variables, en Vercel ve a **Deployments** → clic en los tres puntos del último deployment → **"Redeploy"**.

---

## 4.7 Si el build termina bien

1. Verás algo como **"Congratulations! Your project has been deployed."**
2. Clic en **"Visit"** o en la URL que te muestra (ej: `https://tasktrkr-xxx.vercel.app`).
3. Tu app debería cargar en esa URL.

---

# PARTE 5: Verificar que todo funciona

Sigue este orden para comprobar que la app funciona correctamente:

1. **Página de inicio**  
   Abre la URL de Vercel. Deberías ser redirigido a `/login`.

2. **Registro**  
   - Clic en "Regístrate" o ve a `/signup`.
   - Crea un usuario con email y contraseña (mínimo 6 caracteres).
   - Deberías ser redirigido a `/boards`.

3. **Crear tablero**  
   - Clic en "Crear Tablero".
   - Pon un título y guarda.
   - Deberías ver el tablero en la lista.

4. **Abrir tablero**  
   - Entra en el tablero.
   - Crea una lista y alguna tarjeta.
   - Prueba el drag & drop.

5. **Cerrar sesión y volver a entrar**  
   - Clic en el icono de logout.
   - Vuelve a iniciar sesión con el mismo usuario.
   - Los datos deberían seguir ahí (están en la BD de Neon).

Si todo esto funciona, el deploy está correcto.

---

# PARTE 6: Despliegues automáticos

Cada vez que hagas `git push` a la rama que conectaste (main/master), Vercel detectará el cambio y hará un nuevo deploy automáticamente. No necesitas repetir los pasos manualmente.

Puedes ver el historial de deploys en **Vercel → tu proyecto → Deployments**.

---

# PARTE 7: Preguntas frecuentes

### ¿Puedo cambiar la URL de mi app?

Sí. En Vercel → Project → Settings → Domains puedes:
- Cambiar el subdominio (ej: `tasktrkr` en `tasktrkr.vercel.app`).
- Añadir un dominio propio si lo tienes.

### ¿Las variables de entorno son seguras?

Sí. Vercel las almacena cifradas y no se muestran completas en los logs. No se incluyen en el código que se sube a GitHub.

### ¿Qué pasa si me quedo sin espacio en Neon?

En el plan gratuito de Neon suele haber unos 512 MB. Para una app de uso personal o portfolio es suficiente. Si crece, puedes pasar a un plan de pago o mover la BD a otro proveedor.

### ¿Puedo tener varios entornos (desarrollo, producción)?

Sí. En Vercel puedes definir variables distintas para Production, Preview y Development. Para development, muchas veces se sigue usando tu `.env` local.

### ¿Los videos e imágenes de /public se suben?

Sí. Todo lo que está en la carpeta `public` se despliega. Ten en cuenta que los archivos muy grandes pueden hacer el deploy más lento. El plan gratuito de Vercel tiene límites de tamaño de proyecto.

---

# Glosario rápido

| Término | Explicación |
|---------|-------------|
| **Deploy** | Subir y publicar tu app en servidores accesibles por internet. |
| **Serverless** | Modelo donde cada petición se atiende en una función efímera, sin un servidor siempre encendido. |
| **Environment Variable** | Valor configurado en el sistema o en la plataforma, no en el código fuente. |
| **Connection string** | Cadena que contiene toda la información para conectarse a una base de datos. |
| **Build** | Proceso de compilación que convierte tu código en algo ejecutable en producción. |
| **Migration** | Cambio versionado en el esquema de la base de datos (crear tablas, columnas, etc.). |

---

# Resumen: Checklist antes del deploy

- [ ] Cuenta en Neon creada, proyecto creado, connection string copiada.
- [ ] Migraciones aplicadas con `prisma migrate deploy` a la BD de Neon.
- [ ] Código subido a GitHub con `git push`.
- [ ] Proyecto importado en Vercel desde GitHub.
- [ ] Variables `DATABASE_URL` y `JWT_SECRET` configuradas en Vercel.
- [ ] Deploy completado sin errores.
- [ ] Pruebas realizadas: registro, login, crear tablero, listas, tarjetas.

Si tienes dudas en algún paso, vuelve a leer la sección correspondiente. Cada apartado incluye el motivo de lo que estás haciendo.
