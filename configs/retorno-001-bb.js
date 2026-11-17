/* Retorno CNAB240 — Banco do Brasil (001).
 * O manual de particularidades do BB (jun/2026) não traz a tabela de
 * ocorrências: ele manda consultar a planilha "Código Ocorrências de Retorno"
 * à parte ("*Acessar a planilha 'Código Ocorrências de Retorno' para
 * verificar"). Enquanto essa planilha não entrar em docs/cnab, a leitura usa
 * a tabela padrão da FEBRABAN (nota G059).
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['001'] = {
    code: '001',
    name: 'Banco do Brasil',
    produto: 'Pagamentos · Particularidades CNAB240',
    logo: 'logos/Banco%20do%20Brasil%20S.A/banco-do-brasil-com-fundo.svg',
    cor: '#F5C518',
    manual: 'Manual BB de particularidades CNAB240 (jun/2026)',
    fonte: 'febraban',
    notas: [
      'O manual do BB não publica a tabela de ocorrências: ele remete à planilha “Código Ocorrências de Retorno”. A leitura abaixo usa a tabela padrão da FEBRABAN (nota G059), então um código exclusivo do BB pode aparecer sem descrição ou com a descrição do padrão.'
    ],
    refs: {
      tipos: 'Layout FEBRABAN 240, nota G059 (o manual do BB remete à planilha de ocorrências)',
      header: 'Nota G016 — Código Remessa/Retorno, header de arquivo, posição 143',
      movimento: 'FEBRABAN, nota G059: “00 = Crédito ou Débito Efetivado — este código indica que o pagamento foi confirmado”',
      critica: 'FEBRABAN, nota G059: “BD = Inclusão Efetuada com Sucesso”',
      segZ: 'Segmento Z — autenticação do pagamento',
      aviso: 'Trailer de lote, número do aviso de débito',
      dataReal: 'Segmento A, data real da efetivação'
    }
  };
})();
