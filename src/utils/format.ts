function dataFormat(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}

function currencyFormat(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export { dataFormat, currencyFormat };