# ADR-0005: Recordatorios locales en ventana deslizante

- **Estado:** Propuesto
- **Fecha:** 2026-10-28

## Contexto

- Los recordatorios deben llegar sin conexión (RF-27), permitir acciones desde la notificación (RF-25) y no enviarse si el hábito ya está cumplido ese día (RF-24).
- iOS mantiene como máximo **64 notificaciones locales pendientes por app** y descarta el resto.
- Con notificaciones repetitivas semanales (una por hábito, día y hora), 10 hábitos diarios con un recordatorio ya suman 70 y superan el límite.

## Opciones consideradas

### Notificaciones push desde un servidor
- ✅ Sin el límite de 64.
- ❌ Necesitan conexión y un servidor que programe y envíe cada aviso; incumple RF-27 y añade infraestructura.

### Notificaciones locales repetitivas (semanales)
- ✅ Se programan una vez y se repiten solas.
- ❌ No se pueden cancelar para un día concreto: al cancelarlas se pierden todas las semanas. Incumple RF-24.
- ❌ Alcanzan el límite de 64 con pocos hábitos.

### Notificaciones locales con fecha concreta, en ventana deslizante
- ✅ Cada aviso es para un día y hora concretos, así que se puede cancelar individualmente cuando el hábito se cumple.
- ✅ Se programan solo los próximos avisos, hasta un máximo de 60, dejando margen para las notificaciones pospuestas.
- ❌ Hay que recalcular la ventana a menudo; si la app no se abre en muchos días, los avisos se agotan.

## Decisión

Se propone **programar notificaciones locales con fecha concreta en una ventana deslizante** de como máximo 60 avisos, ordenados por cercanía.

La ventana se recalcula:
- Al abrir la app y al volver a primer plano.
- Tras cualquier cambio en hábitos, recordatorios o registros.
- Tras una sincronización que traiga cambios.
- Periódicamente con una tarea en segundo plano (cuando iOS la ejecute).

El cálculo de qué avisos tocan es una función pura del dominio, cubierta por tests.

## Consecuencias

- Con un uso diario de la app, la ventana se mantiene siempre llena.
- iOS decide cuándo ejecutar las tareas en segundo plano, así que no son garantía; si el usuario no abre la app en mucho tiempo, puede dejar de recibir avisos. Se acepta.
- Los botones de las notificaciones se registran como categorías al arrancar la app. Sus identificadores no pueden contener `:` ni `-`.
- Esta parte debe probarse pronto en un iPhone real: el simulador no reproduce fielmente las notificaciones.
