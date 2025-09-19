// Importa hooks do React para controle de estado e efeitos colaterais
import { useEffect, useState } from 'react';

// Importa tipos utilizados para tipagem dos dados
import type { Cliente, Conta, Agencia } from '../types/interfaces';

// Importa funções simuladas de busca de dados
import { getClientes, getContas, getAgencias } from '../services/api';

// Importa componente de navegação entre rotas
import { Link } from 'react-router-dom';

// Importa ícones utilizados na interface visual
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaMoneyBillWave,
  FaBuilding,
  FaIdCard,
} from 'react-icons/fa';

// Componente principal que exibe a lista de clientes com busca, contador e paginação
const ClientesList = () => {
  // Define estados para armazenar dados de clientes, contas e agências
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);

  // Define estado para controle do campo de busca
  const [search, setSearch] = useState('');

  // Define estado para controle da página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Define quantidade de itens por página
  const itemsPerPage = 10;

  // Realiza busca inicial dos dados ao montar o componente
  useEffect(() => {
    getClientes().then(setClientes);
    getContas().then(setContas);
    getAgencias().then(setAgencias);
  }, []);

  // Filtra os clientes com base no nome ou CPF/CNPJ digitado
  const filtered = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
    cliente.cpfCnpj.includes(search)
  );

  // Calcula total de páginas com base nos resultados filtrados
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Seleciona os clientes da página atual
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Retorna o saldo da conta vinculada ao cliente
  const getSaldoDoCliente = (cpfCnpj: string): number => {
    const conta = contas.find(c => c.cpfCnpjCliente === cpfCnpj);
    return conta ? conta.saldo : 0;
  };

  // Retorna o nome da agência vinculada ao cliente
  const getNomeAgencia = (codigo: number): string => {
    const agencia = agencias.find(a => a.codigo === codigo);
    return agencia ? agencia.nome : 'Agência não encontrada';
  };

  // Renderiza a interface da lista de clientes
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="p-6 flex-grow">
        <div className="max-w-screen-lg mx-auto space-y-10">
          {/* Título com destaque azul */}
          <div className="bg-blue-700 rounded-xl px-6 py-4 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-white">Lista de Clientes</h1>
          </div>

          {/* Campo de busca e contador em uma linha */}
          <div className="flex items-center justify-between gap-4 max-w-screen-lg mx-auto animate-fade-in-up">
            <div className="flex items-center w-full max-w-xl bg-white rounded-full shadow-md px-4 py-3">
              <FaSearch className="text-blue-600 mr-3 text-lg" />
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

            {/* Contador de usuários encontrados */}
            <div className="flex items-center gap-2 text-blue-800 font-medium">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full shadow text-sm">
                {filtered.length}
              </span>
              <span className="text-sm">Usuários Encontrados</span>
            </div>
          </div>

          {/* Lista de clientes */}
          <ul className="space-y-6">
            {paginated.map((cliente, index) => (
              <li
                key={cliente.id}
                className="bg-blue-100 rounded-xl shadow-sm px-6 py-5 flex justify-between items-center
                           transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Dados do cliente exibidos em bolhas */}
                <div className="space-y-2 text-blue-900">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-blue-700" />
                    <p className="font-semibold text-lg tracking-wide">{cliente.nome}</p>
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

                {/* Botão para acessar detalhes do cliente */}
                <Link
                  to={`/cliente/${cliente.id}`}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium
                             hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Ver detalhes
                </Link>
              </li>
            ))}
          </ul>

          {/* Paginação com botões de navegação */}
          <div className="flex justify-center mt-12 space-x-2 flex-wrap animate-fade-in-up">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 border border-blue-300 disabled:opacity-50"
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full border font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 border border-blue-300 disabled:opacity-50"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* Rodapé institucional */}
      <footer className="bg-blue-800 text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default ClientesList;
