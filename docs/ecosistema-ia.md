# Ecosistema de desarrollo con IA

Cómo está configurado Claude Code en este repositorio: qué piezas hay, para qué sirve cada una y cuándo se añade una nueva.

## Principio: crecer a partir de la fricción

Las piezas se añaden cuando resuelven un problema real, no por adelantado:

- **Regla de tres:** la primera vez algo se hace a mano; la segunda, se observa; la tercera, se automatiza.
- **Lo determinista va en hooks.** Si una regla debe cumplirse siempre, no se confía en que el modelo la recuerde: se impone con un hook.
- **Cada pieza nueva entra por Pull Request** y se registra en este documento.

## Tipos de pieza

| Pieza | Qué es | Cuándo usarla |
|-------|--------|---------------|
| `CLAUDE.md` | Instrucciones que Claude carga en cada sesión | Contexto y reglas del proyecto |
| Permisos (`.claude/settings.json`) | Qué puede hacer Claude sin preguntar, qué debe preguntar y qué tiene prohibido | Reducir confirmaciones en lo seguro y forzarlas en lo delicado |
| Hooks (`.claude/settings.json` y `.claude/hooks/`) | Scripts que se ejecutan automáticamente en ciertos eventos | Reglas que deben cumplirse siempre |
| Skills (`.claude/skills/`) | Flujos de trabajo empaquetados que se invocan con `/nombre` | Procesos repetitivos con pasos fijos |
| Subagentes (`.claude/agents/`) | Agentes especializados con su propio contexto e instrucciones | Tareas acotadas que se benefician de un enfoque dedicado (revisión, tests) |
| Servidores MCP (`.mcp.json`) | Conexiones a sistemas externos | Cuando un sistema externo no es accesible bien desde la terminal |

## Piezas actuales

### `CLAUDE.md`

Contexto del proyecto, reglas de arquitectura y de git. Ver [CLAUDE.md](../CLAUDE.md).

### Permisos

Definidos en [.claude/settings.json](../.claude/settings.json):

- **Permitido sin preguntar:** comandos de git de consulta y de trabajo local (`status`, `log`, `diff`, `switch`, `add`, `commit`…) y consultas de `gh` (`pr view`, `pr list`…).
- **Siempre pregunta:** todo lo que sale del equipo o es difícil de deshacer (`git push`, `gh pr create`, `gh pr merge`, `git reset --hard`, `git clean`).
- **Prohibido:** leer ficheros `.env`, que contendrán secretos.

En el mismo fichero, `attribution.commit` vacío hace que los commits no lleven la línea `Co-Authored-By` de Claude. Los PR sí indican que se han generado con Claude Code.

Cada persona puede añadir sus propias preferencias en `.claude/settings.local.json`, que no se versiona.

### Hook `proteger-main`

[.claude/hooks/proteger-main.mjs](../.claude/hooks/proteger-main.mjs), en el evento `PreToolUse` de las herramientas Bash y PowerShell.

- Bloquea `git commit` cuando la rama actual es `main`.
- Bloquea `git push` hacia `main`, ya sea explícito (`git push origin main`, `HEAD:main`) o implícito (push sin rama estando en `main`).
- Al bloquear, explica a Claude el motivo y le indica que cree una rama.

Complementa la protección de `main` en GitHub: el servidor lo impediría igualmente, pero el hook lo detecta antes.

**Limitaciones conocidas:** comprueba la rama del directorio de trabajo de la sesión, así que no detecta un `cd otro-repo && git commit`. Si Node no está disponible, el hook falla sin bloquear.

**Requisito:** Node.js en el `PATH`.

### Skill `/pr`

[.claude/skills/pr/](../.claude/skills/pr/SKILL.md). Sube la rama actual y abre un Pull Request hacia `main` con título en Conventional Commits y la plantilla rellenada.

- El script [contexto.mjs](../.claude/skills/pr/contexto.mjs) comprueba el estado de forma determinista: rama válida, cambios sin commit, commits nuevos, si va por detrás de `main`, si ya hay un PR y dónde está `gh`. Si encuentra un bloqueo, la skill se detiene.
- Nunca hace merge.
- Se invoca con `/pr` (con notas opcionales) o al pedir "abre el PR".

### Skill `/adr`

[.claude/skills/adr/](../.claude/skills/adr/SKILL.md). Crea un ADR en `docs/adr/` en estado `Propuesto`, actualiza el índice y, si sustituye a otro, marca el antiguo.

- El script [siguiente.mjs](../.claude/skills/adr/siguiente.mjs) calcula el siguiente número, el nombre del fichero (sin tildes) y la fecha.
- Se invoca con `/adr <título>` o cuando se toma una decisión técnica importante.

## Piezas previstas

| Pieza | Cuándo |
|-------|--------|
| MCP de Supabase (limitado a un proyecto, solo lectura en producción) | Al crear el proyecto de Supabase |
| Hooks de formato y lint tras cada edición | Al crear el proyecto Expo |
| Comandos de desarrollo en `CLAUDE.md` | Al crear el proyecto Expo |
| Subagente revisor (contra la especificación y los ADR) | Tras las primeras funcionalidades |
| Subagente de tests | Cuando exista la capa de dominio |
| CI con GitHub Actions y checks obligatorios en `main` | Cuando haya tests |

## Descartadas

| Pieza | Motivo |
|-------|--------|
| MCP oficial de Expo | Requiere un plan de pago de EAS y sus funciones locales solo funcionan con el simulador en macOS |
| MCP de GitHub | `gh` cubre todo lo necesario desde la terminal |
| Sistema multiagente (orquestador, planificador…) | Sobredimensionado para un desarrollador y una app de este tamaño |
