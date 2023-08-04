import { Client } from 'lib/types';
import apiClient from './apiClient';

export const getClients = (): Promise<Client[]> => {
	return apiClient.get<Client[]>('clients');
};

export const createClient = (client: Client): Promise<void> => {
	return apiClient.post<void>('clients', client);
};

export const updateClient = (client: Client): Promise<void> => {
	return apiClient.put<void>('clients', client);
};
