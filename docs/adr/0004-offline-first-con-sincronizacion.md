# ADR-0004: Offline-first con SQLite local y sincronización propia

- **Estado:** Propuesto
- **Fecha:** 2026-10-28

## Contexto

- Todas las funciones de registro deben funcionar sin conexión (RF-28) y marcar un hábito debe ser instantáneo.
- Los recordatorios se calculan en el dispositivo, así que necesitan los datos en local.
- El modelo es pequeño (hábitos, versiones, registros y recordatorios) y cada cuenta tiene un solo usuario, por lo que los conflictos serán raros.

## Opciones consideradas

### Online: la app consulta Supabase directamente, con caché
- ✅ Lo más sencillo de construir.
- ❌ Sin conexión no se puede registrar nada; incumple RF-28.

### Motor de sincronización de terceros (PowerSync, WatermelonDB y similares)
- ✅ Resuelven la sincronización, incluidos casos difíciles.
- ❌ Una dependencia más, con su propio modelo, servicio y, en algunos casos, coste.
- ❌ Excesivo para cuatro tablas y un usuario por cuenta.

### SQLite local como fuente de verdad y sincronización propia
- ✅ La interfaz solo habla con la base local: respuesta inmediata y funcionamiento sin conexión.
- ✅ La sincronización es sencilla con este modelo: push de cambios locales y pull de cambios remotos por `actualizado_en`.
- ✅ Sin dependencias ni costes extra, y buen ejercicio de aprendizaje.
- ❌ Es código propio que hay que probar bien (borrados, reintentos, primera sincronización).

## Decisión

Se propone **SQLite (`expo-sqlite`) como fuente de verdad en el dispositivo y una sincronización propia con Supabase**:

- Identificadores UUID generados en el dispositivo, para crear datos sin conexión.
- `actualizado_en` asignado por el servidor, para no depender del reloj del dispositivo.
- Borrado lógico (`borrado = true`) para propagar eliminaciones.
- Resolución de conflictos: gana la última escritura.

## Consecuencias

- El esquema existe dos veces (SQLite y Postgres) y debe mantenerse alineado; las migraciones de ambos van en el mismo Pull Request.
- Si dos dispositivos suman cantidades al mismo hábito el mismo día sin conexión, puede perderse una de las sumas. Se acepta con un solo usuario por cuenta.
- Si en el futuro la sincronización se complica (por ejemplo, datos compartidos entre usuarios), se reevaluará un motor de terceros.
