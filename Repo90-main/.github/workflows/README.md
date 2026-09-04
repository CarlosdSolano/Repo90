# GitHub Actions

- `build-web.yml`: compila la PWA/Web y guarda `dist/` como artifact.
- `build-android.yml`: compila APK debug y AAB release sin firma.

Los workflows no guardan credenciales ni keystores en el repositorio.
