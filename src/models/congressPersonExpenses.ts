export interface CongressPersonExpenses {
    dados: Dados[];
    links: Links[];
}

export interface Dados {
    ano:               number;
    mes:               number;
    tipoDespesa:       string;
    codDocumento:      number;
    tipoDocumento:     TipoDocumento;
    codTipoDocumento:  number;
    dataDocumento:     string;
    numDocumento:      number;
    valorDocumento:    number;
    urlDocumento:      string;
    nomeFornecedor:    string;
    cnpjCpfFornecedor: number;
    valorLiquido:      number;
    valorGlosa:        number;
    numRessarcimento:  number | string;
    codLote:           number;
    parcela:           number;
}

export enum TipoDocumento {
    NotaFiscal = 'Nota Fiscal',
    NotaFiscalEletrônica = 'Nota Fiscal Eletrônica',
}

export interface Links {
    rel:  string;
    href: string;
}