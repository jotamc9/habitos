# ADR-0001: Registrar las decisiones de arquitectura con ADR

- **Estado:** Aceptado
- **Fecha:** 2026-10-28

## Contexto

Las decisiones técnicas se toman en conversaciones (con otras personas o con agentes de IA) y su razonamiento se pierde. Meses después nadie recuerda por qué se eligió algo, y se vuelve a debatir o se cambia sin conocer las consecuencias.

## Opciones consideradas

1. **No documentar.** Sin coste inicial, pero el razonamiento se pierde.
2. **Un único documento de arquitectura.** Describe el estado actual, pero no la historia ni las alternativas descartadas.
3. **ADR (Architecture Decision Records):** un documento corto e inmutable por decisión, junto al código.

## Decisión

Se usan ADR en `docs/adr/`, junto con `docs/arquitectura.md` para la visión de conjunto.

## Consecuencias

- Cada decisión importante incluye un ADR en el mismo Pull Request que la introduce.
- Los agentes de IA que trabajan en el repositorio pueden leer los ADR y respetar las decisiones tomadas.
- Requiere disciplina: una decisión sin ADR es una decisión que se puede perder.
