/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value Valor numérico a ser formatado
 * @param decimals Número de casas decimais (padrão: 2)
 * @returns String formatada como moeda (ex: R$ 1.234,56)
 */
export function formatPrice(value: number, decimals: number = 2): string {
  // Verifica se o valor é numérico
  if (isNaN(value)) {
    console.warn(`formatPrice recebeu um valor não numérico: ${value}`);
    return 'R$ --';
  }

  // Opções de formatação
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };

  try {
    return new Intl.NumberFormat('pt-BR', options).format(value);
  } catch (error) {
    console.error('Erro ao formatar preço:', error);
    // Fallback simples caso o Intl não esteja disponível
    return `R$ ${value.toFixed(decimals).replace('.', ',')}`;
  }
}

/**
 * Formata um valor numérico para moeda brasileira sem o símbolo R$
 * @param value Valor numérico a ser formatado
 * @param decimals Número de casas decimais (padrão: 2)
 * @returns String formatada (ex: 1.234,56)
 */
export function formatPriceNoSymbol(value: number, decimals: number = 2): string {
  const formatted = formatPrice(value, decimals);
  return formatted.replace('R$', '').trim();
}

/**
 * Calcula o valor parcelado e formata a exibição
 * @param totalValue Valor total a ser parcelado
 * @param installments Número de parcelas
 * @param interestRate Taxa de juros mensal (opcional)
 * @returns String formatada (ex: 10x de R$ 1.234,56)
 */
export function formatInstallments(
  totalValue: number,
  installments: number,
  interestRate: number = 0
): string {
  if (installments <= 0) return formatPrice(totalValue);
  
  const installmentValue = totalValue * (1 + interestRate) / installments;
  return `${installments}x de ${formatPrice(installmentValue)}`;
}