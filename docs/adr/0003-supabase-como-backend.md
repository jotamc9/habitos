# ADR-0003: Supabase como backend y autenticación

- **Estado:** Propuesto
- **Fecha:** 2026-10-28

## Contexto

- Se necesita inicio de sesión con Apple y Google (RF-01), copia de los datos en la nube y acceso desde otro dispositivo (RF-05).
- En el futuro habrá varios usuarios, cada uno con acceso solo a sus datos.
- Se quiere evitar mantener servidores propios y mantener el coste en cero.

## Opciones consideradas

### Backend propio (por ejemplo, una API en Node.js con Postgres)
- ✅ Control total y buen ejercicio de aprendizaje.
- ❌ Hay que programar y mantener la autenticación, el alojamiento, las copias de seguridad y la seguridad. Mucho trabajo que no aporta a la funcionalidad.

### Firebase (Firestore + Firebase Auth)
- ✅ Muy maduro, con soporte offline integrado en Firestore.
- ❌ Base de datos de documentos (NoSQL): las consultas por fechas y versiones del modelo encajan peor.
- ❌ Más ligado a un único proveedor y difícil de migrar.

### Supabase (Postgres + Auth)
- ✅ Postgres estándar: SQL, migraciones versionadas en el repositorio y fácil de migrar si hace falta.
- ✅ Autenticación con Apple y Google, usando los tokens del inicio de sesión nativo.
- ✅ Row Level Security: el aislamiento entre usuarios se define en la base de datos.
- ✅ Plan gratuito suficiente (del orden de 500 MB de base de datos y 50.000 usuarios activos al mes).
- ❌ Sin sincronización offline integrada: hay que construirla (ver [ADR-0004](0004-offline-first-con-sincronizacion.md)).
- ❌ El plan gratuito pausa el proyecto tras 7 días sin peticiones.

## Decisión

Se propone **Supabase**: Postgres para los datos y Supabase Auth con Sign in with Apple y Google nativos (el token obtenido en el dispositivo se envía a Supabase con `signInWithIdToken`).

## Consecuencias

- El esquema y las políticas de seguridad se versionan en `supabase/` como migraciones SQL.
- Habrá dos proyectos: desarrollo y producción.
- Con el uso diario la pausa por inactividad no debería producirse; si ocurre, se reactiva desde el panel sin pérdida de datos.
- Los límites del plan gratuito se revisarán en la [página de precios de Supabase](https://supabase.com/pricing) antes de abrir la app a más usuarios.
