"use strict";

import express from 'express'; // importamos express, que es el framework que vamos a usar
import fs from 'fs'; // importamos fs, que es el módulo de Node.js para trabajar con el sistema de archivos

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('public')); // carpeta donde guardamos los archivos estáticos (HTML, CSS, JS, imágenes...)

// Aquí guardaremos los ítems “en memoria”
const items = [];

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

// Endpoint para crear un nuevo ítem
app.post('/items', function (req, res) {
  const body = req.body;      // todo lo que envíes en JSON
  const id     = body.id;     // sacamos cada campo
  const name   = body.name;
  const type   = body.type;
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
  if (!id || !name || !type || !effect) {
    // Code 400: Bad Request
    res.status(400).json({ message: "Faltan atributos: id, name, type y effect son obligatorios."});
    return;
  }
  
  // Si todo esta correcto, lo agregamos a nuestra lista
  const newItem = {
    id: id,
    name: name,
    type: type,
    effect: effect
  };
  items.push(newItem);

  // Devolvemos un mensaje de éxito cuando se haya agregado el ítem
  // Code 201: Created
  res.status(201).json({
    message: 'Ítem agregado correctamente.',
    item: newItem
  });
});

// Arrancamos el servidor
app.listen(port, function () {
  console.log(`Servidor corriendo en http://localhost:'${port}'`);
});
