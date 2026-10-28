// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier/flat");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ["dist/*", "coverage/*", ".expo/*"],
  },
  {
    // Regla de dependencias de docs/arquitectura.md: el dominio son reglas puras
    // y no depende de React, de Expo ni del resto de capas.
    files: ["src/domain/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react",
                "react-*",
                "react/*",
                "expo",
                "expo-*",
                "@expo/*",
              ],
              message:
                "El dominio son reglas puras: no puede depender de React ni de Expo.",
            },
            {
              group: [
                "**/app/**",
                "**/data/**",
                "**/sync/**",
                "**/notifications/**",
                "**/auth/**",
                "**/ui/**",
              ],
              message:
                "El dominio no depende de otras capas: solo puede importar de src/domain.",
            },
          ],
        },
      ],
    },
  },
]);
