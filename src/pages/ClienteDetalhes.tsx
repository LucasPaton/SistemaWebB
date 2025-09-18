import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Cliente, Conta, Agencia } from '../types/interfaces';
import { getClientes, getContas, getAgencias } from '../services/api';
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaMoneyBillWave,
  FaBuilding,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCoins,
  FaBalanceScale,
} from 'react-icons/fa';

const ClienteDetalhes = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [conta, setConta] = useState<Conta | null>(null);
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const clientes = await getClientes();
        const encontrado = clientes.find(c => c.id === id);
        if (!encontrado) {
          setErro(true);
          return;
        }
        setCliente(encontrado);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setErro(true);
      }
    };
    carregarDados();
  }, [id]);

  useEffect(() => {
    const carregarRelacionamentos = async () => {
      if (!cliente) return;

      try {
        const contas = await getContas();
        const vinculo = contas.find(c => c.cpfCnpjCliente === cliente.cpfCnpj);
        setConta(vinculo || null);

        const agencias = await getAgencias();
        const ag = agencias.find(a => a.codigo === cliente.codigoAgencia);
        setAgencia(ag || null);
      } catch (err) {
        console.error('Erro ao carregar conta ou agência:', err);
      }
    };
    carregarRelacionamentos();
  }, [cliente]);

  if (erro) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        Cliente não encontrado. Verifique o ID na URL.
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center text-blue-700 mt-10 text-lg">
        Carregando dados do cliente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-10">
      <h1 className="text-3xl font-bold text-blue-700">Detalhes do Cliente</h1>

      {/* 🧍‍♂️ Dados do Cliente */}
      <section className="bg-blue-100 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <FaUser /> Dados do Cliente
        </h2>
        <div className="space-y-3 text-white">
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaUser />
            <p><strong>Nome:</strong> {cliente.nome}</p>
          </div>
          {cliente.nomeSocial && (
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <FaUser />
              <p><strong>Nome Social:</strong> {cliente.nomeSocial}</p>
            </div>
          )}
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaIdCard />
            <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
          </div>
          {cliente.rg && (
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <FaIdCard />
              <p><strong>RG:</strong> {cliente.rg}</p>
            </div>
          )}
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaEnvelope />
            <p><strong>Email:</strong> {cliente.email}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaMapMarkerAlt />
            <p><strong>Endereço:</strong> {cliente.endereco}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaBirthdayCake />
            <p><strong>Data de Nascimento:</strong> {isNaN(cliente.dataNascimento.getTime()) ? 'Data inválida' : cliente.dataNascimento.toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaBalanceScale />
            <p><strong>Estado Civil:</strong> {cliente.estadoCivil}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaCoins />
            <p><strong>Renda Anual:</strong> R$ {cliente.rendaAnual.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
            <FaCoins />
            <p><strong>Patrimônio:</strong> R$ {cliente.patrimonio.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* 💳 Conta */}
      <section className="bg-blue-100 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <FaMoneyBillWave /> Conta
        </h2>
        {conta ? (
          <div className="space-y-3 text-white">
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <p><strong>Tipo:</strong> {conta.tipo}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <p><strong>Saldo:</strong> R$ {conta.saldo.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <p><strong>Limite de Crédito:</strong> R$ {conta.limiteCredito.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <p><strong>Crédito Disponível:</strong> R$ {conta.creditoDisponivel.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-yellow-600">Conta não vinculada a este cliente.</p>
        )}
      </section>

      {/* 🏦 Agência */}
      <section className="bg-blue-100 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <FaBuilding /> Agência
        </h2>
        {agencia ? (
          <div className="space-y-3 text-white">
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <FaIdCard />
              <p><strong>Número:</strong> {agencia.codigo}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <FaBuilding />
              <p><strong>Nome:</strong> {agencia.nome}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 p-3 rounded">
              <FaMapMarkerAlt />
              <p><strong>Endereço:</strong> {agencia.endereco}</p>
            </div>
          </div>
        ) : (
          <p className="text-yellow-600">Agência não encontrada.</p>
        )}
      </section>
    </div>
  );
};

export default ClienteDetalhes;
