// API REST de tareas en memoria. Cada instancia se aísla para las pruebas.
const express = require('express');
const path = require('path');
const { validarTitulo } = require('./tareas');

function createApp() {
  const app = express();
  const tareas = [];
  let siguienteId = 1;
  const metricas = { solicitudes: 0, errores: 0, inicio: Date.now() };

  app.use(express.json());
  app.use((req, res, next) => {
    metricas.solicitudes += 1;
    const t0 = Date.now();
    res.on('finish', () => {
      if (res.statusCode >= 500) metricas.errores += 1;
      if (process.env.NODE_ENV !== 'test') {
        console.log(JSON.stringify({
          nivel: 'info', metodo: req.method, ruta: req.path,
          estado: res.statusCode, ms: Date.now() - t0
        }));
      }
    });
    next();
  });

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (req, res) => res.json({ estado: 'ok' }));

  app.get('/metrics', (req, res) => res.json({
    solicitudes: metricas.solicitudes,
    errores: metricas.errores,
    tareas: tareas.length,
    segundosActivo: Math.round((Date.now() - metricas.inicio) / 1000)
  }));

  app.get('/api/tareas', (req, res) => res.json(tareas));

  app.post('/api/tareas', (req, res) => {
    const resultado = validarTitulo(req.body && req.body.titulo);
    if (!resultado.ok) return res.status(400).json({ error: resultado.error });
    const tarea = { id: siguienteId++, titulo: resultado.titulo, completada: false };
    tareas.push(tarea);
    return res.status(201).json(tarea);
  });

  app.patch('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === Number(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    tarea.completada = !tarea.completada;
    return res.json(tarea);
  });

  // Funcionalidad agregada para la Práctica 3: eliminar una tarea.
  app.delete('/api/tareas/:id', (req, res) => {
    const indice = tareas.findIndex(t => t.id === Number(req.params.id));
    if (indice === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
    tareas.splice(indice, 1);
    return res.status(204).send();
  });

  return app;
}

module.exports = { createApp };
