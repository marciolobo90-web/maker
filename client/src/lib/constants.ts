// ========================================
// Pulseira Maker - Constantes do Sistema
// Design: Industrial Workshop
// ========================================

export interface BraceletColor {
  name: string;
  hex: string;
  textColor: string;
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
  { name: "Bahnschrift", family: "'Bahnschrift', 'DIN Alternate', 'Segoe UI', sans-serif", label: "Bahnschrift" },
  { name: "Calibri Negrito", family: "Calibri, 'Segoe UI', sans-serif", label: "Calibri Negrito" },
  { name: "Comic Sans", family: "'Comic Sans MS', 'Comic Sans', cursive", label: "Comic Sans" },
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
  { name: "Bebê", cm: "11,5", label: "Bebê" },
  { name: "PP infantil", cm: "12,5", label: "PP infantil" },
  { name: "P infantil", cm: "13,5", label: "P infantil" },
  { name: "M infantil", cm: "14,5", label: "M infantil" },
  { name: "G infantil", cm: "15,5", label: "G infantil" },
  { name: "PP adulto", cm: "16,5", label: "PP adulto" },
  { name: "P adulto", cm: "17,5", label: "P adulto" },
  { name: "M adulto", cm: "18,5", label: "M adulto" },
  { name: "G adulto", cm: "19,5", label: "G adulto" },
  { name: "GG adulto", cm: "20,5", label: "GG adulto" },
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

// Símbolos SVG - usando arquivos SVG completos via CDN
export interface BraceletSymbol {
  id: string;
  name: string;
  svgUrl: string;
  // Thumbnail preview path for the selector UI
  previewColor?: string;
}

export const BRACELET_SYMBOLS: BraceletSymbol[] = [
  {
    id: "alerta",
    name: "Alerta Médico",
    svgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030925363/Y5uoqej3R3jCoeogm8d5Z4/alerta_49d6971d.svg",
    previewColor: "#ED3237",
  },
  {
    id: "brasil",
    name: "Brasil",
    svgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030925363/Y5uoqej3R3jCoeogm8d5Z4/brasil_74e06a85.svg",
    previewColor: "#373435",
  },
  {
    id: "autismo",
    name: "Autismo",
    svgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030925363/Y5uoqej3R3jCoeogm8d5Z4/autismo_66efee46.svg",
    previewColor: "#0098DA",
  },
  {
    id: "bola",
    name: "Bola de Futebol",
    svgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030925363/Y5uoqej3R3jCoeogm8d5Z4/bola_50147873.svg",
    previewColor: "#373435",
  },
];

// Google Sheets URL pattern
export const SHEETS_URL_PATTERN = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
export const SHEETS_CSV_URL = (sheetId: string, gid: string = "0") =>
  "https://docs.google.com/spreadsheets/d/" + sheetId + "/export?format=csv&gid=" + gid;
export const SHEETS_PUBLIC_CSV = (sheetId: string) =>
  "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:csv";

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
