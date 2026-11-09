# Guía de instalación, GitHub y despliegue

## Parte A. Preparación local (Windows + VS Code)

1. Instala **Node.js 22 LTS** y **Git** si todavía no los tienes.
2. Extrae el ZIP y abre la carpeta `practica3-cicd-itla` con Visual Studio Code.
3. En **Terminal → New Terminal**, ejecuta:

```powershell
node -v
npm -v
git --version
npm install
npm run lint
npm test
npm run build
npm start
```

4. Abre `http://localhost:3000` y crea, completa y elimina tareas.
5. Para detener la API presiona `Ctrl + C`.

La instalación de dependencias necesita internet. Docker Desktop es opcional en el equipo local: GitHub Actions lo ejecuta en su servidor.

## Parte B. Crear repositorio público

1. Abre https://github.com/new e inicia sesión.
2. Escribe el nombre `practica3-cicd-itla` (puede ser otro).
3. Selecciona **Public**. No marques la casilla para agregar README o `.gitignore` porque el proyecto ya los incluye.
4. Haz clic en **Create repository**.

## Parte C. Enlazar y subir desde PowerShell de VS Code

> Reemplaza `TU_USUARIO` por tu nombre real de usuario de GitHub; usa el nombre exacto de tu repositorio.

```powershell
git init
git add .
git commit -m "feat: practica 3 pipeline CI/CD"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/practica3-cicd-itla.git
git push -u origin main
```

Si Git solicita identificarte, configura tu correo y nombre con:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@example.com"
```

**Importante:** la carpeta `.github/workflows/ci.yml` está oculta en algunos exploradores; confirma que aparece en GitHub después del `push`.

## Parte D. Activar GitHub Pages

1. En el repositorio entra a **Settings → Pages**.
2. En **Build and deployment → Source** selecciona **GitHub Actions**.
3. Abre **Actions → Practica 3 - CI/CD**. Si la primera ejecución ocurrió antes de activar Pages y falló, selecciona **Re-run jobs** (o realiza otro push).
4. Confirma que `Validar, probar y construir` y `Publicar en GitHub Pages` aparecen en verde.
5. En **Settings → Pages** o en los detalles del despliegue estará la URL pública del sitio, con el formato habitual `https://TU_USUARIO.github.io/practica3-cicd-itla/`.
6. Abre el enlace y prueba agregar, completar y eliminar una tarea.

> En Pages se almacena la lista en **ese navegador**, porque no se puede ejecutar Express directamente en GitHub Pages. La API sí funciona en `http://localhost:3000`.

## Parte E. Demostrar una ejecución roja y otra verde

Consulta `docs/DEMO_ROJO_VERDE.md`. Debes entregar capturas de ambas ejecuciones.

## Parte F. Qué entregar en Moodle

- URL real del repositorio público.
- URL del sitio publicado en GitHub Pages.
- README y archivos Markdown (están dentro del repositorio).
- Informe de implementación en Word (o convertido a PDF si lo pide el profesor).
- Video de demostración o presentación paso por paso.

**Problemas habituales:**

- **`npm` no reconocido:** instala Node.js y abre una terminal nueva.
- **`git push` pide autenticación:** inicia sesión con Git Credential Manager / navegador.
- **Pipeline rojo en tests:** abre Actions y expande `Pruebas unitarias y de integración con cobertura`.
- **404 en Pages:** verifica Pages = GitHub Actions, que el job de despliegue está verde y que entraste en la URL del repo.
- **La web pública no muestra tareas de `localhost`:** son dos almacenamientos distintos, comportamiento esperado.
