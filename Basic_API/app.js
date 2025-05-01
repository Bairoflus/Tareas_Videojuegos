"use strict";

import express from 'express'; // importamos express, que es el framework que vamos a usar
import fs from 'fs'; // importamos fs, que es el módulo de Node.js para trabajar con el sistema de archivos
import bodyParser from 'body-parser'; // importamos body-parser, que es un middleware para parsear el body de las peticiones HTTP

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('public')); // carpeta donde guardamos los archivos estáticos (HTML, CSS, JS, imágenes...)
app.use(bodyParser.urlencoded({ extended: false })); // para poder recibir datos en el body de las peticiones POST
app.use(bodyParser.json()); // para poder recibir datos en el body de las peticiones POST

// Aquí guardaremos los ítems “en memoria”
const items = [];
// Aquí guardaremos los usuarios “en memoria”
const users = [];

app.get('/', function (req, res) {
  fs.readFile('public/html/helloWorld.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// ITEMS ENDPOINTS
// VIEW
app.get('/items/register', function (req, res) {
  fs.readFile('public/html/registerItems.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Endpoint para crear un nuevo ítem
app.post('/items/register', function (req, res) {
  const body = req.body;      // Todo lo que envies sera un JSON
  const id = Number(body.id);         // sacamos cada campo
  const userid = Number(body.userid);
  const name = body.name;
  const type = body.type;
  const effect = body.effect;

  // Verifica que no exista ya otro ítem con el mismo id
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      // Code 409: Conflict
      res.status(409).json({ message: `Ya existe un ítem con id='${id}'.` });
      return;
    }
  }
  // Valida que esten todos los campos
  if (!id || !name || !type || !effect || !userid) {
    // Code 400: Bad Request
    res.status(400).json({ message: "Faltan atributos: id, name, type, effect y userid son obligatorios." });
    return;
  }

  // Encontrar el usuario por su id
  const user = users.find(user => user.id === userid);
  if (!user) {
    // Code 404: Not Found
    res.status(404).json({ message: `No se encontró un usuario con id='${userid}'.` });
    return;
  }

  // Si todo esta correcto, lo agregamos a nuestra lista
  const newItem = {
    id: Number(id),
    name: name,
    type: type,
    effect: effect
  };

  // darle el item al usuario
  user.items.push(newItem); // Agregamos el id del item al array de items del usuario

  // Devolvemos un mensaje de éxito cuando se haya agregado el ítem
  // Code 201: Created
  res.status(201).json({
    message: 'Ítem agregado correctamente.',
    item: newItem
  });
});

// Ver items del catalogo
app.get('/items/check', function (req, res) {
  // Devolvemos la lista de ítems
  res.status(200).json(items);
});

// VIEW ITEMS WITH ID
app.get('/items/check/id', function (req, res) {
  fs.readFile('public/html/checkItemsID.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Ver un ítem por su id
app.post('/items/check/id', function (req, res) {
  const body = req.body;
  const id = Number(body.id);

  let item = null; // Inicializamos la variable item como null
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      item = items[i]; // Si encontramos el ítem, lo guardamos en la variable item
      break; // Salimos del bucle una vez que encontramos el ítem
    }
  }

  if (!item) {
    // Code 404: Not Found
    res.status(404).json({ message: `No se encontró un ítem con id='${id}'.` });
    return;
  }
  res.status(200).json(item); // Devolvemos el ítem encontrado
});

// VIEW DELETE ITEM
app.get('/items/delete', function (req, res) {
  fs.readFile('public/html/deleteItemsID.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Eliminar un ítem por su id
app.post('/items/delete', function (req, res) {
  const body = req.body;
  const id = Number(body.id);

  // Buscamos el índice del ítem a eliminar
  const index = items.findIndex(item => item.id === id);

  if (!index && index !== 0) {
    // Code 404: Not Found
    res.status(404).json({ message: `No se encontró un ítem con id='${id}'.` });
    return;
  }

  // Si lo encontramos, lo eliminamos
  items.splice(index, 1);
  // Code 200: OK
  res.status(200).json({ message: `Ítem con id='${id}' eliminado correctamente.` });
});

// VIEW EDIT ITEM
app.get('/items/edit', function (req, res) {
  fs.readFile('public/html/editItemsID.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Actualizar un ítem por su id
app.post('/items/edit', function (req, res) {
  const body = req.body;
  const id = Number(body.id);
  const name = body.name;
  const type = body.type;
  const effect = body.effect;

  // Buscamos el índice del ítem a editar
  const index = items.findIndex(item => item.id === id);

  if (!index && index !== 0) {
    // Code 404: Not Found
    res.status(404).json({ message: `No se encontró un ítem con id='${id}'.` });
    return;
  }

  // Si lo encontramos, lo editamos
  items[index].name = name;
  items[index].type = type;
  items[index].effect = effect;

  // Code 200: OK
  res.status(200).json({ message: `Ítem con id='${id}' editado correctamente.` });
});
// FIN --- ITEMS ENDPOINTS

// USERS ENDPOINTS
// VIEW
app.get('/users/register', function (req, res) {
  fs.readFile('public/html/registerUsers.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Endpoint para crear un nuevo usuario
app.post('/users/register', function (req, res) {
  const body = req.body;      // Todo lo que envies sera un JSON
  const id = body.id;         // sacamos cada campo
  const name = body.name;
  const email = body.email;

  // Verifica que no exista ya otro usuario con el mismo id
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      // Code 409: Conflict
      res.status(409).json({ message: `Ya existe un usuario con id='${id}'.` });
      return;
    }
  }
  // Valida que esten todos los campos
  if (!id || !name || !email) {
    // Code 400: Bad Request
    res.status(400).json({ message: "Faltan atributos: id, name y email son obligatorios." });
    return;
  }

  // Si todo esta correcto, lo agregamos a nuestra lista
  const newUser = {
    id: Number(id),
    name: name,
    email: email,
    items: [] // Inicializamos el array de items vacio
  };

  users.push(newUser); // Agregamos el nuevo usuario al array de usuarios

  // Devolvemos un mensaje de éxito cuando se haya agregado el usuario
  // Code 201: Created
  res.status(201).json({
    message: 'Usuario agregado correctamente.',
    user: newUser
  });
});

// Ver users del catalogo
app.get('/users/check', function (req, res) {
  // Devolvemos la lista de users
  res.status(200).json(users);
});

// VIEW USERS WITH ID
app.get('/users/check/id', function (req, res) {
  fs.readFile('public/html/checkUsersID.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Ver un usuario por su id
app.post('/users/check/id', function (req, res) {
  const body = req.body;
  const id = Number(body.id);

  let user = null; // Inicializamos la variable user como null
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      user = users[i]; // Si encontramos el usuario, lo guardamos en la variable user
      break; // Salimos del bucle una vez que encontramos el usuario
    }
  }

  if (!user) {
    // Code 404: Not Found
    res.status(404).json({ message: `No se encontró un usuario con id='${id}'.` });
    return;
  }
  res.status(200).json(user); // Devolvemos el usuario encontrado
});

// VIEW DELETE USER
app.get('/users/delete', function (req, res) {
  fs.readFile('public/html/deleteUsersID.html', 'utf8', (err, html) => {
    if (err) {
      // Code 500: Internal Server Error
      res.status(500).send('There was an error loading the HTML file, error code: ' + err);
      return;
    }

    console.log("Sending page...");
    res.send(html);
    console.log("Page sent.");
  });
});

// Eliminar un usuario por su id
app.post('/users/delete', function (req, res) {
  const body = req.body;
  const id = Number(body.id);

  // Buscamos el índice del usuario a eliminar
  const index = users.findIndex(user => user.id === id);

  if (!index && index !== 0) {
    // Code 404: Not Found
    res.status(404).json({ message: `No se encontró un usuario con id='${id}'.` });
    return;
  }

  // Si lo encontramos, lo eliminamos
  users.splice(index, 1);
  // Code 200: OK
  res.status(200).json({ message: `Usuario con id='${id}' eliminado correctamente.` });
});

// FIN --- USERS ENDPOINTS

// Arrancamos el servidor
app.listen(port, function () {
  console.log(`Servidor corriendo en http://localhost:'${port}'`);
});
