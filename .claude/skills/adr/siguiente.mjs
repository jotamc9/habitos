#!/usr/bin/env node
// Calcula el número y el nombre de fichero del siguiente ADR.
// Uso: node .claude/skills/adr/siguiente.mjs "Título de la decisión"
// Imprime: número, ruta del fichero y fecha de hoy.

import { readdirSync } from "node:fs";

const DIRECTORIO = "docs/adr";

const titulo = process.argv.slice(2).join(" ").trim();
if (!titulo) {
  console.error('Falta el título. Uso: node .claude/skills/adr/siguiente.mjs "Título de la decisión"');
  process.exit(1);
}

const numeros = readdirSync(DIRECTORIO)
  .map((f) => /^(\d{4})-.+\.md$/.exec(f)?.[1])
  .filter(Boolean)
  .map(Number);
const numero = String((numeros.length ? Math.max(...numeros) : 0) + 1).padStart(4, "0");

const slug = titulo
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const hoy = new Date();
const fecha = [hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate()]
  .map((n, i) => String(n).padStart(i === 0 ? 4 : 2, "0"))
  .join("-");

console.log(`Número: ${numero}`);
console.log(`Fichero: ${DIRECTORIO}/${numero}-${slug}.md`);
console.log(`Fecha: ${fecha}`);
