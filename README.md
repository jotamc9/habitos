# Hábitos

Aplicación móvil para registrar los hábitos de cada día, centrada en los recordatorios.

Proyecto de aprendizaje: se desarrolla con Claude Code e irá incorporando agentes, skills y servidores MCP solo cuando aporten valor real.

## Estado

Fase 2: arquitectura. Todavía no hay código.

## Documentación

- [Especificación funcional](docs/especificacion-funcional.md): qué hace la aplicación.
- [Arquitectura](docs/arquitectura.md): cómo se construye.
- [Decisiones de arquitectura (ADR)](docs/adr/): por qué se construye así.
- [Ecosistema de IA](docs/ecosistema-ia.md): cómo está configurado Claude Code para trabajar en el proyecto.

## Cómo se trabaja

- `main` contiene el código en producción; los cambios entran solo mediante Pull Request.
- Ramas `<tipo>/<descripcion>` y commits con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat: …`, `fix: …`).

La metodología completa está en [CONTRIBUTING.md](CONTRIBUTING.md).
