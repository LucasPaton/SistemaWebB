import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Cliente, Conta, Agencia } from '../types/interfaces';
import { getClientes, getContas, getAgencias } from '../services/api';

const ClienteDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencia, setAgencia] = useState<Agencia | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const clientes = await getClientes();
      const clienteSelecionado = clientes.find(c => c.id === id);
      setCliente(clienteSelecionado ?? null);

      if (clienteSelecionado) {
        const contasTodas = await getContas();
        const contasDoCliente = contasTodas.filter(
          conta => conta.cpfCnpjCliente === clienteSelecionado.cpfCnpj
        );
        setContas(contasDoCliente);

        const agenciasTodas = await getAgencias();
        const agenciaDoCliente = agenciasTodas.find(
          ag => ag.codigo === clienteSelecionado.codigoAgencia
        );
        setAgencia(agenciaDoCliente ?? null);
      }
    };

    fetchData();
  }, [id]);

  if (!cliente) return <p className="text-center mt-10">Carregando dados do cliente...</p>;

  return (
    <main className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <section aria-labelledby="titulo-cliente" className="mb-6">
        <h2 id="titulo-cliente" className="text-2xl font-bold mb-4">Detalhes do Cliente</h2>
        <ul className="space-y-1">
          <li><strong>Nome:</strong> {cliente.nome}</li>
          <li><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</li>
          <li><strong>Email:</strong> {cliente.email}</li>
          <li><strong>Data de Nascimento:</strong> {new Date(cliente.dataNascimento).toLocaleDateString()}</li>
          <li><strong>Estado Civil:</strong> {cliente.estadoCivil}</li>
          <li><strong>Renda Anual:</strong> R$ {cliente.rendaAnual.toLocaleString()}</li>
          <li><strong>Patrimônio:</strong> R$ {cliente.patrimonio.toLocaleString()}</li>
          <li><strong>Endereço:</strong> {cliente.endereco}</li>
        </ul>
      </section>

      <section aria-labelledby="titulo-contas" className="mb-6">
        <h3 id="titulo-contas" className="text-xl font-semibold mb-2">Contas Bancárias</h3>
        {contas.length > 0 ? (
          <ul className="space-y-2">
            {contas.map(conta => (
              <li key={conta.id} className="border p-3 rounded bg-gray-50">
                <p><strong>Tipo:</strong> {conta.tipo}</p>
                <p><strong>Saldo:</strong> R$ {conta.saldo.toLocaleString()}</p>
                <p><strong>Limite de Crédito:</strong> R$ {conta.limiteCredito.toLocaleString()}</p>
                <p><strong>Crédito Disponível:</strong> R$ {conta.creditoDisponivel.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma conta vinculada.</p>
        )}
      </section>

      <section aria-labelledby="titulo-agencia">
        <h3 id="titulo-agencia" className="text-xl font-semibold mb-2">Agência</h3>
        {agencia ? (
          <div className="border p-3 rounded bg-gray-50">
            <p><strong>Nome:</strong> {agencia.nome}</p>
            <p><strong>Endereço:</strong> {agencia.endereco}</p>
          </div>
        ) : (
          <p>Agência não encontrada.</p>
        )}
      </section>
    </main>
  );
};

export default ClienteDetalhes;
