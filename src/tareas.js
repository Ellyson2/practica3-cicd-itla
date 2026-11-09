// Reglas de negocio independientes de Express para facilitar las pruebas unitarias.
const MAX_TITULO = 80;

function validarTitulo(valor) {
  if (typeof valor !== 'string') {
    return { ok: false, error: 'El título debe ser texto' };
  }
  const titulo = valor.trim();
  if (!titulo) {
    return { ok: false, error: 'El título es obligatorio' };
  }
  if (titulo.length > MAX_TITULO) {
    return { ok: false, error: `El título no puede superar ${MAX_TITULO} caracteres` };
  }
  return { ok: true, titulo };
}

module.exports = { MAX_TITULO, validarTitulo };
