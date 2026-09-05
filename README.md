# Recomposición 90

Aplicación multiplataforma de entrenamiento, nutrición y seguimiento de progreso.

## Plataformas

- Web / PWA (instalable en Android, iOS, y cualquier sistema operativo con navegador moderno)
- Android (APK/AAB)
- iOS (Capacitor + Xcode)

## Instalar la app en el celular (recomendado, funciona en cualquier SO)

La forma más simple y universal de "instalar" la app es como **PWA (Progressive Web App)**:
se ve y se comporta como una app nativa (ícono en pantalla de inicio, pantalla completa,
funciona offline) sin pasar por Play Store ni App Store, y funciona igual en Android, iOS,
o cualquier otro sistema operativo con un navegador moderno.

1. Activa GitHub Pages en este repositorio: **Settings > Pages > Source: GitHub Actions**.
2. Haz push a `main` (o ejecuta manualmente `Actions > Deploy PWA to GitHub Pages`).
3. Abre la URL publicada (`https://<usuario>.github.io/<repositorio>/`) desde el celular:
   - **Android (Chrome)**: menú ⋮ > "Instalar app" o "Añadir a pantalla de inicio".
   - **iOS (Safari)**: botón Compartir > "Añadir a pantalla de inicio".
   - **Otros navegadores/SO**: opción equivalente "Instalar" o "Añadir a inicio".

Una vez instalada, la app abre en pantalla completa con su propio ícono, igual que una
app nativa, y sigue funcionando sin conexión gracias al Service Worker (`public/sw.js`).

Si además quieres un `.apk`/`.aab` (Android) o `.ipa` (iOS) instalables como paquete nativo,
usa los workflows de Capacitor descritos más abajo.

## Requisitos de desarrollo

- Node.js 22+
- npm
- Android Studio + Android SDK para Android
- macOS + Xcode para compilar iOS localmente

## Desarrollo web

```bash
npm install
npm run dev
```

## Android

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## iOS

La compilación iOS requiere macOS y Xcode.

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

En Xcode selecciona un iPhone o un simulador y pulsa **Run**.

## GitHub Actions

### Web / PWA

`Actions > Deploy PWA to GitHub Pages`

Compila la web y la publica en GitHub Pages para que quede instalable desde cualquier
celular vía navegador (ver sección de instalación más arriba). Se ejecuta automáticamente
en cada push a `main`.

### Android

`Actions > Build Android APK and AAB`

Genera automáticamente:

- APK Debug para pruebas
- AAB Release sin firma

### iOS

`Actions > Build iOS App`

Genera un `.zip` con la aplicación `.app` para **iOS Simulator**. No requiere certificados Apple.

Para generar una IPA instalable en un iPhone o subirla a App Store Connect se requiere firma de Apple. Usa el workflow manual:

`Actions > Build iOS Release (manual signing)`

Este workflow requiere estos GitHub Secrets:

- `IOS_CERTIFICATE_BASE64`: certificado de distribución `.p12` codificado en Base64.
- `IOS_CERTIFICATE_PASSWORD`: contraseña del `.p12`.
- `IOS_PROVISIONING_PROFILE_BASE64`: perfil `.mobileprovision` en Base64.
- `IOS_TEAM_ID`: Team ID de Apple Developer.
- `IOS_EXPORT_OPTIONS_PLIST_BASE64`: `ExportOptions.plist` codificado en Base64.

**Nunca** subas certificados, claves privadas, provisioning profiles o contraseñas directamente al repositorio.

## Identificador de la app

```text
com.recomposicion90.app
```

Debe coincidir con el Bundle Identifier registrado en Apple Developer cuando prepares la publicación.

### GitHub Actions y dependencias

Los workflows de Android e iOS no usan `cache: npm`, por lo que no requieren que exista previamente un `package-lock.json`. Las dependencias se instalan con `npm install --no-audit --no-fund`. Esto evita el error `Dependencies lock file is not found` en runners limpios de GitHub Actions.
