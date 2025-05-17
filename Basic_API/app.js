"use strict";

import express from 'express';
import bodyParser from 'body-parser';
import * as svc from './public/js/hello_user.js';

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })); // Para poder recibir datos en el body de las peticiones POST
app.use(bodyParser.json()); // Para poder recibir datos en el body de las peticiones POST

// Carpeta donde guardamos los archivos estáticos (HTML, CSS, JS, imágenes...)
app.use(express.static('public'));

// Página principal
app.get('/', (req, res) => {
  res.sendFile('helloWorld.html', { root: 'public/html' });
});

// Formularios de Users
app.get('/users/register', (req, res) => {
  res.sendFile('registerUsers.html', { root: 'public/html' });
});
app.get('/users/check/id', (req, res) => {
  res.sendFile('checkUsersID.html', { root: 'public/html' });
});
app.get('/users/edit', (req, res) => {
  res.sendFile('editUsersID.html', { root: 'public/html' });
});
app.get('/users/delete', (req, res) => {
  res.sendFile('deleteUsersID.html', { root: 'public/html' });
});

// Formularios de Items
app.get('/items/register', (req, res) => {
  res.sendFile('registerItems.html', { root: 'public/html' });
});
app.get('/items/check/id', (req, res) => {
  res.sendFile('checkItemsID.html', { root: 'public/html' });
});
app.get('/items/edit', (req, res) => {
  res.sendFile('editItemsID.html', { root: 'public/html' });
});
app.get('/items/delete', (req, res) => {
  res.sendFile('deleteItemsID.html', { root: 'public/html' });
});

// --- API ENDPOINTS ---
// Users
app.post('/users/register', (req, res) => {
  const result = svc.registerUser(req.body);
  if (result.user) return res.status(result.status).json({ message: 'Usuario agregado correctamente.', user: result.user });
  res.status(result.status).json({ message: result.message });
});

app.get('/users/check', (req, res) => {
  const result = svc.getAllUsers();
  res.status(result.status).json(result);
});

app.post('/users/check/id', (req, res) => {
  const result = svc.getUserById(req.body.id);
  res.status(result.status).json(result);
});

app.post('/users/edit', (req, res) => {
  const result = svc.updateUser(req.body);
  res.status(result.status).json({ message: result.message });
});

app.post('/users/delete', (req, res) => {
  const result = svc.deleteUser(req.body.id);
  res.status(result.status).json({ message: result.message });
});

// Items
app.post('/items/register', (req, res) => {
  const result = svc.registerItem(req.body);
  if (result.item) return res.status(result.status).json({ message: 'Ítem agregado correctamente.', item: result.item });
  res.status(result.status).json({ message: result.message });
});

app.get('/items/check', (req, res) => {
  const result = svc.getAllItems();
  res.status(result.status).json(result);
});

app.post('/items/check/id', (req, res) => {
  const result = svc.getItemById(req.body.id);
  res.status(result.status).json(result);
});

app.post('/items/edit', (req, res) => {
  const result = svc.updateItem(req.body);
  res.status(result.status).json({ message: result.message });
});

app.post('/items/delete', (req, res) => {
  const result = svc.deleteItem(req.body.id);
  res.status(result.status).json({ message: result.message });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
