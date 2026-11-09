const { MAX_TITULO, validarTitulo } = require('../src/tareas');

describe('Pruebas unitarias: validarTitulo', () => {
  test('acepta un título y elimina espacios exteriores', () => {
    expect(validarTitulo('  Preparar CI/CD  ')).toEqual({ ok: true, titulo: 'Preparar CI/CD' });
  });

  test('rechaza valores no textuales', () => {
    expect(validarTitulo(12)).toMatchObject({ ok: false });
    expect(validarTitulo(null)).toMatchObject({ ok: false });
  });

  test('rechaza cadenas vacías o compuestas por espacios', () => {
    expect(validarTitulo('  ').error).toBe('El título es obligatorio');
  });

  test('acepta exactamente 80 caracteres y rechaza 81', () => {
    expect(validarTitulo('a'.repeat(MAX_TITULO)).ok).toBe(true);
    expect(validarTitulo('a'.repeat(MAX_TITULO + 1)).ok).toBe(false);
  });
});
