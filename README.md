# Tu Hostal — App de reservas

App de reservas para un único hostal: búsqueda y calendario de disponibilidad,
reserva y pago online con Redsys, panel de administración (habitaciones,
reservas, reseñas) y valoraciones de huéspedes.

**Stack:** Next.js 14 (App Router) + TypeScript, Tailwind CSS, Prisma + PostgreSQL,
NextAuth.js para el panel de administración.

## Importante antes de empezar

Este código se ha escrito en un entorno sin acceso a red, así que no se ha
podido ejecutar `npm install`, compilar el proyecto ni probar pagos reales
contra Redsys. Revísalo y pruébalo a fondo —especialmente el flujo de pago—
antes de usarlo en producción.

## 1. Instalación local

```bash
npm install
cp .env.example .env
# Rellena .env (ver sección "Variables de entorno" abajo)
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Abre http://localhost:3000 para la web pública y http://localhost:3000/admin
para el panel (entra con el ADMIN_EMAIL/ADMIN_PASSWORD que pongas en `.env`).

## 2. Variables de entorno

Están documentadas en `.env.example`. Las más delicadas:

- `DATABASE_URL`: cadena de conexión a PostgreSQL.
- `NEXTAUTH_SECRET`: genera uno con `openssl rand -base64 32`.
- `REDSYS_MERCHANT_CODE`, `REDSYS_TERMINAL`, `REDSYS_CLAVE_SECRETA`: te los da tu banco (ver más abajo).

## 3. Conseguir las credenciales de Redsys

Redsys es la pasarela usada por la mayoría de bancos españoles para el TPV
Virtual. Para aceptar pagos:

1. Pide a tu banco el **"Servicio de TPV Virtual"** (puede tardar varios días en activarse).
2. El banco te dará un **FUC** (código de comercio), un **número de Terminal**
   y una **clave de cifrado en Base64**.
3. Redsys ofrece un **entorno de pruebas** con sus propias claves de test:
   pide a tu banco acceso a él, o consulta el manual "Integración redirección"
   de Redsys, antes de tocar nada en producción.
4. Mientras pruebas, deja `REDSYS_ENTORNO="pruebas"` en `.env`. Cuando todo
   funcione, cambia a `"produccion"` y usa las claves reales.

El código de integración está en `src/lib/redsys.ts` (genera la firma de pago)
y `src/app/api/redsys/notificacion/route.ts` (recibe la confirmación del banco).
Ambos siguen el algoritmo público documentado por Redsys (HMAC_SHA256_V1), pero
no se ha podido verificar contra el entorno real — pruébalo con calma.

## 4. Despliegue recomendado

- **Hosting de la app:** [Vercel](https://vercel.com) — tiene plan gratuito,
  se integra directamente con Next.js y el despliegue es básicamente
  "conectar el repositorio de GitHub y listo".
- **Base de datos:** [Neon](https://neon.tech) o [Supabase](https://supabase.com) —
  PostgreSQL gestionado, con plan gratuito suficiente para empezar.

Pasos generales:
1. Sube este código a un repositorio de GitHub.
2. Crea la base de datos en Neon/Supabase y copia su `DATABASE_URL`.
3. Importa el repositorio en Vercel, añade todas las variables de entorno
   (las mismas de `.env`, con la `NEXT_PUBLIC_BASE_URL` y `NEXTAUTH_URL`
   apuntando ya a tu dominio real) y despliega.
4. Ejecuta las migraciones contra la base de datos de producción:
   `npx prisma migrate deploy` (puedes hacerlo desde tu máquina apuntando
   a la `DATABASE_URL` de producción) y luego `npm run db:seed` una vez.

## 5. Qué falta o se puede mejorar más adelante

- **Imágenes de habitaciones:** de momento se guardan como URLs manuales
  (campo de texto en el admin). Para subir archivos directamente haría falta
  añadir un servicio de almacenamiento (Cloudinary, UploadThing, S3...).
- **Emails automáticos:** no hay envío de email de confirmación. Se podría
  añadir fácilmente con [Resend](https://resend.com) en el webhook de Redsys
  y en el envío de reservas.
- **Concurrencia alta:** la comprobación de disponibilidad no usa bloqueo
  transaccional; con pocas habitaciones y reservas no es un problema, pero
  si el volumen crece convendría añadir una transacción con bloqueo al crear
  la reserva.
- **Precios por temporada:** ahora el precio es fijo por habitación. Añadir
  temporadas o descuentos requeriría extender el modelo `Habitacion`.

## 6. Estructura del proyecto

```
src/app/                 páginas (App Router) y rutas de API
src/components/          componentes de la web pública
src/components/admin/    componentes del panel de administración
src/lib/                 lógica de negocio (disponibilidad, precios, Redsys, auth)
src/lib/actions/         server actions usadas por el panel de administración
prisma/schema.prisma     modelo de datos
```
