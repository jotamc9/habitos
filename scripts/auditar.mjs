#!/usr/bin/env node
// Auditoría de dependencias: ejecuta `npm audit` y compara sus avisos con los aceptados
// en scripts/auditoria-aceptada.json. npm no permite ignorar avisos concretos; esto sí,
// pero dejando por escrito el motivo y una fecha de revisión.
//
// Falla (salida 1) si:
// - aparece un aviso que no está aceptado,
// - un aviso aceptado ya no aparece (hay que quitarlo de la lista),
// - se ha pasado la fecha de revisión de un aviso aceptado.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ficheroAceptados = path.join(raiz, "scripts", "auditoria-aceptada.json");

function ejecutarAudit() {
  // Con `npm run`, npm_execpath apunta a npm-cli.js: se evita el npm.cmd de Windows.
  const npm = process.env.npm_execpath;
  const resultado = npm
    ? spawnSync(process.execPath, [npm, "audit", "--json"], {
        cwd: raiz,
        encoding: "utf8",
      })
    : spawnSync("npm audit --json", {
        cwd: raiz,
        encoding: "utf8",
        shell: true,
      });
  try {
    return JSON.parse(resultado.stdout);
  } catch {
    console.error("No se ha podido ejecutar npm audit (¿hay conexión?).");
    console.error(resultado.stderr);
    process.exit(1);
  }
}

// Agrupa los avisos por identificador GHSA, con los paquetes que afectan.
function avisosActuales(informe) {
  if (informe.error) {
    console.error(
      `npm audit ha fallado: ${informe.error.summary ?? JSON.stringify(informe.error)}`,
    );
    process.exit(1);
  }
  const avisos = new Map();
  for (const vulnerabilidad of Object.values(informe.vulnerabilities ?? {})) {
    for (const origen of vulnerabilidad.via) {
      if (typeof origen === "string") continue;
      const id = origen.url.split("/").pop();
      const aviso = avisos.get(id) ?? {
        id,
        paquete: origen.name,
        gravedad: origen.severity,
        titulo: origen.title,
        url: origen.url,
      };
      avisos.set(id, aviso);
    }
  }
  return avisos;
}

const aceptados = new Map(
  JSON.parse(readFileSync(ficheroAceptados, "utf8")).avisos.map((a) => [
    a.id,
    a,
  ]),
);
const actuales = avisosActuales(ejecutarAudit());
const hoy = new Date().toISOString().slice(0, 10);

const nuevos = [...actuales.values()].filter((a) => !aceptados.has(a.id));
const obsoletos = [...aceptados.values()].filter((a) => !actuales.has(a.id));
const caducados = [...aceptados.values()].filter(
  (a) => actuales.has(a.id) && a.revisar < hoy,
);
const vigentes = [...aceptados.values()].filter(
  (a) => actuales.has(a.id) && a.revisar >= hoy,
);

for (const a of vigentes) {
  console.log(
    `Aceptado: ${a.id} (${a.paquete}, ${a.gravedad}), revisar el ${a.revisar}.`,
  );
}
for (const a of nuevos) {
  console.error(
    `NUEVO: ${a.id} en ${a.paquete} (${a.gravedad}): ${a.titulo}\n  ${a.url}`,
  );
}
for (const a of obsoletos) {
  console.error(
    `YA NO APARECE: ${a.id} (${a.paquete}). Quítalo de la lista de aceptados.`,
  );
}
for (const a of caducados) {
  console.error(
    `REVISIÓN PENDIENTE: ${a.id} (${a.paquete}) tenía que revisarse el ${a.revisar}.`,
  );
}

if (nuevos.length || obsoletos.length || caducados.length) {
  console.error(
    `\nLa auditoría falla. Los avisos aceptados están en scripts/auditoria-aceptada.json.`,
  );
  process.exit(1);
}
console.log(
  `\nAuditoría correcta: ${vigentes.length} aviso(s) aceptado(s), ninguno nuevo.`,
);
