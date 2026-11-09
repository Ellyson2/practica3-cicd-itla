# Guía de contribución

El proyecto se utiliza como práctica académica de DevOps.

## Proceso de cambios

1. Clona el repositorio con `git clone URL_DEL_REPOSITORIO` y entra a la carpeta.
2. Crea una rama: `git switch -c mejora/nombre-del-cambio`.
3. Instala dependencias con `npm install`.
4. Haz cambios pequeños; si agregas funcionalidades, acompáñalas con pruebas.
5. Ejecuta `npm run check` antes de subir el código.
6. Guarda los cambios con un commit descriptivo, por ejemplo: `git commit -m "test: agregar caso de título inválido"`.
7. Abre un Pull Request hacia `main`; GitHub Actions debe comprobar el cambio.

## Convenciones

- Usar JavaScript claro y nombres descriptivos.
- No subir `node_modules/`, `coverage/`, `dist/` ni secretos.
- Conservar rutas de la API y documentar cualquier cambio público.
- El Pull Request no publica Pages; la publicación solo ocurre al integrar cambios en `main`.

## Criterio para aceptar un cambio

- Revisión de sintaxis correcta.
- Todas las pruebas aprobadas.
- Cobertura mínima requerida alcanzada.
- Construcción del frontend completada.
