# CLAUDE.md

Instrucciones para Claude Code en este repositorio.

## Proyecto

Aplicación móvil para registrar hábitos diarios, centrada en los recordatorios. Proyecto personal desarrollado con prácticas profesionales. La especificación funcional está en `docs/especificacion-funcional.md`.

## Arquitectura

- La arquitectura está en `docs/arquitectura.md` y las decisiones en `docs/adr/`. Respeta los ADR aceptados; si un cambio contradice uno, avisa al usuario antes de seguir.
- Toda decisión técnica importante nueva lleva su ADR en el mismo Pull Request.
- `docs/especificacion-funcional.md` no menciona tecnologías: lo técnico va en la documentación de arquitectura.

## Git

Sigue la metodología de `CONTRIBUTING.md`. En resumen:

- Nunca hagas commit ni push directamente en `main`. Crea una rama `<tipo>/<descripcion>` desde `main` actualizada.
- Mensajes de commit con Conventional Commits, en español e imperativo: `feat: añade …`, `fix: corrige …`.
- Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `style`, `chore`, `ci`.
- Los cambios llegan a `main` solo mediante Pull Request con squash merge. El título del PR sigue el mismo formato que los commits.
- No hagas push, no abras PR y no hagas merge sin que el usuario lo pida.
