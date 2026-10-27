# Especificación funcional

Qué hace la aplicación y cómo se comporta, desde el punto de vista de quien la usa. Este documento no trata de tecnologías ni de cómo se construye; eso se describe en la documentación de arquitectura.

## 1. Visión

Una aplicación móvil para registrar cada día qué hábitos se han cumplido.

El problema que resuelve no es la falta de motivación, sino el **olvido**: con el ajetreo diario se pasan cosas que uno quiere hacer. Apuntar lo que se hace genera conciencia, y los recordatorios evitan que se olvide.

### Principios

1. **Minimalismo.** Solo lo imprescindible. Cada funcionalidad nueva debe justificar su presencia.
2. **Usabilidad directa.** Las acciones frecuentes (marcar un hábito, atender un recordatorio) se hacen con un solo toque.
3. **El recordatorio es el centro.** Si la aplicación no recuerda bien, no cumple su objetivo.
4. **El registro es fiable.** Lo que se apunta no se pierde y está disponible siempre, también sin conexión.

### Usuarios

- **Fase inicial:** uso personal, una sola persona.
- **Futuro:** amigos con su propia cuenta. Cada usuario ve únicamente sus hábitos; no hay funciones sociales.

## 2. Glosario

| Término | Significado |
|---------|-------------|
| **Hábito** | Algo que el usuario quiere hacer de forma periódica (por ejemplo, "Meditar" o "Beber agua"). |
| **Hábito booleano** | Se cumple o no se cumple (por ejemplo, "Meditar"). |
| **Hábito cuantitativo** | Tiene una meta numérica con unidad (por ejemplo, "Beber agua: 2 L"). |
| **Meta** | Cantidad que hay que alcanzar en un día para cumplir un hábito cuantitativo. |
| **Incremento** | Cantidad que se suma con cada toque en un hábito cuantitativo (por ejemplo, 250 ml). |
| **Días programados** | Días de la semana en los que toca un hábito. |
| **Registro** | Lo que se ha apuntado de un hábito en un día concreto: cumplido o no, o la cantidad acumulada. |
| **Día** | Periodo de 00:00 a 23:59 en la hora local del dispositivo. |
| **Recordatorio** | Aviso a una hora concreta para que el usuario no olvide un hábito. |
| **Posponer** | Aplazar un recordatorio para recibirlo de nuevo más tarde. |
| **Archivar** | Retirar un hábito de uso sin borrar su historial. |

## 3. Funcionalidades del MVP

### 3.1 Cuenta de usuario

- **RF-01.** El usuario inicia sesión con su cuenta de Apple o de Google. No hay registro con email y contraseña.
- **RF-02.** La sesión se mantiene abierta hasta que el usuario la cierra.
- **RF-03.** El usuario puede cerrar sesión.
- **RF-04.** El usuario puede eliminar su cuenta. Esto borra de forma permanente todos sus datos, tras una confirmación explícita.
- **RF-05.** Si el usuario inicia sesión en otro dispositivo, encuentra todos sus hábitos e historial.

### 3.2 Gestión de hábitos

- **RF-06.** El usuario puede crear un hábito con estos datos:

  | Dato | Obligatorio | Notas |
  |------|-------------|-------|
  | Nombre | Sí | Texto corto. |
  | Tipo | Sí | Booleano o cuantitativo. No se puede cambiar después de crearlo. |
  | Meta | Solo cuantitativo | Número mayor que 0. |
  | Unidad | Solo cuantitativo | Texto libre corto: "L", "páginas", "min"… |
  | Incremento | Solo cuantitativo | Número mayor que 0. Por defecto, 1. |
  | Días programados | Sí | Al menos un día. Por defecto, todos. |
  | Recordatorios | No | Cero o más horas del día (ver 3.5). |

- **RF-07.** El usuario puede ver el listado de todos sus hábitos activos.
- **RF-08.** El usuario puede editar cualquier dato de un hábito salvo el tipo.
- **RF-09.** Los cambios en un hábito (meta, días programados…) se aplican desde el día actual en adelante. Los días pasados conservan lo que se registró.
- **RF-10.** El usuario puede archivar un hábito: deja de aparecer en los días siguientes y deja de recordarse, pero su historial se conserva y sigue visible en los días pasados.
- **RF-11.** El usuario puede eliminar un hábito de forma permanente, junto con todo su historial, tras una confirmación explícita.

### 3.3 Vista de un día

Es la pantalla principal de la aplicación.

- **RF-12.** Al abrir la aplicación se muestra el **día actual**, con la lista de hábitos programados para ese día de la semana.
- **RF-13.** Cada hábito de la lista muestra su nombre y su estado:
  - Booleano: cumplido o pendiente.
  - Cuantitativo: cantidad acumulada y meta (por ejemplo, "1,25 / 2 L").
- **RF-14.** Un hábito booleano se marca y desmarca con un toque.
- **RF-15.** Un hábito cuantitativo suma su incremento con un toque. También se puede restar el incremento o escribir la cantidad exacta.
- **RF-16.** Un hábito cuantitativo cuenta como cumplido cuando la cantidad acumulada alcanza la meta. Se puede superar la meta.
- **RF-17.** Un hábito aparece en los días programados a partir de la fecha en que se creó, nunca en días anteriores.

### 3.4 Navegación entre días

- **RF-18.** El usuario puede cambiar de día de dos formas: pasando al día anterior o siguiente, o eligiendo cualquier fecha en un calendario.
- **RF-19.** Los **días pasados** se pueden consultar y editar sin límite de antigüedad, con las mismas acciones que el día actual.
- **RF-20.** Los **días futuros** se pueden consultar (qué hábitos tocarán), pero no se pueden marcar.
- **RF-21.** Siempre hay una forma directa de volver al día actual.

### 3.5 Recordatorios

- **RF-22.** Cada hábito puede tener cero, una o varias horas de recordatorio.
- **RF-23.** Un recordatorio solo se envía los días programados del hábito.
- **RF-24.** Si el hábito ya está cumplido ese día, sus recordatorios pendientes de ese día no se envían.
- **RF-25.** Desde el propio recordatorio, sin abrir la aplicación, el usuario puede:
  - **Booleano:** marcarlo como cumplido.
  - **Cuantitativo:** sumar el incremento.
  - **Ambos:** posponerlo.
- **RF-26.** Al tocar el recordatorio (fuera de sus botones), se abre la aplicación en el día actual.
- **RF-27.** Los recordatorios funcionan sin conexión.

### 3.6 Disponibilidad y datos

- **RF-28.** Todas las funciones de registro (marcar, sumar, consultar días) funcionan sin conexión. Los cambios se sincronizan con la cuenta cuando vuelve la conexión.
- **RF-29.** Se conserva el historial completo de registros desde el primer día, aunque en el MVP no se muestren estadísticas.

## 4. Fuera del alcance del MVP

Funcionalidades descartadas por ahora, en orden aproximado de interés:

1. Estadísticas: rachas, porcentaje de cumplimiento, calendario de actividad.
2. Widget en la pantalla de inicio para marcar hábitos.
3. Más tipos de frecuencia (por ejemplo, "3 veces por semana").
4. Más tipos de hábito.
5. Reordenar manualmente los hábitos.
6. Automatizaciones (registrar hábitos sin intervención del usuario).
7. Compartir o comparar hábitos con amigos.
8. Reloj inteligente.

## 5. Preguntas abiertas

Puntos a decidir antes de implementar la parte correspondiente:

- **Posponer:** ¿cuánto tiempo? ¿Fijo (por ejemplo, 1 hora) o a elegir entre varias opciones? ¿Configurable por hábito?
- **Recordatorios cuantitativos:** si a la hora del recordatorio se ha avanzado pero no se ha llegado a la meta, ¿se envía igualmente? ¿Debe indicar lo que falta?
- **Resumen del día:** ¿un aviso al final del día con los hábitos pendientes?
- **Orden de la lista del día:** ¿por hora del primer recordatorio, alfabético o por fecha de creación?
- **Hábitos cumplidos en la lista:** ¿se quedan en su sitio o bajan al final?
