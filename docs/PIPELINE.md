# Documentación técnica del Pipeline CI/CD

## Propósito

Automatizar la comprobación de calidad del software y publicar el frontend sin pasos manuales posteriores al `push` a `main`, siempre que el flujo complete sus validaciones.

## Eventos

- `push` a `main`: valida todo y, si pasa, publica GitHub Pages.
- `pull_request` dirigido a `main`: valida el cambio sin publicar Pages.
- `workflow_dispatch`: permite ejecutar las comprobaciones manualmente desde GitHub Actions. Si se ejecuta manualmente, no publica el sitio.

## Etapas y condición de aprobación

| # | Etapa | Acción | Condición de aprobación |
|---|---|---|---|
| 1 | Checkout | Descarga el código del repositorio | Código accesible |
| 2 | Configuración | Prepara Node.js 22 | Node disponible |
| 3 | Dependencias | `npm install --no-audit --no-fund` | Paquetes instalados |
| 4 | Lint | `npm run lint` | Sintaxis sin errores |
| 5 | Tests y cobertura | `npm test` | Tests correctos y mínimo 80 % |
| 6 | Build | `npm run build` | Se crea `dist/` |
| 7 | Verificación | `test -s dist/index.html ...` | Archivos no vacíos |
| 8 | Docker | `docker build ...` | Imagen construida |
| 9 | Artefacto | `configure-pages` y `upload-pages-artifact` | Frontend preparado (solo push a main) |
| 10 | Despliegue | `deploy-pages` | URL de Pages generada |

## Dependencias entre jobs

`desplegar` tiene `needs: validar`, por lo tanto no puede desplegarse antes de que finalice `validar`. Si las pruebas fallan, el job de validación queda en rojo y no se ejecuta la publicación.

## Seguridad

- Se utiliza el `GITHUB_TOKEN` automáticamente proporcionado por GitHub Actions.
- El primer job solo dispone de `contents: read`; el job de despliegue solicita `pages: write` e `id-token: write`.
- No se requieren claves de Azure, credenciales de nube ni secretos adicionales.
- La aplicación pública no expone el servidor Node.js.

## Cobertura

La opción `collectCoverageFrom` de `package.json` analiza `src/app.js` y `src/tareas.js`. `coverageThreshold` exige 80 % en las cuatro métricas. Jest genera el reporte de cobertura en `coverage/` y muestra un resumen en consola.

## Diferencia entre CI y CD

- **CI (integración continua):** valida automáticamente sintaxis, pruebas, cobertura y construcción ante cambios del repositorio.
- **CD (despliegue continuo de la interfaz):** después de aprobar CI, sube el frontend estático a GitHub Pages.

**Alcance:** la imagen Docker se construye para verificar empaquetado, pero no se publica ni se ejecuta como servicio online. La API es demostrable localmente.
