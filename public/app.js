// En GitHub Pages no existe backend Node.js. Allí se usa localStorage.
// En localhost se consume la misma API Express que prueban Jest + Supertest.
(() => {
  const CLAVE = 'itla-devops-practica3-tareas-v1';
  const estatica = location.hostname.endsWith('.github.io') || location.protocol === 'file:';
  const lista = document.getElementById('lista');
  const vacio = document.getElementById('vacio');
  const contador = document.getElementById('contador');
  const total = document.getElementById('total');
  const titulo = document.getElementById('titulo');
  const error = document.getElementById('error');
  const boton = document.getElementById('agregar');
  let tareas = [];

  document.getElementById('modo').textContent = estatica
    ? 'Demo estática · datos guardados en este navegador'
    : 'Modo API · servidor Express';

  function leerLocal() {
    try {
      const valor = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(valor) ? valor : [];
    } catch { return []; }
  }
  function guardarLocal() { localStorage.setItem(CLAVE, JSON.stringify(tareas)); }
  function mostrarError(mensaje = '') {
    error.textContent = mensaje;
    error.hidden = !mensaje;
  }
  async function solicitar(url, opciones) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
      let mensaje = 'No fue posible completar la operación.';
      try { mensaje = (await respuesta.json()).error || mensaje; } catch { /* respuesta vacía */ }
      throw new Error(mensaje);
    }
    return respuesta.status === 204 ? null : respuesta.json();
  }
  function dibujar() {
    lista.replaceChildren();
    vacio.hidden = tareas.length > 0;
    const pendientes = tareas.filter(t => !t.completada).length;
    contador.textContent = `${pendientes} pendiente${pendientes === 1 ? '' : 's'}`;
    total.textContent = `${tareas.length} tarea${tareas.length === 1 ? '' : 's'} en total`;
    tareas.forEach(tarea => {
      const li = document.createElement('li');
      li.className = `task-row${tarea.completada ? ' completed' : ''}`;
      const principal = document.createElement('label');
      principal.className = 'task-main';
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = tarea.completada;
      check.setAttribute('aria-label', `Completar ${tarea.titulo}`);
      check.addEventListener('change', () => cambiarEstado(tarea.id));
      const nombre = document.createElement('span');
      nombre.className = 'task-title';
      nombre.textContent = tarea.titulo; // Evita inyección de HTML.
      principal.append(check, nombre);
      const borrar = document.createElement('button');
      borrar.className = 'delete';
      borrar.type = 'button';
      borrar.textContent = 'Eliminar';
      borrar.setAttribute('aria-label', `Eliminar ${tarea.titulo}`);
      borrar.addEventListener('click', () => eliminar(tarea.id));
      li.append(principal, borrar);
      lista.appendChild(li);
    });
  }
  async function cargar() {
    try {
      tareas = estatica ? leerLocal() : await solicitar('/api/tareas');
      dibujar();
    } catch (e) { mostrarError(e.message); }
  }
  async function cambiarEstado(id) {
    try {
      if (estatica) {
        const tarea = tareas.find(t => t.id === id);
        tarea.completada = !tarea.completada;
        guardarLocal();
      } else { await solicitar(`/api/tareas/${id}`, { method: 'PATCH' }); }
      await cargar();
    } catch (e) { mostrarError(e.message); dibujar(); }
  }
  async function eliminar(id) {
    try {
      if (estatica) {
        tareas = tareas.filter(t => t.id !== id);
        guardarLocal();
      } else { await solicitar(`/api/tareas/${id}`, { method: 'DELETE' }); }
      await cargar();
    } catch (e) { mostrarError(e.message); }
  }
  document.getElementById('form-tarea').addEventListener('submit', async evento => {
    evento.preventDefault();
    mostrarError();
    const texto = titulo.value.trim();
    if (!texto || texto.length > 80) return mostrarError('Escribe un título de 1 a 80 caracteres.');
    boton.disabled = true;
    try {
      if (estatica) {
        const id = tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1;
        tareas.push({ id, titulo: texto, completada: false });
        guardarLocal();
      } else {
        await solicitar('/api/tareas', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo: texto })
        });
      }
      titulo.value = '';
      await cargar();
      titulo.focus();
    } catch (e) { mostrarError(e.message); }
    finally { boton.disabled = false; }
  });
  cargar();
})();
