"use strict";

const API = '/api';

// — User Operations —
// Fetch all users
async function fetchUsers(event) {
    if (event) event.preventDefault(); // Prevent default form submission
    try {
        // Request list of users
        const response = await fetch(`${API}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        const container = document.getElementById('res-get-users');
        container.innerHTML = '';
        // Check if users exist
        if (!users || users.length === 0) {
            container.textContent = 'No users available.';
            return;
        }
        // Create a list of users
        const ul = document.createElement('ul');
        users.forEach(u => {
            const li = document.createElement('li');
            // Check if user has items
            const itemsText = u.items && u.items.length > 0
                ? u.items
                    .map(i => `#ID: ${i.id}, Name: ${i.name}, Type: ${i.type}, Effect: ${i.effect}`)
                    .join(', ')
                : 'None';
            // Display user information
            li.textContent = `ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Items: ${itemsText}`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (err) {
        console.error(err);
        const container = document.getElementById('res-get-users');
        container.textContent = 'Error fetching users.';
    }
}

// Fetch user by ID
async function fetchUserById(event) {
    event.preventDefault();
    const id = document.getElementById('get-user-id').value;
    if (!id) { // If no ID is provided, fetch all users
        return fetchUsers();
    }
    try {
        // Request user by ID
        const response = await fetch(`${API}/users/${id}`);
        const data = await response.json();
        const container = document.getElementById('res-get-users');
        container.innerHTML = '';

        if (response.ok) {
            // Create a list for the user
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.textContent = `ID: ${data.id}, Name: ${data.name}, Email: ${data.email}, Items: ${data.items.map(i => i.name).join(', ')}`;
            ul.appendChild(li);
            container.appendChild(ul);
        } else { // If user not found, display error message
            container.textContent = data.message;
        }
    } catch (err) {
        console.error(err);
    }
}

// Register a new user
async function registerUser(event) {
    event.preventDefault();
    const body = {
        id: document.getElementById('user-id').value,
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value
    };
    // Send request to register user
    const response = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    // Display response message
    document.getElementById('res-register-user').textContent = data.message;
}

// Update user information
async function updateUser(event) {
    event.preventDefault();
    const id = document.getElementById('edit-user-id').value;
    const body = {
        name: document.getElementById('edit-user-name').value,
        email: document.getElementById('edit-user-email').value
    };
    // Send request to update user
    const response = await fetch(`${API}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    document.getElementById('res-edit-user').textContent = data.message;
}

// Delete a user
async function deleteUser(event) {
    event.preventDefault();
    const id = document.getElementById('delete-user-id').value;
    // Send request to delete user
    const response = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    const data = await response.json();
    document.getElementById('res-delete-user').textContent = data.message;
}

// — Item Operations —
// Fetch all items
async function fetchItems(event) {
    if (event) event.preventDefault();
    try {
        const response = await fetch(`${API}/items`);
        if (!response.ok) throw new Error('Failed to fetch items');
        const items = await response.json();
        const container = document.getElementById('res-get-items');
        container.innerHTML = '';
        if (!items || items.length === 0) {
            container.textContent = 'No items available.';
            return;
        }
        const ul = document.createElement('ul');
        items.forEach(i => {
            const li = document.createElement('li');
            li.textContent = `ID: ${i.id}, Name: ${i.name}, Type: ${i.type}, Effect: ${i.effect}`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (err) {
        console.error(err);
        document.getElementById('res-get-items').textContent = 'Error fetching items.';
    }
}

// Fetch item by ID
async function fetchItemById(event) {
    event.preventDefault();
    const id = document.getElementById('get-item-id').value;
    if (!id) {
        return fetchItems();
    }
    try {
        const response = await fetch(`${API}/items/${id}`);
        const data = await response.json();
        const container = document.getElementById('res-get-items');
        container.innerHTML = '';
        if (response.ok) {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.textContent = `ID: ${data.id}, Name: ${data.name}, Type: ${data.type}, Effect: ${data.effect}`;
            ul.appendChild(li);
            container.appendChild(ul);
        } else {
            container.textContent = data.message;
        }
    } catch (err) {
        console.error(err);
    }
}

// Register a new item
async function registerItem(event) {
    event.preventDefault();
    const body = {
        id: document.getElementById('item-id').value,
        userid: document.getElementById('item-userid').value,
        name: document.getElementById('item-name').value,
        type: document.getElementById('item-type').value,
        effect: document.getElementById('item-effect').value
    };
    try {
        const response = await fetch(`${API}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        document.getElementById('res-register-item').textContent = data.message;
    } catch (err) {
        console.error(err);
        document.getElementById('res-register-item').textContent = 'Error registering item.';
    }
}

// Update item information
async function updateItem(event) {
    event.preventDefault();
    const id = document.getElementById('edit-item-id').value;
    const body = {
        name: document.getElementById('edit-item-name').value,
        type: document.getElementById('edit-item-type').value,
        effect: document.getElementById('edit-item-effect').value
    };
    const response = await fetch(`${API}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    document.getElementById('res-edit-item').textContent = data.message;
}

// Delete an item 
async function deleteItem(event) {
    event.preventDefault();
    const id = document.getElementById('delete-item-id').value;
    const response = await fetch(`${API}/items/${id}`, { method: 'DELETE' });
    const data = await response.json();
    document.getElementById('res-delete-item').textContent = data.message;
}

// Attach event listeners
function main() {
    document.getElementById('form-register-user').addEventListener('submit', registerUser);
    document.getElementById('form-get-users').addEventListener('submit', fetchUserById);
    document.getElementById('form-edit-user').addEventListener('submit', updateUser);
    document.getElementById('form-delete-user').addEventListener('submit', deleteUser);

    document.getElementById('form-register-item').addEventListener('submit', registerItem);
    document.getElementById('form-get-items').addEventListener('submit', fetchItemById);
    document.getElementById('form-edit-item').addEventListener('submit', updateItem);
    document.getElementById('form-delete-item').addEventListener('submit', deleteItem);
}

// Initialize
main();
