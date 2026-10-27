# ADR-0006: Configuración de hábitos con fecha de vigencia

- **Estado:** Aceptado
- **Fecha:** 2026-10-28

## Contexto

- Los cambios en un hábito (días programados, meta, unidad, incremento) se aplican solo desde el día actual (RF-09).
- Los días pasados se pueden consultar y editar sin límite (RF-19) y deben mostrar los hábitos que tocaban entonces, con la meta de entonces.
- Las estadísticas futuras necesitarán saber qué tocaba cada día para calcular cumplimientos.

## Opciones consideradas

### Configuración única y sobrescrita
- ✅ Lo más simple.
- ❌ Cambiar los días o la meta reescribe el pasado: un lunes antiguo dejaría de mostrar un hábito que sí tocaba. Incumple RF-09.

### Copiar la configuración en cada registro
- ✅ Cada registro sabe qué meta tenía.
- ❌ Los días sin registro no saben si el hábito tocaba o no; tampoco sirve para mostrar los pendientes de un día pasado.

### Versiones de configuración con fecha de vigencia
- ✅ Para cualquier día se obtiene la configuración vigente: la versión con mayor `vigente_desde` que no sea posterior a ese día.
- ✅ Representa fielmente la historia y sirve para las estadísticas.
- ❌ Las consultas son algo más complejas.

## Decisión

Se separa el hábito (identidad, nombre, tipo, fechas de creación y archivo) de sus **versiones de configuración** (días, meta, unidad, incremento), cada una con su fecha `vigente_desde`.

- Al crear un hábito se crea su primera versión, vigente desde el día de creación.
- Al editar la configuración se crea una versión nueva, vigente desde hoy. Si ya existe una versión de hoy, se actualiza en lugar de crear otra.
- El nombre no se versiona: renombrar un hábito cambia cómo aparece en todo el historial.

## Consecuencias

- La lógica de "qué hábitos tocan el día D" vive en el dominio como función pura y se cubre con tests.
- Las versiones solo crecen al editar la configuración, así que el volumen es mínimo.
