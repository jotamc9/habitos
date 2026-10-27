# CLAUDE.md

Instrucciones para Claude Code en este repositorio.

## Proyecto

Aplicación móvil para registrar hábitos diarios, centrada en los recordatorios. Proyecto personal desarrollado con prácticas profesionales. La especificación funcional está en `docs/especificacion-funcional.md`.

## Git

Sigue la metodología de `CONTRIBUTING.md`. En resumen:

- Nunca hagas commit ni push directamente en `main`. Crea una rama `<tipo>/<descripcion>` desde `main` actualizada.
- Mensajes de commit con Conventional Commits, en español e imperativo: `feat: añade …`, `fix: corrige …`.
- Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `style`, `chore`, `ci`.
- Los cambios llegan a `main` solo mediante Pull Request con squash merge. El título del PR sigue el mismo formato que los commits.
- No hagas push, no abras PR y no hagas merge sin que el usuario lo pida.
