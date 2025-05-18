"use strict";

import express from 'express'; // Para crear el servidor
import fs from 'fs'; // Para leer archivos
import bodyParser from 'body-parser'; // Para parsear el body de las peticiones
import path from 'path'; // Para manejar rutas de archivos

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.resolve('public'))); // Para acceder a archivos estáticos
app.use(bodyParser.urlencoded({ extended: true })); // Para recibir datos de formularios
app.use(bodyParser.json()); // Para recibir datos JSON

// Aquí guardamos los datos.
let users = [];
let items = [];

// Página principal
app.get('/', (req, res) => {
  res.sendFile('html/helloWorld.html', { root: 'public' });
});

// — Usuarios —
// Crear
app.post('/api/users', (req, res) => {
  const { id, name, email } = req.body;
  if (users.find(u => u.id == id)) {
    return res.status(400).json({ message: 'Usuario ya existe.' });
  }
  const newUser = { id, name, email, items: [] };
  users.push(newUser);
  res.status(201).json({ message: 'Usuario creado.', user: newUser });
});

// Leer todos los usuarios
app.get('/api/users', (req, res) => {
  const usersWithItems = users.map(u => {
    const fullItems = u.items
      .map(itemId => items.find(i => i.id == itemId))
      .filter(i => i != null);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      items: fullItems
    };
  });
  res.json(usersWithItems);
});

// Leer un usuario por ID
app.get('/api/users/:id', (req, res) => {
  const u = users.find(u => u.id == req.params.id);
  if (!u) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }
  const fullItems = u.items
    .map(itemId => items.find(i => i.id == itemId))
    .filter(i => i != null);
  const userWithItems = {
    id: u.id,
    name: u.name,
    email: u.email,
    items: fullItems
  };
  res.json(userWithItems);
});

// Actualizar un usuario
app.put('/api/users/:id', (req, res) => {
  const u = users.find(u => u.id == req.params.id);
  if (!u) {
    return res.status(404).json({ message: 'Usuario no existe.' });
  }
  const { name, email } = req.body;
  if (name) u.name = name;
  if (email) u.email = email;
  res.json({ message: 'Usuario actualizado.', user: u });
});

// Borrar un usuario
app.delete('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id == req.params.id);
  if (idx < 0) {
    return res.status(404).json({ message: 'Usuario no existe.' });
  }
  users.splice(idx, 1);
  res.json({ message: 'Usuario borrado.' });
});

// --- Items CRUD ---
// Crear un ítem
app.post('/api/items', (req, res) => {
  const { id, userid, name, type, effect } = req.body;
  if (items.find(i => i.id == id)) {
    return res.status(400).json({ message: 'Ítem ya existe.' });
  }
  const owner = users.find(u => u.id == userid);
  if (!owner) {
    return res.status(404).json({ message: 'Usuario dueño no existe.' });
  }
  const newItem = { id, name, type, effect };
  items.push(newItem);
  owner.items.push(id);
  res.status(201).json({ message: 'Ítem creado.', item: newItem });
});

// Leer todos los ítems
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Leer un ítem por ID
app.get('/api/items/:id', (req, res) => {
  const it = items.find(i => i.id == req.params.id);
  if (!it) return res.status(404).json({ message: 'Ítem no encontrado.' });
  res.json(it);
});

// Actualizar un ítem
app.put('/api/items/:id', (req, res) => {
  const it = items.find(i => i.id == req.params.id);
  if (!it) {
    return res.status(404).json({ message: 'Ítem no existe.' });
  }
  const { name, type, effect } = req.body;
  if (name) it.name = name;
  if (type) it.type = type;
  if (effect) it.effect = effect;
  res.json({ message: 'Ítem actualizado.', item: it });
});

// Borrar un ítem`
app.delete('/api/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id == req.params.id);
  if (idx < 0) {
    return res.status(404).json({ message: 'Ítem no existe.' });
  }
  const [removed] = items.splice(idx, 1);
  users.forEach(u => {
    u.items = u.items.filter(itemId => itemId != removed.id);
  });
  res.json({ message: 'Ítem borrado.' });
});

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
