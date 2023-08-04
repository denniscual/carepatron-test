"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.listClients = exports.removeClient = exports.updateClient = exports.addClient = exports.store = void 0;
exports.store = {
    entities: {
        'xx-aa-bb': {
            id: 'xx-aa-bb',
            firstName: 'John',
            lastName: 'Smitherin',
            email: 'john@gmail.com',
            phoneNumber: '+6192099102',
        },
    },
};
const addClient = (client) => {
    exports.store.entities[client.id] = client;
};
exports.addClient = addClient;
const updateClient = (client) => {
    exports.store.entities[client.id] = client;
};
exports.updateClient = updateClient;
const removeClient = (id) => {
    delete exports.store.entities[id];
};
exports.removeClient = removeClient;
const listClients = () => {
    const list = Object.keys(exports.store.entities).map((id) => exports.store.entities[id]);
    return list.sort((a, b) => {
        if (a.firstName < b.firstName) {
            return -1;
        }
        if (a.firstName > b.firstName) {
            return 1;
        }
        return 0;
    });
};
exports.listClients = listClients;
const getClient = (id) => {
    return exports.store.entities[id];
};
exports.getClient = getClient;
