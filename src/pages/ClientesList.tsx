import { useEffect, useState } from 'react';
import type { Cliente, Conta, Agencia } from '../types/interfaces';
import { getClientes, getContas, getAgencias } from '../services/api';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaMoneyBillWave,
  FaBuilding,
  FaIdCard,
} from 'react-icons/fa';

const ClientesList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getClientes().then(setClientes);
    getContas().then(setContas);
    getAgencias().then(setAgencias);
  }, []);

  const filtered = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
    cliente.cpfCnpj.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSaldoDoCliente = (cpfCnpj: string): number => {
    const conta = contas.find(c => c.cpfCnpjCliente === cpfCnpj);
    return conta ? conta.saldo : 0;
  };

  const getNomeAgencia = (codigo: number): string => {
    const agencia = agencias.find(a => a.codigo === codigo);
    return agencia ? agencia.nome : 'Agência não encontrada';
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Lista de Clientes</h1>

      <div className="flex items-center mb-8 max-w-xl bg-blue-100 rounded-full shadow px-4 py-2">
        <FaSearch className="text-blue-600 mr-2" />
        <input
          type="text"
          placeholder="Pesquisar por Nome ou CPF"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-500"
        />
      </div>

      <ul className="space-y-6">
        {paginated.map(cliente => (
          <li
            key={cliente.id}
            className="bg-blue-100 rounded-xl shadow-md px-6 py-5 flex justify-between items-center hover:shadow-lg transition-shadow"
          >
            <div className="space-y-2 text-gray-800">
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-700" />
                <p className="font-semibold text-lg">{cliente.nome}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaIdCard className="text-blue-700" />
                <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-700" />
                <p><strong>Email:</strong> {cliente.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaBuilding className="text-blue-700" />
                <p><strong>Agência:</strong> Nº {cliente.codigoAgencia} — {getNomeAgencia(cliente.codigoAgencia)}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-blue-700" />
                <p><strong>Saldo:</strong> R$ {getSaldoDoCliente(cliente.cpfCnpj).toLocaleString()}</p>
              </div>
            </div>

            <Link
              to={`/cliente/${cliente.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Mostrar mais informações
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-10 space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1 text-sm text-blue-700">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ClientesList;
