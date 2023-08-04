"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const store_1 = require("./data/store");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// on start
app.use((0, cors_1.default)({ origin: true, credentials: true }));
// capture json
app.use(express_1.default.json());
app.listen(port, () => {
    console.log(`Mock API is running at http://localhost:${port}`);
});
// main page
app.get('/', (req, res) => {
    res.send('Mock API');
});
// get clients
app.get('/clients', (req, res) => {
    res.send((0, store_1.listClients)());
});
// get client
app.get('/clients/:id', (req, res) => {
    const { id } = req.params;
    res.send((0, store_1.getClient)(id));
});
// create client
app.post('/clients', (req, res) => {
    const client = Object.assign(Object.assign({}, req.body), { id: new Date().toISOString() });
    (0, store_1.addClient)(Object.assign(Object.assign({}, client), { id: (0, uuid_1.v4)() }));
    res.send(client);
});
// update client
app.put('/clients/:id', (req, res) => {
    const client = req.body;
    (0, store_1.updateClient)(client);
    res.status(200).send();
});
// delete client
app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    (0, store_1.removeClient)(id);
    res.status(200).send();
});
