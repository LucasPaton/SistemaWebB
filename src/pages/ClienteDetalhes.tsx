import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
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
  /**
   * Bloco de inicialização de hooks e estado.
   * - `useParams`: Captura o 'id' do cliente diretamente da URL.
   * - `useNavigate`: Fornece uma função para redirecionar o usuário (ex: botão "voltar").
   * - `useState`: Gerencia os dados do cliente, conta e agência, além de controlar os estados de carregamento e erro.
   */
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [conta, setConta] = useState<Conta | null>(null);
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [erro, setErro] = useState(false);

  /**
   * Efeito para buscar os dados principais do cliente.
   * É acionado sempre que o 'id' da URL muda. Ele busca a lista de clientes,
   * encontra o correspondente e atualiza o estado 'cliente' ou o estado 'erro'.
   */
  useEffect(() => {
    getClientes().then(clientes => {
      const encontrado = clientes.find(c => c.id === id);
      if (!encontrado) {
        setErro(true);
      } else {
        setCliente(encontrado);
      }
    });
  }, [id]);

  /**
   * Efeito para buscar dados secundários (conta e agência) que dependem do cliente.
   * É acionado somente após o estado 'cliente' ser preenchido com sucesso.
   * Ele busca as listas de contas e agências para encontrar os dados vinculados ao cliente.
   */
  useEffect(() => {
    if (!cliente) return;
    getContas().then(contas => {
      const vinculo = contas.find(c => c.cpfCnpjCliente === cliente.cpfCnpj);
      setConta(vinculo || null);
    });
    getAgencias().then(agencias => {
      const ag = agencias.find(a => a.codigo === cliente.codigoAgencia);
      setAgencia(ag || null);
    });
  }, [cliente]);

  /**
   * Bloco de renderização condicional para estados de erro e carregamento.
   * Interrompe a renderização do componente principal para exibir mensagens
   * apropriadas enquanto os dados não estão prontos ou se um erro ocorreu.
   */
  if (erro) {
    return <div className="text-center text-red-600 mt-10 text-lg">Cliente não encontrado.</div>;
  }
  if (!cliente) {
    return <div className="text-center text-blue-700 mt-10 text-lg">Carregando dados...</div>;
  }

  /**
   * Bloco de preparação de dados para a UI.
   * Esses arrays transformam os dados brutos recebidos da API em uma estrutura
   * de objetos mais simples e formatada, pronta para ser iterada no JSX.
   * Isso mantém a lógica de renderização limpa e declarativa.
   */
  const dadosCliente: { icon: ReactElement; label: string; value: string }[] = [
    { icon: <FaUser />, label: 'Nome', value: cliente.nome },
    ...(cliente.nomeSocial ? [{ icon: <FaUser />, label: 'Nome Social', value: cliente.nomeSocial }] : []),
    { icon: <FaIdCard />, label: 'CPF/CNPJ', value: cliente.cpfCnpj },
    ...(cliente.rg ? [{ icon: <FaIdCard />, label: 'RG', value: cliente.rg }] : []),
    { icon: <FaEnvelope />, label: 'Email', value: cliente.email },
    { icon: <FaMapMarkerAlt />, label: 'Endereço', value: cliente.endereco },
    { icon: <FaBirthdayCake />, label: 'Nascimento', value: cliente.dataNascimento.toLocaleDateString() },
    { icon: <FaBalanceScale />, label: 'Estado Civil', value: cliente.estadoCivil },
    { icon: <FaCoins />, label: 'Renda Anual', value: `R$ ${cliente.rendaAnual.toLocaleString()}` },
    { icon: <FaCoins />, label: 'Patrimônio', value: `R$ ${cliente.patrimonio.toLocaleString()}` },
  ];
  const dadosConta: { label: string; value: string }[] = conta
    ? [
        { label: 'Tipo', value: conta.tipo },
        { label: 'Saldo', value: `R$ ${conta.saldo.toLocaleString()}` },
        { label: 'Limite de Crédito', value: `R$ ${conta.limiteCredito.toLocaleString()}` },
        { label: 'Crédito Disponível', value: `R$ ${conta.creditoDisponivel.toLocaleString()}` },
      ]
    : [];
  const dadosAgencia: { icon: ReactElement; label: string; value: string | number }[] = agencia
    ? [
        { icon: <FaIdCard />, label: 'Número', value: agencia.codigo },
        { icon: <FaBuilding />, label: 'Nome', value: agencia.nome },
        { icon: <FaMapMarkerAlt />, label: 'Endereço', value: agencia.endereco },
      ]
    : [];

  /**
   * Bloco de renderização do JSX.
   * Constrói a estrutura visual do componente, utilizando os dados de estado e os arrays
   * preparados para exibir as informações de forma dinâmica e seccionada.
   */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="p-6 flex-grow">
        <div className="max-w-screen-lg mx-auto space-y-10">
          {/* Botão de voltar para a lista de clientes */}
          <div
            className="w-fit bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md cursor-pointer
                       transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 animate-fade-in-up"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">&larr;</span>
              <span className="font-medium">Voltar para a lista de clientes</span>
            </div>
          </div>

          {/* Título da página */}
          <div className="bg-blue-700 rounded-xl px-6 py-4 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-white">Detalhes do Cliente</h1>
          </div>

          {/* Seção com os dados pessoais do cliente */}
          <section className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaUser /> Dados do Cliente
            </h2>
            <div className="space-y-3">
              {dadosCliente.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 p-3 rounded text-blue-900
                             transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md animate-fade-in-up"
                >
                  {item.icon}
                  <p>
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Seção com os dados da conta bancária */}
          <section className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaMoneyBillWave /> Conta
            </h2>
            {conta ? (
              <div className="space-y-3">
                {dadosConta.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 p-3 rounded text-blue-900
                               transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md animate-fade-in-up"
                  >
                    <p>
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-600">Conta não vinculada a este cliente.</p>
            )}
          </section>

          {/* Seção com os dados da agência */}
          <section className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaBuilding /> Agência
            </h2>
            {agencia ? (
              <div className="space-y-3">
                {dadosAgencia.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 p-3 rounded text-blue-900
                               transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md animate-fade-in-up"
                  >
                    {item.icon}
                    <p>
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-600">Agência não encontrada.</p>
            )}
          </section>
        </div>
      </div>
      
          {/* Rodapé da página */}
      <footer className="bg-blue-800 text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} 
      </footer>
    </div>
  );
};

export default ClienteDetalhes;