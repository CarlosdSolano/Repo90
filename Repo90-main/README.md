# Recomposición 90

Aplicación multiplataforma de entrenamiento, nutrición y seguimiento de progreso.

## Plataformas

- Web / PWA
- Android (APK/AAB)
- iOS (Capacitor + Xcode)

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
