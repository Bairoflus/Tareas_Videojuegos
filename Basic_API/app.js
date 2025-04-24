"use strict";

import express from 'express';

const app = express();
const port = 3000;

app.get('/', (request, response)=> {
    response.send("Hello from Server")
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});