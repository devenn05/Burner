// server.js
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage. This will be cleared if the server restarts.
// For a production app, a persistent database like Redis would be better.
const messages = {};

app.use(express.json());

// This line is crucial. It tells the server to provide the files
// from a 'public' folder. Your index.html will go in there.
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for the client to store a new encrypted message.
app.post('/api/create', (req, res) => {
    const { encryptedData } = req.body;
    if (!encryptedData) {
        return res.status(400).json({ error: 'Encrypted data is required.' });
    }
    
    // Generate a secure, unique ID for the link.
    const id = crypto.randomBytes(16).toString('hex');
    
    // Store the data.
    messages[id] = { data: encryptedData };
    
    console.log(`[+] Message created with ID: ${id}`);
    
    // Return the unique ID to the client.
    res.status(201).json({ id });
});

// API endpoint for the client to retrieve (and burn) a message.
app.get('/api/message/:id', (req, res) => {
    const { id } = req.params;
    
    if (messages[id]) {
        const messageData = messages[id].data;
        
        // This is the "burn" step. It happens on the server.
        delete messages[id];
        
        console.log(`[*] Message retrieved and burned: ${id}`);
        res.status(200).json({ encryptedData: messageData });
    } else {
        // If we can't find it, it's already been burned or never existed.
        console.log(`[!] Failed attempt for burned/invalid message: ${id}`);
        res.status(404).json({ error: 'Message not found or already burned.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});