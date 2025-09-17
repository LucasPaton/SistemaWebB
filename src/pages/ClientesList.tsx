import { useEffect, useState } from 'react';
import type { Cliente } from '../types/interfaces';
import { getClientes } from '../services/api';
import { Link } from 'react-router-dom';

const ClientesList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getClientes().then(data => setClientes(data));
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

      <input
  type="text"
  placeholder="Buscar por nome ou CPF/CNPJ"
  aria-label="Campo de busca por nome ou CPF/CNPJ"
  value={search}
  onChange={e => setSearch(e.target.value)}
  className="focus-visible:ring focus-visible:ring-blue-500"
  role="searchbox"
/>


      <ul className="space-y-2">
        {paginated.map(cliente => (
          <li key={cliente.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{cliente.nome}</p>
              <p className="text-sm text-gray-600">CPF/CNPJ: {cliente.cpfCnpj}</p>
              <p className="text-sm text-gray-600">Email: {cliente.email}</p>
            </div>
            <Link
              to={`/cliente/${cliente.id}`}
              className="text-blue-600 hover:underline"
            >
              Ver detalhes
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-4 space-x-2">
        <button
  onClick={() => handlePageChange(currentPage - 1)}
  disabled={currentPage === 1}
  aria-label="Ir para a página anterior"
  className="px-3 py-1 border rounded focus-visible:ring focus-visible:ring-blue-500 disabled:opacity-50"
>
  Anterior
</button>

<button
  onClick={() => handlePageChange(currentPage + 1)}
  disabled={currentPage === totalPages}
  aria-label="Ir para a próxima página"
  className="px-3 py-1 border rounded focus-visible:ring focus-visible:ring-blue-500 disabled:opacity-50"
>
  Próxima
</button>

      </div>
    </div>
  );
};

export default ClientesList;
