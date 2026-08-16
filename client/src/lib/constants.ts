// ========================================
// Pulseira Maker - Constantes do Sistema
// Design: Industrial Workshop
// ========================================
import { EXTRA_SYMBOLS } from "./symbolsData.ts";

export interface BraceletColor {
  name: string;
  hex: string;
  textColor: string;
  isLight: boolean; // true = personalização em preto, false = personalização em branco
  gradient?: boolean; // true = usar gradiente colorido (linearGradient) em vez de cor sólida
}

// Cores baseadas na tabela Pantone oficial do fornecedor
// isLight: cores claras recebem personalização preta, escuras recebem branca
export const BRACELET_COLORS: BraceletColor[] = [
  { name: "Branco", hex: "#FFFFFF", textColor: "#000000", isLight: true },
  { name: "Azul Royal", hex: "#003DA5", textColor: "#FFFFFF", isLight: false },
  { name: "Azul Claro", hex: "#00A3E0", textColor: "#FFFFFF", isLight: false },
  { name: "Azul Marinho", hex: "#00205B", textColor: "#FFFFFF", isLight: false },
  { name: "Vinho", hex: "#9B2335", textColor: "#FFFFFF", isLight: false },
  { name: "Laranja", hex: "#FE5000", textColor: "#FFFFFF", isLight: false },
  { name: "Preto", hex: "#000000", textColor: "#FFFFFF", isLight: false },
  { name: "Roxo", hex: "#582C83", textColor: "#FFFFFF", isLight: false },
  { name: "Lilás", hex: "#7B61A4", textColor: "#FFFFFF", isLight: false },
  { name: "Marrom", hex: "#6C4B2A", textColor: "#FFFFFF", isLight: false },
  { name: "Amarelo", hex: "#FEDD00", textColor: "#000000", isLight: true },
  { name: "Verde Limão", hex: "#44D62C", textColor: "#000000", isLight: true },
  { name: "Verde Água", hex: "#57C7C2", textColor: "#FFFFFF", isLight: false },
  { name: "Vermelho", hex: "#E4002B", textColor: "#FFFFFF", isLight: false },
  { name: "Rosa Claro", hex: "#F7BDD6", textColor: "#FFFFFF", isLight: false },
  { name: "Rosa Médio", hex: "#F38EB8", textColor: "#FFFFFF", isLight: false },
  { name: "Pink", hex: "#E6007E", textColor: "#FFFFFF", isLight: false },
  { name: "Colorido", hex: "#E6007E", textColor: "#FFFFFF", isLight: false, gradient: true },
  { name: "Mesclado Azul", hex: "#003DA5", textColor: "#FFFFFF", isLight: false, gradient: true },
  { name: "Mesclado Rosa", hex: "#E6007E", textColor: "#FFFFFF", isLight: false, gradient: true },
];

// Retorna a cor que o símbolo deve ter baseado na cor da pulseira
// Regras:
// - Autismo: sempre mantém cores originais (retorna null = usar original)
// - Alerta: sempre vermelho (#ED3237), exceto na pulseira vermelha onde fica branco
// - Pulseira clara (isLight): símbolo preto
// - Pulseira escura: símbolo branco
export function getSymbolColor(symbolId: string, braceletColorName: string): string | null {
  if (symbolId === "104") return null; // Autismo - sempre cores originais
  const color = BRACELET_COLORS.find((c) => c.name === braceletColorName);
  if (!color) return "#FFFFFF";
  // Alerta médico (108) e Gota (109): sempre vermelho, exceto em certas cores onde fica branco
  if (symbolId === "108" || symbolId === "109") {
    if (braceletColorName === "Vermelho" || braceletColorName === "Pink" || braceletColorName === "Rosa Médio" || braceletColorName === "Laranja") return "#FFFFFF";
    return "#ED3237"; // vermelho em todas as outras cores
  }
  return color.isLight ? "#000000" : "#FFFFFF";
}

export interface FontOption {
  name: string;
  family: string;
  label: string;
  svgFontSize?: number; // tamanho em SVG units para a frente (calculado de pt)
  fontYOffset?: number; // offset vertical extra em SVG units (1mm = 100 units)
}

// Fontes disponíveis para a FRENTE da pulseira
// svgFontSize: conversão de pt para SVG units (1pt ≈ 35.28 SVG units em 100 units/mm)
// Kids Station 24pt = 847, Comic Sans Negrito 18pt = 635, Calibri Negrito 20pt = 706,
// Milky Matcha 14pt = 494, Segoe Print Negrito 18pt = 635
export const FRONT_FONTS: FontOption[] = [
  { name: "Kids Station", family: "'Kids Station', 'Comic Sans MS', cursive", label: "Kids Station", svgFontSize: 847, fontYOffset: 70 },
  { name: "Comic Sans MS Negrito", family: "'Comic Sans MS', 'Comic Sans', cursive", label: "Comic Sans MS Negrito", svgFontSize: 635 },
  { name: "Calibri Negrito", family: "Calibri, 'Segoe UI', sans-serif", label: "Calibri Negrito", svgFontSize: 706, fontYOffset: 100 },
  { name: "Milky Matcha", family: "'Milky Matcha', 'Comic Sans MS', cursive", label: "Milky Matcha", svgFontSize: 494, fontYOffset: 20 },
  { name: "Segoe Print Negrito", family: "'Segoe Print', 'Bradley Hand', cursive", label: "Segoe Print Negrito", svgFontSize: 635 },
];

// Alias para compatibilidade (usado em imports existentes)
export const FRONT_BACK_FONTS = FRONT_FONTS;

// Fonte fixa do VERSO: sempre Calibri Negrito
export const VERSO_FONT: FontOption = {
  name: "Calibri Negrito",
  family: "Calibri, 'Segoe UI', sans-serif",
  label: "Calibri Negrito",
};

export const INSIDE_FONT: FontOption = {
  name: "Calibri",
  family: "Calibri, 'Segoe UI', sans-serif",
  label: "Calibri (Padrão Interno)",
};

export interface BraceletSize {
  name: string;
  cm: string;
  label: string;
  halfCm: number;
  sizePrefix: string;
}

export const BRACELET_SIZES: BraceletSize[] = [
  { name: "Bebê", cm: "11,5", label: "Bebê", halfCm: 6, sizePrefix: "12" },
  { name: "PP infantil", cm: "12,5", label: "PP infantil", halfCm: 6.5, sizePrefix: "13" },
  { name: "P infantil", cm: "13,5", label: "P infantil", halfCm: 7, sizePrefix: "14" },
  { name: "M infantil", cm: "14,5", label: "M infantil", halfCm: 7.5, sizePrefix: "15" },
  { name: "G infantil", cm: "15,5", label: "G infantil", halfCm: 8, sizePrefix: "16" },
  { name: "PP adulto", cm: "16,5", label: "PP adulto", halfCm: 8.5, sizePrefix: "17" },
  { name: "P adulto", cm: "17,5", label: "P adulto", halfCm: 9, sizePrefix: "18" },
  { name: "M adulto", cm: "18,5", label: "M adulto", halfCm: 9.5, sizePrefix: "19" },
  { name: "G adulto", cm: "19,5", label: "G adulto", halfCm: 10, sizePrefix: "20" },
  { name: "GG adulto", cm: "20,5", label: "GG adulto", halfCm: 10.5, sizePrefix: "21" },
];

export function getHalfWidthSvg(halfCm: number): number {
  return Math.round(halfCm * 10 * 100);
}

export function getSizeInfo(sizeName: string): BraceletSize {
  const size = BRACELET_SIZES.find((s) => s.name === sizeName || s.label === sizeName);
  return size || BRACELET_SIZES[7];
}

export function getHalfCmFromSize(sizeName: string): number {
  return getSizeInfo(sizeName).halfCm;
}

export function getSizePrefixFromSize(sizeName: string): string {
  return getSizeInfo(sizeName).sizePrefix;
}

// Tamanho máximo do símbolo: 7.5mm = 750 SVG units
export const SYMBOL_MAX_SIZE = 750;
// Tamanhos individuais de altura para símbolos específicos (em SVG units = mm * 100)
export const SYMBOL_CUSTOM_HEIGHT: Record<string, number> = {
  "123": 750,   // 7.5mm - Brasil
  "109": 600,   // 6mm - Gota
  "108": 800,   // 8mm - Alerta Médico
  "104": 700,   // 7mm - Autismo
  "124": 600,   // 6mm - WhatsApp
  "88": 650,    // 6.5mm - São Paulo FC
};

// Mantido para compatibilidade
export const AUTISMO_SYMBOL_SIZE = 700;

// ========================================
// Área máxima de personalização na FRENTE (em cm)
// Cada tamanho de pulseira tem um limite de largura para texto + símbolos
// ========================================
export const FRONT_MAX_AREA_CM: Record<string, number> = {
  "Bebê": 5.0,
  "PP infantil": 5.5,
  "P infantil": 6.0,
  "M infantil": 6.5,
  "G infantil": 7.0,
  "PP adulto": 7.5,
  "P adulto": 8.0,
  "M adulto": 8.5,
  "G adulto": 9.0,
  "GG adulto": 9.5,
};

// Converte cm para SVG units (1cm = 1000 SVG units, pois 1mm = 100 SVG units)
export function getFrontMaxWidthSvg(sizeName: string): number {
  const size = BRACELET_SIZES.find((s) => s.name === sizeName || s.label === sizeName);
  const name = size ? size.name : "M adulto";
  const cm = FRONT_MAX_AREA_CM[name] || 8.5;
  return Math.round(cm * 1000);
}

// ========================================
// Área máxima de personalização do VERSO (+1cm em relação à frente)
// ========================================
export const VERSO_MAX_AREA_CM: Record<string, number> = {
  "Bebê": 6.5,
  "PP infantil": 7.0,
  "P infantil": 7.5,
  "M infantil": 8.0,
  "G infantil": 8.5,
  "PP adulto": 9.0,
  "P adulto": 9.5,
  "M adulto": 10.0,
  "G adulto": 10.5,
  "GG adulto": 11.0,
};

export function getVersoMaxWidthSvg(sizeName: string): number {
  const size = BRACELET_SIZES.find((s) => s.name === sizeName || s.label === sizeName);
  const name = size ? size.name : "M adulto";
  const cm = VERSO_MAX_AREA_CM[name] || 9.5;
  return Math.round(cm * 1000);
}

// Fonte mínima: 12pt = 423 SVG units
export const MIN_FONT_SIZE_12PT = 423;
// Fonte fixa para dentro com 3 linhas: 11.6pt = 409 SVG units
export const FONT_SIZE_11_6PT = 409;
// Fonte mínima para dentro: 10pt = 353 SVG units (permite textos muito longos)
export const MIN_FONT_SIZE_10PT = 353;
// Alias mantido para compatibilidade
export const MIN_FONT_SIZE_11_5PT = MIN_FONT_SIZE_10PT;
// Alias para compatibilidade
export const FRONT_MIN_FONT_SIZE = MIN_FONT_SIZE_12PT;

// Estima largura de texto em SVG units (mesma fórmula usada em estW/estimateTextWidth)
function estimateTextWidthShared(text: string, fontSize: number): number {
  return Math.round(text.length * fontSize * 0.45);
}

// Calcula o tamanho de fonte ideal para a frente, reduzindo se necessário
// Retorna o fontSize em SVG units
export function calcFrontFontSize(
  textoFrente: string,
  fonteName: string,
  sizeName: string,
  simboloFrente?: string,
  simboloFrente2?: string,
  l2Frente?: string
): number {
  const maxWidth = getFrontMaxWidthSvg(sizeName);
  const fontInfo = FRONT_FONTS.find((f) => f.name === fonteName);
  const baseFontSize = fontInfo?.svgFontSize || 635;
  const symGap = 100;

  // Calcular largura dos símbolos
  let symbolsWidth = 0;
  if (simboloFrente) {
    symbolsWidth += getSymbolWidthForCalc(simboloFrente) + symGap;
  }
  if (simboloFrente2) {
    symbolsWidth += getSymbolWidthForCalc(simboloFrente2) + symGap;
  }

  const availableWidth = maxWidth - symbolsWidth;
  if (availableWidth <= 0) return FRONT_MIN_FONT_SIZE;

  // Verificar a linha mais larga (L1 ou L2)
  const textW1 = estimateTextWidthShared(textoFrente, baseFontSize);
  const textW2 = l2Frente ? estimateTextWidthShared(l2Frente, baseFontSize) : 0;
  const maxTextW = Math.max(textW1, textW2);
  if (maxTextW <= availableWidth) return baseFontSize;

  // Reduzir proporcionalmente
  const ratio = availableWidth / maxTextW;
  const newFontSize = Math.round(baseFontSize * ratio);

  // Não pode ser menor que 12pt
  return Math.max(newFontSize, FRONT_MIN_FONT_SIZE);
}

// Verifica se é possível adicionar mais um caractere ao texto da frente
// Retorna true se o texto com +1 caractere ainda cabe com fonte >= 12pt
export function canAddCharToFront(
  currentText: string,
  fonteName: string,
  sizeName: string,
  simboloFrente?: string,
  simboloFrente2?: string,
  otherLine?: string
): boolean {
  const testText = currentText + "M"; // M é largo mas mais realista que W
  const fontSize = calcFrontFontSize(testText, fonteName, sizeName, simboloFrente, simboloFrente2, otherLine);
  if (fontSize <= FRONT_MIN_FONT_SIZE) {
    // Verificar se mesmo com 12pt o texto cabe
    const maxWidth = getFrontMaxWidthSvg(sizeName);
    const symGap = 100;
    let symbolsWidth = 0;
    if (simboloFrente) symbolsWidth += getSymbolWidthForCalc(simboloFrente) + symGap;
    if (simboloFrente2) symbolsWidth += getSymbolWidthForCalc(simboloFrente2) + symGap;
    const availableWidth = maxWidth - symbolsWidth;
    const testW = estimateTextWidthShared(testText, FRONT_MIN_FONT_SIZE);
    const otherW = otherLine ? estimateTextWidthShared(otherLine, FRONT_MIN_FONT_SIZE) : 0;
    return Math.max(testW, otherW) <= availableWidth;
  }
  return true;
}

// Calcula largura renderizada de um símbolo (mesma lógica de getSymbolSize)
function getSymbolWidthForCalc(symbolId: string): number {
  const symbol = [...BRACKET_SYMBOLS_BASE, ...EXTRA_SYMBOLS].find((s) => s.id === symbolId);
  if (!symbol) return SYMBOL_MAX_SIZE;
  const vb = symbol.viewBox.split(" ").map(Number);
  const targetH = SYMBOL_CUSTOM_HEIGHT[symbolId] !== undefined ? SYMBOL_CUSTOM_HEIGHT[symbolId] : SYMBOL_MAX_SIZE;
  const sc = targetH / vb[3];
  return Math.round(vb[2] * sc);
}

// ========================================
// Auto-ajuste de fonte para VERSO
// Verso usa Calibri Negrito base 12pt (423 SVG units)
// Mesma área máxima da frente
// ========================================
export function calcVersoFontSize(
  textoVerso: string,
  l2Verso: string,
  sizeName: string,
  simboloVerso?: string,
  l3Verso?: string
): number {
  const has3Lines = !!(l3Verso && l3Verso.length > 0);

  // Se tem 3 linhas, forçar 11.6pt (409 SVG units)
  if (has3Lines) {
    return FONT_SIZE_11_6PT;
  }

  const maxWidth = getVersoMaxWidthSvg(sizeName);
  const baseFontSize = 423; // Calibri Negrito 12pt
  const symGap = 100;

  let symbolsWidth = 0;
  if (simboloVerso) {
    symbolsWidth += getSymbolWidthForCalc(simboloVerso) + symGap;
  }

  const availableWidth = maxWidth - symbolsWidth;
  if (availableWidth <= 0) return MIN_FONT_SIZE_12PT;

  // Verificar a linha mais larga (L1, L2 ou L3)
  const textW1 = estimateTextWidthShared(textoVerso, baseFontSize);
  const textW2 = l2Verso ? estimateTextWidthShared(l2Verso, baseFontSize) : 0;
  const maxTextW = Math.max(textW1, textW2);
  if (maxTextW <= availableWidth) return baseFontSize;

  const ratio = availableWidth / maxTextW;
  const newFontSize = Math.round(baseFontSize * ratio);
  return Math.max(newFontSize, MIN_FONT_SIZE_12PT);
}

export function canAddCharToVerso(
  currentText: string,
  otherLine: string,
  sizeName: string,
  simboloVerso?: string,
  thirdLine?: string
): boolean {
  const testText = currentText + "M";
  // Testar com a linha mais larga
  const maxWidth = getVersoMaxWidthSvg(sizeName);
  const symGap = 100;
  let symbolsWidth = 0;
  if (simboloVerso) symbolsWidth += getSymbolWidthForCalc(simboloVerso) + symGap;
  const availableWidth = maxWidth - symbolsWidth;
  // Se há 3 linhas, usar fonte fixa 11.6pt para validação
  const fontSize = (thirdLine && thirdLine.length > 0) ? FONT_SIZE_11_6PT : MIN_FONT_SIZE_12PT;
  const testW = estimateTextWidthShared(testText, fontSize);
  const otherW = otherLine ? estimateTextWidthShared(otherLine, fontSize) : 0;
  const thirdW = thirdLine ? estimateTextWidthShared(thirdLine, fontSize) : 0;
  return Math.max(testW, otherW, thirdW) <= availableWidth;
}

// ========================================
// Área máxima de personalização do DENTRO (+2,5cm em relação à frente)
// ========================================
export const DENTRO_MAX_AREA_CM: Record<string, number> = {
  "Bebê": 7.5,
  "PP infantil": 8.0,
  "P infantil": 8.5,
  "M infantil": 9.0,
  "G infantil": 9.5,
  "PP adulto": 10.0,
  "P adulto": 10.5,
  "M adulto": 11.0,
  "G adulto": 11.5,
  "GG adulto": 12.0,
};

export function getDentroMaxWidthSvg(sizeName: string): number {
  const size = BRACELET_SIZES.find((s) => s.name === sizeName || s.label === sizeName);
  const name = size ? size.name : "M adulto";
  const cm = DENTRO_MAX_AREA_CM[name] || 10.0;
  return Math.round(cm * 1000);
}

// ========================================
// Auto-ajuste de fonte para DENTRO (1 e 2)
// Dentro usa Calibri Negrito base 12pt (423 SVG units)
// Área máxima = frente + 2,5cm
// Suporta até 3 linhas, com fonte mínima de 11.5pt
// ========================================
export function calcDentroFontSize(
  l1Dentro: string,
  l2Dentro: string,
  sizeName: string,
  simboloDentro?: string,
  l3Dentro?: string
): number {
  const has3Lines = !!(l3Dentro && l3Dentro.length > 0);

  // Se tem 3 linhas, forçar 11.6pt (409 SVG units)
  if (has3Lines) {
    return FONT_SIZE_11_6PT;
  }

  const maxWidth = getDentroMaxWidthSvg(sizeName);
  const baseFontSize = 423; // Calibri Negrito 12pt
  const symGap = 100;

  let symbolsWidth = 0;
  if (simboloDentro) {
    symbolsWidth += getSymbolWidthForCalc(simboloDentro) + symGap;
  }

  const availableWidth = maxWidth - symbolsWidth;
  if (availableWidth <= 0) return MIN_FONT_SIZE_11_5PT;

  const textW1 = estimateTextWidthShared(l1Dentro, baseFontSize);
  const textW2 = l2Dentro ? estimateTextWidthShared(l2Dentro, baseFontSize) : 0;
  const maxTextW = Math.max(textW1, textW2);
  if (maxTextW <= availableWidth) return baseFontSize;

  const ratio = availableWidth / maxTextW;
  const newFontSize = Math.round(baseFontSize * ratio);
  return Math.max(newFontSize, MIN_FONT_SIZE_11_5PT);
}

export function canAddCharToDentro(
  currentText: string,
  otherLine: string,
  sizeName: string,
  simboloDentro?: string,
  thirdLine?: string
): boolean {
  const testText = currentText + "M";
  const maxWidth = getDentroMaxWidthSvg(sizeName);
  const symGap = 100;
  let symbolsWidth = 0;
  if (simboloDentro) symbolsWidth += getSymbolWidthForCalc(simboloDentro) + symGap;
  const availableWidth = maxWidth - symbolsWidth;
  // Se há 3 linhas (thirdLine preenchida ou currentText é a 3a linha sendo editada),
  // usar fonte fixa 11.6pt para validação
  const fontSize = (thirdLine && thirdLine.length > 0) ? FONT_SIZE_11_6PT : MIN_FONT_SIZE_11_5PT;
  const testW = estimateTextWidthShared(testText, fontSize);
  const otherW = otherLine ? estimateTextWidthShared(otherLine, fontSize) : 0;
  const thirdW = thirdLine ? estimateTextWidthShared(thirdLine, fontSize) : 0;
  return Math.max(testW, otherW, thirdW) <= availableWidth;
}

export interface BraceletOrder {
  id: string;
  nomeCliente: string;
  textoFrente: string;
  l2Frente?: string;        // linha 2 da frente (opcional)
  textoVerso: string;       // agora pode ser linha 1 do verso
  l1Verso?: string;         // alias para textoVerso (linha 1)
  l2Verso?: string;         // linha 2 do verso
  l3Verso?: string;         // linha 3 do verso (opcional)
  l1Dentro1: string;
  l2Dentro1: string;
  l1Dentro2: string;
  l2Dentro2: string;
  l3Dentro1?: string;  // linha 3 do dentro1 (opcional)
  l3Dentro2?: string;  // linha 3 do dentro2 (opcional)
  cor: string;
  corTexto: string;
  fonteFrente: string;
  fonteVerso: string;
  tamanho: string;
  tamanhoLabel: string;
  tamanhoCm: string;
  simboloFrente?: string;   // símbolo antes do texto na frente
  simboloFrente2?: string;  // símbolo depois do texto na frente (novo)
  simboloVerso?: string;
  simboloDentro1?: string;  // símbolo WhatsApp antes do texto no dentro1
  simboloDentro2?: string;  // símbolo WhatsApp antes do texto no dentro2
  // Offsets horizontais dos símbolos (em mm, positivo = direita, negativo = esquerda)
  offsetSimboloFrente?: number;
  offsetSimboloFrente2?: number;
  offsetSimboloVerso?: number;
  offsetSimboloDentro1?: number;
  offsetSimboloDentro2?: number;
  quantidade?: number;
}

// Símbolos SVG - inline paths extraídos dos SVGs originais do CorelDRAW
export interface SymbolPath {
  d: string;
  fill: string;
}

export interface BraceletSymbol {
  id: string;
  name: string;
  viewBox: string;
  paths: SymbolPath[];
  keepOriginalColors?: boolean; // se true, nunca muda as cores (ex: autismo)
  fillRule?: "nonzero" | "evenodd"; // fill-rule do SVG (default: evenodd)
}

// Todos os símbolos vêm do EXTRA_SYMBOLS (symbolsData.ts) - ordenados numericamente
const BRACKET_SYMBOLS_BASE: BraceletSymbol[] = [];

// Todos os símbolos vêm do EXTRA_SYMBOLS (symbolsData.ts) - ordenados numericamente
export const BRACELET_SYMBOLS: BraceletSymbol[] = [...BRACKET_SYMBOLS_BASE, ...EXTRA_SYMBOLS];

// Google Sheets URL pattern
export const SHEETS_URL_PATTERN = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
export const SHEETS_CSV_URL = (sheetId: string, gid: string = "0") =>
  "https://docs.google.com/spreadsheets/d/" + sheetId + "/export?format=csv&gid=" + gid;
export const SHEETS_PUBLIC_CSV = (sheetId: string, gid: string = "0") =>
  "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:csv&gid=" + gid;

// Expected column headers in the Google Sheet
export const EXPECTED_COLUMNS = [
  "NOME_CLIENTE",
  "TEXTO_FRENTE",
  "L2_FRENTE",
  "TEXTO_VERSO",
  "L2_VERSO",
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
  "SIMBOLO_FRENTE2",
  "SIMBOLO_VERSO",
  "SIMBOLO_DENTRO1",
  "SIMBOLO_DENTRO2",
  "QUANTIDADE",
  "L3_DENTRO1",
  "L3_DENTRO2",
  "L3_VERSO",
];
