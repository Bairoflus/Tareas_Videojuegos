"use strict";

// Aqui guadamos los usuarios y los items en memoria.
export const users = [];
export const items = [];

// ----- User functions -----
// Registra un nuevo usuario.
export function registerUser({ id, name, email }) {
    const uid = Number(id);
    if (!uid || !name || !email) {
        return { status: 400, message: "Faltan atributos: id, name y email son obligatorios." };
    }
    if (users.find(u => u.id === uid)) {
        return { status: 409, message: `Ya existe un usuario con id='${uid}'.` };
    }
    const newUser = { id: uid, name, email, items: [] };
    users.push(newUser);
    return { status: 201, user: newUser };
}

// Recupera todos los usuarios.
export function getAllUsers() {
    return { status: 200, users };
}

// Recupera un usuario por ID.
export function getUserById(id) {
    const uid = Number(id);
    const user = users.find(u => u.id === uid);
    if (!user) {
        return { status: 404, message: `No se encontró un usuario con id='${uid}'.` };
    }
    return { status: 200, user };
}

// Actualiza los datos de un usuario.
export function updateUser({ id, name, email }) {
    const uid = Number(id);
    const index = users.findIndex(u => u.id === uid);
    if (index < 0) {
        return { status: 404, message: `No se encontró un usuario con id='${uid}'.` };
    }
    users[index].name = name;
    users[index].email = email;
    return { status: 200, message: `Usuario con id='${uid}' editado correctamente.` };
}

// Elimina un usuario por ID.
export function deleteUser(id) {
    const uid = Number(id);
    const index = users.findIndex(u => u.id === uid);
    if (index < 0) {
        return { status: 404, message: `No se encontró un usuario con id='${uid}'.` };
    }
    users.splice(index, 1);
    return { status: 200, message: `Usuario con id='${uid}' eliminado correctamente.` };
}

// ----- Item functions -----
// Registra un nuevo ítem.
export function registerItem({ id, userid, name, type, effect }) {
    const iid = Number(id);
    const uid = Number(userid);
    if (!iid || !uid || !name || !type || !effect) {
        return { status: 400, message: "Faltan atributos: id, userid, name, type y effect son obligatorios." };
    }
    if (items.find(i => i.id === iid)) {
        return { status: 409, message: `Ya existe un ítem con id='${iid}'.` };
    }
    const user = users.find(u => u.id === uid);
    if (!user) {
        return { status: 404, message: `No se encontró un usuario con id='${uid}'.` };
    }
    const newItem = { id: iid, name, type, effect };
    items.push(newItem);
    user.items.push(newItem);
    return { status: 201, item: newItem };
}

// Recupera todos los ítems.
export function getAllItems() {
    return { status: 200, items };
}

// Recupera un ítem por ID.
export function getItemById(id) {
    const iid = Number(id);
    const item = items.find(i => i.id === iid);
    if (!item) {
        return { status: 404, message: `No se encontró un ítem con id='${iid}'.` };
    }
    return { status: 200, item };
}

// Actualiza los datos de un ítem.
export function updateItem({ id, name, type, effect }) {
    const iid = Number(id);
    const index = items.findIndex(i => i.id === iid);
    if (index < 0) {
        return { status: 404, message: `No se encontró un ítem con id='${iid}'.` };
    }
    items[index].name = name;
    items[index].type = type;
    items[index].effect = effect;
    // También actualiza el ítem en los usuarios que lo tienen
    users.forEach(u => {
        const idx = u.items.findIndex(i => i.id === iid);
        if (idx >= 0) u.items[idx] = items[index];
    });
    return { status: 200, message: `Ítem con id='${iid}' editado correctamente.` };
}

// Elimina un ítem por ID.
export function deleteItem(id) {
    const iid = Number(id);
    const index = items.findIndex(i => i.id === iid);
    if (index < 0) {
        return { status: 404, message: `No se encontró un ítem con id='${iid}'.` };
    }
    items.splice(index, 1);
    // También elimina el ítem de los usuarios que lo tienen
    users.forEach(u => {
        u.items = u.items.filter(i => i.id !== iid);
    });
    return { status: 200, message: `Ítem con id='${iid}' eliminado correctamente.` };
}