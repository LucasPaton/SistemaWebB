import type { Cliente, Conta, Agencia } from '../types/interfaces';
import { parseCSV } from '../utils/csvParser';

const baseURL = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=';

export const getClientes = () => parseCSV<Cliente>(`${baseURL}clientes`);
export const getContas = () => parseCSV<Conta>(`${baseURL}contas`);
export const getAgencias = () => parseCSV<Agencia>(`${baseURL}agencias`);

