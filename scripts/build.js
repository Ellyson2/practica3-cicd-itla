// Build sin frameworks: copia los recursos estáticos a dist/ para GitHub Pages.
const fs = require('fs');
const path = require('path');
const raiz = path.resolve(__dirname, '..');
const origen = path.join(raiz, 'public');
const destino = path.join(raiz, 'dist');
fs.rmSync(destino, { recursive: true, force: true });
fs.cpSync(origen, destino, { recursive: true });
fs.writeFileSync(path.join(destino, '.nojekyll'), '');
console.log('Build completado: dist/ listo para GitHub Pages.');
