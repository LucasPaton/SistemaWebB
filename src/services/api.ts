import type { Cliente, Conta, Agencia } from '../types/interfaces';

// 🔧 Função para limpar valores numéricos
const limparNumero = (valor: string): number => {
  if (!valor) return 0;
  return parseFloat(valor.replace(/[^\d.-]/g, '').replace('|', '.'));
};

// 🔧 Função para dividir linhas CSV com aspas e vírgulas internas
const splitCsvLinha = (linha: string): string[] => {
  const regex = /(?:\"([^\"]*)\")|([^,]+)/g;
  const resultado: string[] = [];
  let match;
  while ((match = regex.exec(linha)) !== null) {
    const valor = match[1] ?? match[2];
    resultado.push(valor ? valor.trim() : '');
  }
  return resultado;
};

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes'
  );
  const text = await response.text();
  const linhas = text.trim().split('\n');
  const clientes: Cliente[] = [];

  for (let i = 1; i < linhas.length; i++) {
    const colunas = splitCsvLinha(linhas[i]);

    const cliente: Cliente = {
      id: colunas[0],
      cpfCnpj: colunas[1].replace(/[^\d]/g, ''), // normaliza CPF/CNPJ
      rg: colunas[2] || undefined,
      dataNascimento: new Date(colunas[3]),
      nome: colunas[4],
      nomeSocial: colunas[5] || undefined,
      email: colunas[6],
      endereco: colunas[7],
      rendaAnual: limparNumero(colunas[8]),
      patrimonio: limparNumero(colunas[9]),
      estadoCivil: colunas[10] as Cliente['estadoCivil'],
      codigoAgencia: parseInt(colunas[11], 10),
    };

    clientes.push(cliente);
  }

  return clientes;
};

export const getContas = async (): Promise<Conta[]> => {
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas'
  );
  const text = await response.text();
  const linhas = text.trim().split('\n');
  const contas: Conta[] = [];

  for (let i = 1; i < linhas.length; i++) {
    const colunas = splitCsvLinha(linhas[i]);

    const conta: Conta = {
      id: colunas[0],
      cpfCnpjCliente: colunas[1].replace(/[^\d]/g, ''), // ✅ normaliza CPF/CNPJ
      tipo: colunas[2] as Conta['tipo'],
      saldo: limparNumero(colunas[3]),
      limiteCredito: limparNumero(colunas[4]),
      creditoDisponivel: limparNumero(colunas[5]),
    };

    contas.push(conta);
  }

  return contas;
};

export const getAgencias = async (): Promise<Agencia[]> => {
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias'
  );
  const text = await response.text();
  const linhas = text.trim().split('\n');
  const agencias: Agencia[] = [];

  for (let i = 1; i < linhas.length; i++) {
    const colunas = splitCsvLinha(linhas[i]);

    const agencia: Agencia = {
      id: colunas[0],
      codigo: parseInt(colunas[1], 10),
      nome: colunas[2],
      endereco: colunas[3].replace(/\|/g, ', '),
    };

    agencias.push(agencia);
  }

  return agencias;
};
