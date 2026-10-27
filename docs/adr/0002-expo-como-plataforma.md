# ADR-0002: Expo (React Native + TypeScript) como plataforma

- **Estado:** Aceptado
- **Fecha:** 2026-10-28

## Contexto

- La aplicación se usará casi siempre en iPhone, tanto el autor como, en el futuro, sus amigos. Android es prescindible.
- La funcionalidad central son los recordatorios: deben llegar a su hora, sin conexión, y permitir actuar desde la propia notificación (botones "Hecho" y "Posponer").
- El desarrollo se hace en **Windows, sin Mac**. Compilar para iOS requiere Xcode, que solo existe en macOS.
- Se dispone de cuenta de Apple Developer Program.

## Opciones consideradas

### PWA (aplicación web instalable)
- ✅ Una base de código y desarrollo sencillo en Windows.
- ❌ En iOS no hay notificaciones locales programadas: cada aviso tendría que enviarlo un servidor.
- ❌ Las notificaciones web en iOS no admiten botones de acción.
- ❌ Sin widgets y con un soporte de Apple históricamente poco fiable.
- **Descartada:** falla justo en la funcionalidad central.

### Swift / SwiftUI nativo
- ✅ La mejor integración con iOS (widgets, Apple Watch, Siri) y la mejor experiencia de desarrollo para iOS.
- ❌ Requiere un Mac para el simulador, las previews, la instalación en el dispositivo y la publicación. Las alternativas sin Mac (Mac en la nube, CI) hacen el desarrollo diario lento o "a ciegas".
- **Descartada** mientras no haya Mac.

### Flutter
- ✅ Buen rendimiento y una base de código para iOS y Android.
- ❌ Desde Windows no se puede ejecutar en un iPhone en modo desarrollo: cada prueba en el dispositivo exige compilar en la nube.
- ❌ Dibuja su propia interfaz e imita el estilo de iOS, así que no hereda automáticamente los cambios de diseño del sistema.
- ❌ Dart se usa poco fuera de Flutter.
- **Descartada.**

### Expo (React Native + TypeScript)
- ✅ Interfaz con componentes nativos de iOS.
- ✅ Notificaciones locales con botones de acción, Sign in with Apple y Google.
- ✅ Desde Windows: un development build instalado en el iPhone recarga los cambios por wifi al instante.
- ✅ EAS Build compila iOS en Macs de Expo en la nube y gestiona certificados; EAS Submit publica en TestFlight y la App Store.
- ✅ TypeScript y React son útiles más allá de este proyecto.
- ❌ Las extensiones de iOS (widgets, Apple Watch) requieren escribir código Swift, que solo se puede probar compilando en la nube.
- ❌ Dependencia de los servicios de Expo para compilar iOS.

## Decisión

Se usa **Expo con TypeScript en modo estricto**, compilando con EAS Build y probando en el iPhone mediante development builds.

## Consecuencias

- No hace falta Mac. El coste es el Apple Developer Program; el plan gratuito de EAS cubre las compilaciones previstas.
- Las compilaciones de iOS tardan del orden de 10-20 minutos y solo son necesarias al cambiar dependencias nativas o publicar.
- Si se incorporan widgets o Apple Watch, habrá que reevaluar el uso de un Mac (propio o alquilado).
- La app podría funcionar en Android con poco esfuerzo, aunque no es un objetivo.
