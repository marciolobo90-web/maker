// ========================================
// Pulseira Maker - Constantes do Sistema
// Design: Industrial Workshop
// ========================================

export interface BraceletColor {
  name: string;
  hex: string;
  textColor: string; // cor do texto sobre a pulseira
}

export const BRACELET_COLORS: BraceletColor[] = [
  { name: "Preto", hex: "#000000", textColor: "#FFFFFF" },
  { name: "Branco", hex: "#FFFFFF", textColor: "#000000" },
  { name: "Vermelho", hex: "#ED3237", textColor: "#FFFFFF" },
  { name: "Azul Royal", hex: "#1E3A8A", textColor: "#FFFFFF" },
  { name: "Azul Claro", hex: "#60A5FA", textColor: "#000000" },
  { name: "Verde", hex: "#00A859", textColor: "#FFFFFF" },
  { name: "Verde Limão", hex: "#84CC16", textColor: "#000000" },
  { name: "Amarelo", hex: "#FDE047", textColor: "#000000" },
  { name: "Laranja", hex: "#F58634", textColor: "#FFFFFF" },
  { name: "Rosa", hex: "#EC4899", textColor: "#FFFFFF" },
  { name: "Rosa Claro", hex: "#FBCFE8", textColor: "#000000" },
  { name: "Roxo", hex: "#7C3AED", textColor: "#FFFFFF" },
  { name: "Lilás", hex: "#C084FC", textColor: "#000000" },
  { name: "Marrom", hex: "#78350F", textColor: "#FFFFFF" },
  { name: "Cinza", hex: "#6B7280", textColor: "#FFFFFF" },
  { name: "Cinza Claro", hex: "#D1D5DB", textColor: "#000000" },
  { name: "Dourado", hex: "#D4A017", textColor: "#000000" },
  { name: "Prata", hex: "#C0C0C0", textColor: "#000000" },
  { name: "Azul Marinho", hex: "#1E3A5F", textColor: "#FFFFFF" },
  { name: "Turquesa", hex: "#06B6D4", textColor: "#000000" },
  { name: "Coral", hex: "#F87171", textColor: "#000000" },
];

export interface FontOption {
  name: string;
  family: string;
  label: string;
}

export const FRONT_BACK_FONTS: FontOption[] = [
  { name: "Arial", family: "Arial, Helvetica, sans-serif", label: "Arial (Clássica)" },
  { name: "Dancing Script", family: "'Dancing Script', cursive", label: "Dancing Script (Cursiva)" },
  { name: "Permanent Marker", family: "'Permanent Marker', cursive", label: "Permanent Marker (Manuscrita)" },
];

export const INSIDE_FONT: FontOption = {
  name: "Calibri",
  family: "Calibri, 'Segoe UI', sans-serif",
  label: "Calibri (Padrão Interno)",
};

export interface BraceletSize {
  name: string;
  cm: string;
  label: string;
}

export const BRACELET_SIZES: BraceletSize[] = [
  { name: "PP", cm: "13,5", label: "P infantil" },
  { name: "P", cm: "16", label: "P adulto" },
  { name: "M", cm: "18", label: "M adulto" },
  { name: "G", cm: "20", label: "G adulto" },
  { name: "GG", cm: "22", label: "GG adulto" },
];

export interface BraceletOrder {
  id: string;
  nomeCliente: string;
  textoFrente: string;
  textoVerso: string;
  l1Dentro1: string;
  l2Dentro1: string;
  l1Dentro2: string;
  l2Dentro2: string;
  cor: string;
  corTexto: string;
  fonteFrente: string;
  fonteVerso: string;
  tamanho: string;
  tamanhoLabel: string;
  tamanhoCm: string;
  simboloFrente?: string;
  simboloVerso?: string;
  quantidade?: number;
}

// Símbolos SVG disponíveis para inclusão nas pulseiras
export interface BraceletSymbol {
  id: string;
  name: string;
  svgPath: string;
  viewBox: string;
}

export const BRACELET_SYMBOLS: BraceletSymbol[] = [
  {
    id: "heart",
    name: "Coração",
    svgPath: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    viewBox: "0 0 24 24",
  },
  {
    id: "star",
    name: "Estrela",
    svgPath: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    viewBox: "0 0 24 24",
  },
  {
    id: "music",
    name: "Nota Musical",
    svgPath: "M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    viewBox: "0 0 24 24",
  },
  {
    id: "paw",
    name: "Pata",
    svgPath: "M4.5 11.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5S7 15.38 7 14s-1.12-2.5-2.5-2.5zm15 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5S22 15.38 22 14s-1.12-2.5-2.5-2.5zM8 8c-1.38 0-2.5 1.12-2.5 2.5S6.62 13 8 13s2.5-1.12 2.5-2.5S9.38 8 8 8zm8 0c-1.38 0-2.5 1.12-2.5 2.5S14.62 13 16 13s2.5-1.12 2.5-2.5S17.38 8 16 8zm-4 4c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83.72.72 1.72 1.17 2.83 1.17s2.1-.45 2.83-1.17C15.55 18.1 16 17.1 16 16c0-2.21-1.79-4-4-4z",
    viewBox: "0 0 24 24",
  },
  {
    id: "cross",
    name: "Cruz",
    svgPath: "M18 6h-4V2H10v4H6v4h4v12h4V10h4z",
    viewBox: "0 0 24 24",
  },
  {
    id: "infinity",
    name: "Infinito",
    svgPath: "M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 9.17 8.15C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53L12 13.34l2.83 2.51c.97.97 2.33 1.53 3.77 1.53 2.98 0 5.4-2.42 5.4-5.38s-2.42-5.38-5.4-5.38zM5.4 15.38c-1.86 0-3.38-1.52-3.38-3.38S3.54 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03L12 13.34 9.17 15.85c-.68.68-1.53 1.03-2.44 1.03-.43 0-.84-.08-1.23-.24l-.1-.04v-.22zm13.2 0c-.91 0-1.76-.35-2.44-1.03L12 10.66l2.83-2.51c.68-.68 1.53-1.03 2.44-1.03 1.86 0 3.38 1.52 3.38 3.38s-1.52 3.38-3.38 3.38c-.43 0-.84-.08-1.23-.24l-.1-.04v-.22z",
    viewBox: "0 0 24 24",
  },
  {
    id: "soccer",
    name: "Bola de Futebol",
    svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-.52.07-1.06.07-1.58.07h-.42c-.52 0-1.06 0-1.58-.07l-.9-3.55 2.9-2.11 2.9 2.11-.9 3.55h-.42zm-5.34-5.71l-1.54-2.86c.38-.93.94-1.78 1.63-2.5l2.98.49-.63 3.63-2.44 1.24zm10.68 0l-2.44-1.24-.63-3.63 2.98-.49c.69.72 1.25 1.57 1.63 2.5l-1.54 2.86z",
    viewBox: "0 0 24 24",
  },
  {
    id: "crown",
    name: "Coroa",
    svgPath: "M2 19h20v3H2v-3zm2-5l4-8 4 5 4-5 4 8H4z",
    viewBox: "0 0 24 24",
  },
];

// Google Sheets URL pattern
export const SHEETS_URL_PATTERN = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
export const SHEETS_CSV_URL = (sheetId: string, gid: string = "0") =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
export const SHEETS_PUBLIC_CSV = (sheetId: string) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

// Expected column headers in the Google Sheet
export const EXPECTED_COLUMNS = [
  "NOME_CLIENTE",
  "TEXTO_FRENTE",
  "TEXTO_VERSO",
  "L1_DENTRO1",
  "L2_DENTRO1",
  "L1_DENTRO2",
  "L2_DENTRO2",
  "COR",
  "COR_TEXTO",
  "FONTE_FRENTE",
  "FONTE_VERSO",
  "TAMANHO",
  "SIMBOLO_FRENTE",
  "SIMBOLO_VERSO",
  "QUANTIDADE",
];
