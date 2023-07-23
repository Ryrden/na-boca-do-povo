function dataFormat(value: string | undefined): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString('pt-BR');
}

function currencyFormat(value: number | undefined): string | null {
  if (!value) return null;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function urlShortener(url: string | undefined): string | null {
  if (!url) return null;
  url = removeBackslashFromEnd(url);
  url = removeParams(url);

  const urlShort = url.split('/');

  return urlShort[urlShort.length - 1];

  // Utilitary functions
  function removeBackslashFromEnd(url: string) {
    return url.replace(/\/$/gim, '');
  }
  function removeParams(url: string) {
    return url.replace(/\?.*/gim, '');
  }
}

export { dataFormat, currencyFormat, urlShortener };
