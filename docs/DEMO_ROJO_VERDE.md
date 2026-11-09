# Demostración requerida: Pipeline rojo → corrección → Pipeline verde

Haz esta demostración **después** de conseguir la primera ejecución verde en GitHub Actions.

## 1. Verificar el estado verde inicial

1. En GitHub entra a **Actions → Practica 3 - CI/CD**.
2. Comprueba los jobs de validación y despliegue con el símbolo verde.
3. Toma la **Captura 1** del pipeline y la **Captura 2** de la página publicada.

## 2. Provocar una falla controlada

1. En VS Code abre `tests/app.test.js`.
2. Localiza la prueba `GET /health responde estado ok`.
3. Cambia **temporalmente** `expect(r.status).toBe(200);` por `expect(r.status).toBe(500);`.
4. Guarda el archivo y ejecuta:

```bash
git add tests/app.test.js
git commit -m "demo: prueba fallida intencional"
git push
```

5. Abre **Actions** y espera a que se complete el workflow. Deberías ver un error en el paso de pruebas, marcado en **rojo**. Toma la **Captura 3** con la evidencia de la falla.
6. Comprueba que no se publica un despliegue nuevo a partir del commit fallido.

## 3. Corregir y volver a verde

1. En el mismo archivo restaura `expect(r.status).toBe(200);`.
2. Guarda y ejecuta:

```bash
git add tests/app.test.js
git commit -m "fix: restaurar prueba correcta de health"
git push
```

3. En **Actions** verifica que `Validar, probar y construir` y `Publicar en GitHub Pages` finalizan correctamente. Toma la **Captura 4**.
4. La entrega final debe quedar **en verde**; no dejes el error intencional en el último commit.

## 4. Cómo explicar el resultado al profesor

**Rojo:** “Modifiqué una expectativa de la prueba para exigir incorrectamente un código HTTP 500 cuando el servidor responde 200. GitHub Actions detectó el error en las pruebas y detuvo el pipeline antes del despliegue”.

**Verde:** “Restauré la expectativa a 200 y subí una nueva versión. Las pruebas y la cobertura fueron satisfactorias y GitHub Actions autorizó el despliegue automático del frontend en GitHub Pages”.

Las capturas se generan en tu cuenta de GitHub después de hacer los `push`; no vienen incluidas artificialmente en este proyecto.
