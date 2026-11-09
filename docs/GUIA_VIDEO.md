# Guion de video para presentar la Práctica 3 (aprox. 3–4 minutos)

## 0:00 – 0:30 | Presentación

“Saludos, en esta práctica implementé un pipeline CI/CD usando GitHub Actions para una aplicación sencilla de gestión de tareas. El objetivo es automatizar las pruebas y publicar la interfaz en GitHub Pages cuando los cambios cumplen las validaciones”.

**Mostrar:** README.md y estructura del repositorio.

## 0:30 – 1:10 | Aplicación

“La aplicación tiene una API REST con Express, y la interfaz permite agregar, completar y eliminar tareas. La función de eliminación y las validaciones ampliadas se incorporaron como parte de esta práctica. En GitHub Pages, que solo permite contenido estático, el navegador guarda las tareas en localStorage”.

**Mostrar:** sitio publicado, crear una tarea, completar y eliminar.

## 1:10 – 1:55 | Pruebas

“Preparé pruebas unitarias para validar los títulos y pruebas de integración para los endpoints HTTP. Jest genera un informe de cobertura y exige un mínimo del 80 por ciento. Si las pruebas fallan, el pipeline se detiene”.

**Mostrar:** archivo `tests/tareas.unit.test.js`, `tests/app.test.js`, salida de npm test.

## 1:55 – 2:35 | Pipeline

“Mi workflow se ejecuta en cada push o Pull Request sobre la rama principal. Primero descarga el código, instala Node y las dependencias, revisa la sintaxis, ejecuta pruebas, crea los archivos estáticos y construye la imagen Docker. Si todo sale bien y es un push a main, publica automáticamente el frontend”.

**Mostrar:** `.github/workflows/ci.yml`, ejecuciones en GitHub Actions.

## 2:35 – 3:20 | Demostración rojo/verde

“Para comprobar el control de calidad, alteré intencionalmente una expectativa en una prueba. GitHub Actions la detectó y marcó el pipeline en rojo, por lo que no permitió desplegar ese cambio. Después corregí la prueba, subí otro commit y comprobé el estado verde y el despliegue”.

**Mostrar:** historial de Actions con ambos commits (ver `docs/DEMO_ROJO_VERDE.md`).

## 3:20 – 3:45 | Conclusión

“Concluyo que CI/CD permite verificar cambios automáticamente y reducir despliegues defectuosos. La interfaz está publicada en GitHub Pages y la API Express se ejecuta localmente; como próxima mejora se podría usar una base de datos y publicar también el backend”.

**Mostrar:** página abierta y URL pública del repositorio.

> Adapta el discurso a lo que efectivamente hayas ejecutado. No declares rojo/verde ni despliegue comprobados antes de obtener evidencias reales.
