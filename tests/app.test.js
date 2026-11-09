const request = require('supertest');
const { createApp } = require('../src/app');

describe('Pruebas de integración: API REST de tareas', () => {
  let app;
  beforeEach(() => { app = createApp(); });

  test('GET /health responde estado ok', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe('ok');
  });

  test('GET /api/tareas comienza vacío', async () => {
    const r = await request(app).get('/api/tareas');
    expect(r.status).toBe(200);
    expect(r.body).toEqual([]);
  });

  test('POST /api/tareas crea una tarea y normaliza espacios', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: '  Configurar pipeline  ' });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ id: 1, titulo: 'Configurar pipeline', completada: false });
  });

  test('POST /api/tareas sin título devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({});
    expect(r.status).toBe(400);
    expect(r.body.error).toBeTruthy();
  });

  test('POST /api/tareas con texto solo de espacios devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: '  ' });
    expect(r.status).toBe(400);
  });

  test('POST /api/tareas con título de más de 80 caracteres devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'x'.repeat(81) });
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/80/);
  });

  test('PATCH /api/tareas/:id alterna completada dos veces', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Escribir pruebas' });
    const primero = await request(app).patch('/api/tareas/1');
    const segundo = await request(app).patch('/api/tareas/1');
    expect(primero.body.completada).toBe(true);
    expect(segundo.body.completada).toBe(false);
  });

  test('PATCH de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).patch('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('DELETE /api/tareas/:id elimina una tarea existente', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Borrar después' });
    const eliminado = await request(app).delete('/api/tareas/1');
    const lista = await request(app).get('/api/tareas');
    expect(eliminado.status).toBe(204);
    expect(lista.body).toEqual([]);
  });

  test('DELETE de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).delete('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('IDs no se repiten al borrar y luego agregar', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'A' });
    await request(app).post('/api/tareas').send({ titulo: 'B' });
    await request(app).delete('/api/tareas/1');
    const tercera = await request(app).post('/api/tareas').send({ titulo: 'C' });
    expect(tercera.body.id).toBe(3);
  });

  test('GET /metrics registra solicitudes y cantidad de tareas', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Medir' });
    const r = await request(app).get('/metrics');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ tareas: 1, errores: 0 });
    expect(r.body.solicitudes).toBeGreaterThanOrEqual(2);
    expect(r.body.segundosActivo).toBeGreaterThanOrEqual(0);
  });
});
