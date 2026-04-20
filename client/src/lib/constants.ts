// ========================================
// Pulseira Maker - Constantes do Sistema
// Design: Industrial Workshop
// ========================================
import { EXTRA_SYMBOLS } from "./symbolsData";

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
  if (symbolId === "autismo") return null; // sempre cores originais
  const color = BRACELET_COLORS.find((c) => c.name === braceletColorName);
  if (!color) return "#FFFFFF";
  // Alerta médico e Gota: sempre vermelho, exceto em certas cores onde fica branco
  if (symbolId === "alerta" || symbolId === "gota") {
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
  brasil: 400,   // 4mm de altura
  gota: 600,     // 6mm de altura
  alerta: 600,   // 6mm de altura
  autismo: 700,  // 7mm de altura
  whatsapp: 600, // 6mm de altura
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

// Fonte mínima: 12pt = 423 SVG units
export const MIN_FONT_SIZE_12PT = 423;
// Fonte mínima para dentro: 11.5pt = 406 SVG units
export const MIN_FONT_SIZE_11_5PT = 406;
// Alias para compatibilidade
export const FRONT_MIN_FONT_SIZE = MIN_FONT_SIZE_12PT;

// Estima largura de texto em SVG units (mesma fórmula usada em estW/estimateTextWidth)
function estimateTextWidthShared(text: string, fontSize: number): number {
  return Math.round(text.length * fontSize * 0.55);
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
  const testText = currentText + "W"; // W é um dos caracteres mais largos
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
  simboloVerso?: string
): number {
  const maxWidth = getFrontMaxWidthSvg(sizeName);
  const baseFontSize = 423; // Calibri Negrito 12pt
  const symGap = 100;

  let symbolsWidth = 0;
  if (simboloVerso) {
    symbolsWidth += getSymbolWidthForCalc(simboloVerso) + symGap;
  }

  const availableWidth = maxWidth - symbolsWidth;
  if (availableWidth <= 0) return MIN_FONT_SIZE_12PT;

  // Verificar a linha mais larga (L1 ou L2)
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
  simboloVerso?: string
): boolean {
  const testText = currentText + "W";
  // Testar com a linha mais larga
  const maxWidth = getFrontMaxWidthSvg(sizeName);
  const symGap = 100;
  let symbolsWidth = 0;
  if (simboloVerso) symbolsWidth += getSymbolWidthForCalc(simboloVerso) + symGap;
  const availableWidth = maxWidth - symbolsWidth;
  const testW = estimateTextWidthShared(testText, MIN_FONT_SIZE_12PT);
  const otherW = estimateTextWidthShared(otherLine, MIN_FONT_SIZE_12PT);
  return Math.max(testW, otherW) <= availableWidth;
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
  const textW3 = l3Dentro ? estimateTextWidthShared(l3Dentro, baseFontSize) : 0;
  const maxTextW = Math.max(textW1, textW2, textW3);
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
  const testText = currentText + "W";
  const maxWidth = getDentroMaxWidthSvg(sizeName);
  const symGap = 100;
  let symbolsWidth = 0;
  if (simboloDentro) symbolsWidth += getSymbolWidthForCalc(simboloDentro) + symGap;
  const availableWidth = maxWidth - symbolsWidth;
  const testW = estimateTextWidthShared(testText, MIN_FONT_SIZE_11_5PT);
  const otherW = estimateTextWidthShared(otherLine, MIN_FONT_SIZE_11_5PT);
  const thirdW = thirdLine ? estimateTextWidthShared(thirdLine, MIN_FONT_SIZE_11_5PT) : 0;
  return Math.max(testW, otherW, thirdW) <= availableWidth;
}

export interface BraceletOrder {
  id: string;
  nomeCliente: string;
  textoFrente: string;
  l2Frente?: string;        // linha 2 da frente (opcional)
  textoVerso: string;       // agora pode ser linha 1 do verso
  l1Verso?: string;         // alias para textoVerso (linha 1)
  l2Verso?: string;         // linha 2 do verso (novo)
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
}

const BRACKET_SYMBOLS_BASE: BraceletSymbol[] = [
  {
    id: "alerta",
    name: "Alerta Médico",
    viewBox: "10104 14475 784 751",
    keepOriginalColors: false,
    paths: [
      {
        d: "M10244.08 14627.51c9.83,0.82 33.63,16.62 42.68,22.07 22.86,13.75 110.06,67.76 126.54,67.76 13.44,0 22.98,-14.81 22.98,-29.25l0 -167.13 133.71 0 0 181.75c0,12.07 10.2,20.9 25.06,20.9 13.63,0 131.11,-73.11 158.78,-87.74 19.17,36.22 47.68,80.76 66.85,116.99 -23.86,15.97 -90.59,51.17 -119.48,68.53 -13.48,8.1 -29.7,13.36 -32.36,32.54 -2.6,18.63 14.6,25.94 27.92,33.29 14.36,7.94 26.55,14.59 40.25,22.42 14.66,8.39 73.62,44.01 81.58,45.86 -0.79,9.51 -28.17,50.66 -33.4,58.52 -6.13,9.21 -33.5,50.85 -35.54,58.47l-115.28 -66.47c-9.09,-5.5 -31.15,-19.18 -43.49,-19.18 -12.01,0 -20.89,13.85 -20.89,27.15l0 165.05 -133.71 0 0 -156.69c0,-32.57 -26.95,-30.65 -46.65,-19.49l-120.89 69.23c-7.25,4.41 -13.74,8.79 -22.57,10.84l-22.89 -43.96c-2.94,-5.09 -4.82,-9.62 -8.04,-14.93 -11.85,-19.48 -21.11,-40.09 -31.74,-60.18 7.55,-1.76 90.24,-50.47 107.19,-59.94 52.33,-29.28 86.1,-41.79 24.03,-81.74l-135.4 -77.68c3.15,-13.53 61.85,-106.09 64.76,-116.99zm-119.08 128.76l0 -6.65c0.85,-6.57 4.07,-14.46 9.78,-24.59l66.63 -117.21c24.29,-40.98 29.75,-48.93 76.08,-17.89 19.95,13.37 68.23,38.4 92.85,53.38 6.48,3.94 10.79,7.61 17.89,9.26 0,-33.42 0,-66.85 0,-100.27 0,-30.72 -7.5,-77.3 20.89,-77.3l185.93 0c24.09,0 20.98,23.28 20.91,33.41 -0.22,32.65 -0.15,67.58 -0.02,100.29 0.06,17.41 0,34.82 0,52.23l63.4 -36.89c40.41,-22.01 85,-61.78 103.72,-32.03 21.36,33.96 49.53,88.45 71.45,124.92 4.32,7.2 8.31,14.29 12.15,21.28 21.69,39.51 0.03,41.66 -55.22,74.34 -12.58,7.44 -23.23,13.44 -36,20.41l-36.23 20.18 107.72 65.66c20.1,12.02 28.07,15.28 28.07,32.52 0,13.21 -69.96,119.74 -81.9,139.56 -7.73,12.85 -17.2,38.02 -35.09,38.02 -15.53,0 -128.68,-74.18 -142.07,-77.3 0,32.03 0,64.07 0,96.1 0,26.96 8.51,77.3 -18.8,77.3l-192.19 0 -0.21 0c-4.42,-0.21 -11.05,-6.81 -12.72,-10.06 -5.04,-9.79 -3.79,-141.08 -3.79,-154.98 -8.67,0.72 -100.1,56.12 -110.84,62.56 -16.24,9.73 -39.43,26.51 -55.67,9.93 -6.24,-6.35 -27.9,-47.64 -32.68,-57.14 -4.65,-9.25 -8.09,-14.19 -12.54,-22.98 -44.92,-88.65 -71.88,-94.54 -15.87,-128.05l79.16 -46.18c6.49,-3.74 12.96,-6.97 20.12,-11.23 6.33,-3.75 13.96,-6.68 17.6,-11.65 -6.44,-1.72 -14.09,-7.42 -20.23,-11.1l-59.28 -34.74c-44.73,-26.93 -70.37,-35.07 -73,-53.11zm376.02 -193.63c-8.17,-1.9 -9.71,-4.06 -20.31,-4.06 1.92,23.24 14.62,24.36 7.76,71.02l-9.8 0.06c-20.24,0 -36.54,33.12 -36.54,54.84 0,38.32 13.39,60.34 37.1,84.74 11,11.34 7.58,10.33 7.58,31 -12.28,1.03 -26.4,17.51 -26.4,30.48l0 18.26c0,14.03 16.71,31.8 28.43,34.53l0 10.16c-26.4,2.18 -44.69,40.43 -16.3,77.22 13.84,17.94 12.22,4.58 12.22,36.5 -27.02,6.3 -38.69,67.8 2.05,89.35 0,32.94 -6.64,69.05 22.34,69.05 8.14,-34.96 8.11,-8.04 8.11,-58.9 22.8,0 29.14,2.82 34.52,-20.3 -12.7,-2.97 -22.8,-7.43 -34.52,-10.16l0 -40.62c17.79,-4.74 25.11,-28.6 19.49,-49.92 -7.41,-28.11 -17.93,-20 -19.55,-35.29 -0.54,-5.1 0.06,-14.78 0.06,-20.38 31.74,-2.64 42.38,-70.28 4.07,-79.2l2.37 -16.2c25.33,-2.38 45.75,-41.58 5.28,-80.83 -4.48,-4.35 -8.76,-6.57 -11.72,-10.61 7.25,-31.13 40.61,-20.4 40.61,-52.79 -11.39,-3.05 0.92,-4.07 -16.24,-4.07 0,-22.28 15.24,-12.58 3.01,-31.37 -6.14,-9.47 -13.6,-12.61 -25.35,-15.34 0,-10.17 1.75,-15.77 3.2,-25.23 1.5,-9.66 2.05,-15.31 3.75,-24.68 3.61,-20.02 9.31,-35.98 9.31,-55.69 -28.16,0 -23.18,4.76 -34.53,28.43z",
        fill: "#ED3237",
      },
    ],
  },
  {
    id: "brasil",
    name: "Brasil",
    viewBox: "10127 14600 746 501",
    keepOriginalColors: false,
    paths: [
      {
        d: "M10849.34 14600l-698.7 0c-6.07,0 -11.7,3.17 -15.85,8.24 -4.57,5.59 -7.39,13.45 -7.39,22.22l0 439.1c0,8.76 2.82,16.62 7.39,22.21 4.14,5.08 9.76,8.24 15.85,8.24l698.7 0c6.09,0 11.71,-3.16 15.86,-8.24 4.57,-5.59 7.4,-13.45 7.4,-22.21l0 -439.1c0,-8.77 -2.83,-16.63 -7.4,-22.22 -4.15,-5.07 -9.77,-8.24 -15.86,-8.24zm-27.4 233.52c2.51,1.53 4.47,3.58 5.89,5.95 1.92,3.32 2.74,7.09 2.52,11.18 -0.21,3.48 -1.23,6.8 -3.05,9.8 -1.74,2.84 -4.36,5.45 -7.79,7.51l-303.63 183.58c-4.38,2.65 -9.74,4.18 -14.84,4.5 -5.3,0.32 -10.58,-0.66 -14.52,-3.04l-308.48 -186.52c-2.5,-1.52 -4.47,-3.56 -5.85,-5.9 -1.95,-3.35 -2.79,-7.17 -2.56,-11.22 0.21,-3.48 1.23,-6.79 3.05,-9.79 1.73,-2.84 4.36,-5.45 7.79,-7.52l303.64 -183.58c4.37,-2.65 9.74,-4.18 14.83,-4.49 5.29,-0.33 10.57,0.65 14.5,3.03l308.5 186.51zm-201.25 38.55c0.38,-4.35 1.93,-9.11 2.25,-13.54 1.23,-16.36 1.07,-27.38 -3.39,-43.69 -7.3,-26.64 -21.41,-43.49 -40.58,-59.72 -30.21,-25.57 -75.92,-32.04 -114.33,-21.97 -19.5,5.12 -31.81,13.05 -46.72,24.62 -6.31,4.92 -13.79,11.92 -17.65,18.92 10.76,2.42 22.57,3.35 33.58,5.84 52.86,11.94 71.17,18.55 116.89,41.27 11.67,5.82 37.29,22.47 47.52,30.57l22.43 17.7zm-126.92 99.53c42.63,1.11 61.32,-8.67 88.91,-27.67 8.59,-5.93 26.67,-26.97 29.46,-37.08l-20.53 -18.05c-7.55,-5.85 -14.99,-11.45 -22.88,-17.02l-24.91 -15.23c-16.24,-9.08 -37.09,-19.16 -55.23,-25.63 -10.4,-3.7 -20.54,-7.09 -30.76,-10.01 -11.78,-3.36 -54.91,-13.44 -68.21,-14.06 -1.18,4.21 -3.65,8.02 -5.48,12.56 -6.65,16.56 -6.66,29.51 -6.6,46.24 0.14,23.78 17.96,57.4 35.16,72.33l10.06 8.15c18.34,13.7 43.54,24.73 71.01,25.47z",
        fill: "#373435",
      },
    ],
  },
  {
    id: "autismo",
    name: "Autismo",
    viewBox: "10003 14504 994 678",
    keepOriginalColors: true, // SEMPRE mantém as cores originais
    paths: [
      {
        d: "M10040.94 14660.68c-9.67,-0.42 -18.36,3.34 -24.89,9.6 -3.59,3.44 -6.56,7.66 -8.66,12.36 -2.14,4.74 -3.43,9.95 -3.67,15.31 -0.49,11.27 3.58,23.52 13.92,34.31 0.92,0.97 1.93,1.89 2.98,2.74 6.76,5.47 15.79,8.44 24.75,8.51 8.73,0.06 17.32,-2.68 23.48,-8.58 0.81,-0.75 1.6,-1.63 2.38,-2.59l8.81 -10.86 5.5 12.86 6.18 15.25c4.76,11.93 9.99,25.02 14.73,33.55 2.98,5.37 6.39,8.57 10.31,9.66 4.24,1.19 9.77,0.26 16.68,-2.69l52.52 -22.44c3.33,-1.42 4.99,-2.52 5.37,-3.4 0.23,-0.53 -0.16,-1.83 -0.97,-3.72 -0.22,-0.52 -2.47,-1.5 -5.05,-2.61 -7.15,-3.1 -15.57,-6.74 -20.63,-18.59 -3.96,-9.26 -4.09,-18.44 -1.59,-26.24 1.88,-5.88 5.29,-10.99 9.72,-14.82 4.52,-3.88 10.07,-6.46 16.17,-7.17 7.25,-0.85 15.14,0.89 22.74,6.06 4.84,3.29 8.48,7.39 11.04,12.25 2.42,4.6 3.83,9.85 4.37,15.66 0.73,8 -1.39,12.6 -3.35,16.84 -0.8,1.72 -1.54,3.35 -1.42,4.63 0.05,0.59 0.2,1.16 0.41,1.67 0.26,0.61 0.68,1.07 1.16,1.34 0.61,0.37 1.48,0.51 2.48,0.42 0.77,-0.08 1.68,-0.32 2.68,-0.75l60.01 -25.64c3.86,-1.64 7.15,-3.27 9.64,-5.02 2.02,-1.43 3.57,-2.99 4.51,-4.78 1.24,-2.35 1.85,-4.3 1.95,-6.26 0.09,-2.38 -0.37,-5.24 -1.29,-9.03 -0.79,-3.24 -2.08,-6.95 -3.61,-10.56 -1.68,-3.97 -3.65,-7.89 -5.53,-11.02 -3.09,-5.18 -6.27,-13.09 -9.05,-20.01l-8.11 -19.19 13.37 0.58c5.37,0.23 10.36,-0.75 14.83,-2.66 6.74,-2.88 12.3,-7.92 16.24,-14.03 4.05,-6.26 6.44,-13.62 6.76,-20.96 0.23,-5.31 -0.64,-10.69 -2.77,-15.67l-0.29 -0.68c-2.68,-6.26 -5.78,-11.7 -9.7,-16.17 -3.7,-4.21 -8.27,-7.61 -14.13,-10.08 -6.84,-2.89 -14.94,-3.57 -22.64,-1.9 -7.14,1.54 -13.88,5.1 -18.81,10.73l-8.82 10.08 -8.39 -19.41c-2.92,-6.4 -6.14,-13.51 -7.8,-19.03 -3.96,-13.15 -8.23,-23.71 -14.29,-29.02 -4.99,-4.38 -12.31,-5.06 -23.63,-0.22l-57.2 24.44c-3.35,1.43 -5.4,2.71 -6.04,3.89 -0.31,0.61 -0.09,1.79 0.69,3.63 0.4,0.93 3.33,2.32 6.51,3.82 7.01,3.31 14.74,6.96 18.78,16.43 6.97,16.32 3.57,29.98 -4.46,38.87 -3.18,3.51 -7.06,6.25 -11.28,8.05 -4.19,1.79 -8.82,2.7 -13.5,2.62 -11.97,-0.21 -24.11,-6.85 -30.49,-21.79 -5.64,-13.19 -2.57,-20.87 0.2,-27.86 1.13,-2.84 2.18,-5.48 1.03,-8.17 -0.25,-0.59 -0.63,-0.9 -1.03,-0.98 -1.8,-0.36 -4.49,0.32 -7.3,1.52l-10.47 4.34c-16.74,6.94 -43.34,17.97 -50.14,22.71 -0.79,0.53 -1.35,1.09 -1.84,1.7 -0.65,0.81 -1.37,1.97 -2.22,3.35 -1.03,1.67 -1.61,3.66 -1.8,5.72 -0.23,2.49 0.1,5.13 0.86,7.63 2.84,9.31 8.9,22.55 14.34,34.48l6.88 15.28 5.26 12.31 -13.38 -0.6z",
        fill: "#FFF688",
      },
      {
        d: "M10959.35 14679.44c9.59,-0.42 18.21,3.31 24.69,9.51 3.56,3.42 6.5,7.61 8.59,12.26 2.12,4.71 3.4,9.88 3.64,15.2 0.49,11.17 -3.55,23.32 -13.81,34.03 -0.91,0.96 -1.92,1.87 -2.96,2.72 -6.7,5.42 -15.66,8.37 -24.54,8.43 -8.66,0.06 -17.19,-2.65 -23.3,-8.51 -0.8,-0.74 -1.58,-1.61 -2.36,-2.56l-8.74 -10.77 -5.4 12.76 -6.13 15.12c-4.72,11.83 -9.91,24.82 -14.61,33.28 -2.95,5.33 -6.34,8.5 -10.23,9.58 -4.21,1.18 -9.69,0.25 -16.55,-2.67l-52.08 -22.25c-3.3,-1.41 -4.95,-2.5 -5.33,-3.37 -0.23,-0.53 0.16,-1.81 0.96,-3.69 0.22,-0.52 2.45,-1.49 5.01,-2.59 7.09,-3.07 15.44,-6.69 20.47,-18.43 3.93,-9.19 4.06,-18.29 1.58,-26.03 -1.86,-5.83 -5.25,-10.9 -9.64,-14.7 -4.49,-3.85 -9.99,-6.41 -16.04,-7.11 -7.19,-0.84 -15.02,0.88 -22.55,6.01 -4.8,3.26 -8.41,7.33 -10.95,12.15 -2.4,4.56 -3.8,9.77 -4.34,15.53 -0.72,7.94 1.38,12.5 3.32,16.7 0.79,1.71 1.53,3.33 1.41,4.59 -0.05,0.59 -0.2,1.15 -0.41,1.66 -0.26,0.6 -0.67,1.06 -1.15,1.33 -0.61,0.37 -1.47,0.51 -2.46,0.42 -0.77,-0.08 -1.67,-0.32 -2.66,-0.75l-59.52 -25.43c-3.83,-1.63 -7.09,-3.24 -9.56,-4.98 -2.01,-1.42 -3.54,-2.97 -4.47,-4.74 -1.23,-2.33 -1.84,-4.27 -1.94,-6.21 -0.09,-2.36 0.37,-5.2 1.28,-8.96 0.78,-3.22 2.06,-6.9 3.58,-10.48 1.66,-3.94 3.62,-7.83 5.49,-10.93 3.07,-5.14 6.22,-12.99 8.98,-19.85l8.04 -19.03 -13.27 0.58c-5.33,0.23 -10.28,-0.75 -14.71,-2.64 -6.69,-2.86 -12.2,-7.86 -16.11,-13.91 -4.01,-6.21 -6.39,-13.52 -6.71,-20.79 -0.23,-5.27 0.63,-10.61 2.75,-15.54l0.29 -0.67c2.66,-6.21 5.73,-11.61 9.62,-16.04 3.67,-4.18 8.2,-7.55 14.01,-9.99 6.79,-2.87 14.82,-3.54 22.47,-1.89 7.08,1.53 13.77,5.06 18.66,10.64l8.75 10 8.32 -19.25c2.9,-6.35 6.09,-13.4 7.74,-18.88 3.93,-13.04 8.16,-23.52 14.18,-28.78 4.95,-4.35 12.21,-5.02 23.44,-0.22l56.72 24.24c3.32,1.42 5.35,2.69 5.99,3.86 0.31,0.6 0.09,1.78 -0.68,3.6 -0.4,0.92 -3.3,2.3 -6.46,3.79 -6.95,3.28 -14.62,6.9 -18.63,16.3 -6.91,16.19 -3.54,29.74 4.42,38.56 3.16,3.48 7.01,6.2 11.19,7.99 4.16,1.78 8.75,2.68 13.39,2.6 11.88,-0.21 23.92,-6.8 30.24,-21.61 5.59,-13.09 2.55,-20.71 -0.2,-27.64 -1.12,-2.82 -2.16,-5.44 -1.02,-8.11 0.25,-0.58 0.63,-0.89 1.02,-0.97 1.79,-0.36 4.46,0.32 7.24,1.51l10.38 4.31c16.61,6.89 42.98,17.83 49.73,22.52 0.78,0.53 1.34,1.08 1.82,1.69 0.65,0.8 1.36,1.95 2.2,3.32 1.02,1.66 1.6,3.63 1.79,5.67 0.23,2.47 -0.1,5.09 -0.85,7.57 -2.82,9.23 -8.83,22.37 -14.22,34.2l-6.82 15.16 -5.22 12.21 13.27 -0.6z",
        fill: "#009FE3",
      },
      {
        d: "M10608.01 15031.62c8.55,-3.94 17.76,-3.77 25.95,-0.55 4.5,1.78 8.73,4.49 12.36,7.93 3.67,3.49 6.76,7.7 8.95,12.44 4.61,9.97 5.46,22.5 0.14,36.03 -0.48,1.21 -1.05,2.41 -1.68,3.57 -4.07,7.41 -11.1,13.42 -19.14,16.78 -7.84,3.28 -16.59,3.99 -24.31,0.95 -1,-0.38 -2.04,-0.88 -3.1,-1.45l-11.94 -6.53 -0.2 13.6 0.06 16.02c0.12,12.5 0.24,26.21 -0.88,35.64 -0.7,5.93 -2.59,10.07 -5.72,12.51 -3.38,2.63 -8.69,3.84 -16.01,3.73l-55.57 -0.82c-3.52,-0.05 -5.42,-0.43 -6.08,-1.08 -0.4,-0.4 -0.54,-1.71 -0.51,-3.7 0.01,-0.56 1.68,-2.27 3.59,-4.22 5.29,-5.44 11.53,-11.82 11.72,-24.35 0.14,-9.81 -3.13,-18.11 -8.26,-24.22 -3.86,-4.59 -8.82,-7.94 -14.22,-9.75 -5.5,-1.83 -11.45,-2.1 -17.21,-0.49 -6.83,1.91 -13.3,6.39 -18.24,13.85 -3.13,4.74 -4.9,9.78 -5.41,15.1 -0.49,5.04 0.19,10.28 1.85,15.71 2.29,7.48 5.89,10.84 9.22,13.93 1.36,1.25 2.63,2.44 2.99,3.64 0.18,0.56 0.25,1.12 0.25,1.66 -0.01,0.65 -0.22,1.22 -0.55,1.63 -0.42,0.56 -1.15,1.01 -2.08,1.29 -0.72,0.22 -1.63,0.34 -2.69,0.32l-63.49 -0.93c-4.08,-0.06 -7.64,-0.32 -10.53,-0.97 -2.35,-0.54 -4.32,-1.38 -5.83,-2.64 -1.98,-1.66 -3.25,-3.18 -4.07,-4.91 -0.96,-2.11 -1.59,-4.86 -2.17,-8.61 -0.48,-3.21 -0.68,-7.03 -0.64,-10.84 0.05,-4.2 0.38,-8.45 0.91,-11.97 0.87,-5.79 0.82,-14.09 0.77,-21.35l0.22 -20.27 -11.83 5.46c-4.75,2.19 -9.6,3.15 -14.33,3.08 -7.13,-0.11 -14,-2.59 -19.8,-6.64 -5.96,-4.15 -10.83,-9.89 -13.83,-16.37 -2.16,-4.7 -3.36,-9.86 -3.29,-15.14l0.01 -0.72c0.11,-6.63 0.89,-12.66 2.77,-18.13 1.78,-5.16 4.64,-9.91 9,-14.3 5.09,-5.12 12.14,-8.72 19.69,-10.06 7,-1.25 14.37,-0.54 20.89,2.71l11.66 5.82 0.39 -20.56c0.27,-6.85 0.54,-14.44 0,-20.02 -1.29,-13.3 -1.34,-24.39 2.15,-31.4 2.88,-5.78 9.22,-9.1 21.21,-8.92l60.51 0.89c3.54,0.06 5.86,0.45 6.88,1.28 0.5,0.44 0.74,1.58 0.71,3.52 -0.02,0.98 -2.14,3.32 -4.45,5.84 -5.09,5.57 -10.7,11.71 -10.85,21.73 -0.25,17.26 7.86,28.3 18.37,33.34 4.16,1.99 8.66,3.03 13.13,3.09 4.43,0.07 8.93,-0.82 13.11,-2.62 10.71,-4.61 19.19,-15.06 19.42,-30.87 0.21,-13.96 -5.39,-19.74 -10.47,-25.01 -2.07,-2.14 -3.98,-4.13 -3.94,-6.98 0.01,-0.62 0.24,-1.04 0.57,-1.26 1.49,-0.99 4.16,-1.37 7.13,-1.32l11.03 0.04c17.63,0.07 45.65,0.18 53.53,1.94 0.9,0.19 1.61,0.48 2.28,0.85 0.88,0.49 1.96,1.27 3.24,2.2 1.54,1.12 2.79,2.7 3.72,4.49 1.13,2.15 1.8,4.65 2.04,7.18 0.88,9.43 0.32,23.59 -0.18,36.33l-0.56 16.3 -0.19 13.02 11.83 -5.47z",
        fill: "#ED3237",
      },
    ],
  },
  {
    id: "bola",
    name: "Bola de Futebol",
    viewBox: "10124 14474 751 751",
    keepOriginalColors: false,
    paths: [
      {
        d: "M10875.01 14885.06l0 -0.79 0 -47.42c-0.11,-1.61 -0.24,-3.2 -0.39,-4.77l-0.77 -6.87c-0.48,-3.49 0.3,-6.25 -0.41,-9.16l-0.73 -3.56c-0.38,-2.21 0.05,0.16 -0.46,-1.78l-0.39 -3.54c0.02,-1.57 0.12,-2.27 0.06,-3.55l-1.49 -5.32c-0.03,-0.11 -0.11,-0.36 -0.13,-0.45 -0.03,-0.1 -0.08,-0.35 -0.1,-0.44 -1.04,-5.39 -0.88,-11.83 -2.7,-16.88l-13.1 -47.76c-0.8,-2.21 0.16,-0.03 -0.68,-1.97 -0.91,-2.07 -0.03,0 -0.93,-1.74l-5.42 -14.16c-0.06,-0.11 -0.15,-0.37 -0.2,-0.49l-2.39 -4.87c-0.09,-0.17 -0.37,-0.69 -0.48,-0.88 -1.18,-2.27 -0.39,-0.32 -1.01,-2.29 -0.28,-0.9 -1.03,-2.97 -1.49,-4.36l-1.57 -4.85c-0.06,-0.13 -0.15,-0.37 -0.21,-0.5 -0.08,-0.2 -0.29,-0.72 -0.38,-0.91 -0.05,-0.1 -0.16,-0.35 -0.2,-0.45l-2.25 -4.41c-0.06,-0.1 -0.2,-0.34 -0.25,-0.43 -0.1,-0.19 -0.37,-0.7 -0.46,-0.9l-0.42 -0.89c-0.05,-0.09 -0.15,-0.33 -0.21,-0.43l-1.16 -2.23c-0.04,-0.1 -0.16,-0.34 -0.21,-0.43l-30.23 -49.84c-0.1,-0.15 -0.4,-0.59 -0.51,-0.76l-4.9 -7.1c-3.28,-3.34 -2.39,-3.93 -5.27,-7.19l-2.29 -3.48c-2.69,-4.55 -9.33,-9.51 -12.48,-14.16l-19.71 -21.68c-0.72,-0.8 -0.94,-1.08 -1.72,-1.88 -4.52,-4.65 -9.34,-10.11 -14.54,-13.84l-13.84 -11.67c-0.04,-0.01 -0.19,-0.17 -0.22,-0.19l-3.32 -2.9c-1.54,-1.1 -0.6,-0.29 -2,-1.53 -1.39,-1.25 -2.18,-2.44 -3.59,-3.59l-18.65 -12.57c-0.04,-0.01 -0.23,-0.14 -0.28,-0.16l-0.7 -0.54c-0.06,-0.04 -0.24,-0.19 -0.3,-0.24l-17.58 -10.39c-0.12,-0.08 -0.46,-0.41 -0.62,-0.52l-12.21 -7.16c-1.67,-0.97 -2.92,-1.43 -4.8,-2.37l-54.29 -21.75c-0.22,-0.07 -0.9,-0.33 -1.16,-0.4l-6.79 -1.03c-0.1,-0.02 -0.35,-0.11 -0.46,-0.13l-7.19 -1.77c-0.1,-0.03 -0.34,-0.1 -0.44,-0.14l-16.96 -3.85c-1.77,-0.4 -1.9,-0.08 -4.38,-0.56l-4.07 -1.06c-0.08,-0.03 -0.33,-0.11 -0.42,-0.13l-20.58 -3.27c-0.1,-0.01 -0.36,-0.08 -0.45,-0.09 -0.09,0 -0.35,-0.04 -0.45,-0.04 -0.09,0 -0.35,0 -0.45,0l-3.11 -0.11c-6.27,-1.16 -15.07,-0.13 -22.01,-1.31l-15.13 -0.93c-1.25,-0.1 -2.5,-0.18 -3.76,-0.25l-28.35 0c-2.81,0.12 -5.63,0.25 -8.41,0.4l-8 0.93c-0.76,0.01 -9.08,0.55 -10.85,0.98 -0.11,0.04 -0.35,0.12 -0.46,0.14l-40.98 7.66c-0.21,0.07 -0.81,0.17 -1.05,0.22l-18.14 4.92c-1.86,0.63 0.01,-0.08 -2.07,0.56l-14.49 4.93c-3.47,1.04 -8.51,2.08 -12.02,4.79l-17.9 7.1c-3.41,2.36 -10.55,4.3 -13.99,6.89l-40.28 25.61c-0.51,0.32 -1.11,0 -2.8,2.49 -1.34,1.96 0.36,0.06 -2.21,1.92l-4.95 5.24c-0.03,0.06 -0.14,0.29 -0.18,0.34 -0.03,0.05 -0.13,0.24 -0.16,0.28l-3.24 2.4c-3.22,2.98 -5.66,6.37 -9.22,8.74 -0.22,0.14 -0.91,0.54 -1.12,0.69 -0.16,0.1 -0.39,0.24 -0.53,0.34l-2.36 2.52c-0.08,0.07 -0.26,0.26 -0.34,0.33 -0.08,0.09 -0.29,0.24 -0.39,0.33l-24.55 22.71c-0.04,0.05 -0.24,0.23 -0.28,0.29l-5.82 5.2c-5.61,3.87 -19.21,18.05 -24.28,24.68l-12.36 16.81c-0.85,0.93 -0.92,0.91 -1.7,1.89 -0.14,0.18 -0.51,0.71 -0.63,0.9l-1.38 2.53c-0.05,0.1 -0.19,0.33 -0.25,0.44 -0.05,0.08 -0.18,0.32 -0.23,0.42l-19.6 35c-0.96,1.7 -0.19,0.14 -1.21,2.34 -0.11,0.26 -0.61,1.49 -0.91,2.16l-5.7 11.55c-0.05,0.1 -0.17,0.35 -0.22,0.45l-16.38 43.59c0,0 -0.75,1.68 -1.02,2.4l-3.67 12.58c-0.35,2.61 -1.6,2.48 -1.87,5.33l-1.11 5.69c-1.33,3.63 0.13,2.95 -1.39,5.85l-2.8 13.76c-0.13,1.84 -0.2,1.49 -0.96,4.59 -1.74,7.14 -0.7,7 -2.02,12.51 -1.15,4.85 -0.61,6.99 -1.27,12.11l-1.26 44.98c0.01,0.08 0,2.02 0,2.38 -0.07,9.42 -0.69,23.36 0.33,31.58l5.39 37.84c0.04,0.19 0.21,0.68 0.27,0.87 0.02,0.09 0.1,0.35 0.13,0.45l6.81 25.2c2.34,4.13 -0.23,-1.65 1.16,1.09 0.23,0.44 0.13,-0.1 0.22,1.68 0.27,5.42 3.64,11.36 5.19,15.57l0.79 3.24c1.45,1.97 0.46,-0.87 1.41,3.09l1.73 5.18c0.05,0.1 0.16,0.36 0.22,0.45l2.07 5.6c0.06,0.13 0.21,0.34 0.27,0.46 0.09,0.15 0.25,0.37 0.33,0.51l3.87 8.08c0.04,0.1 0.16,0.34 0.21,0.43 0.05,0.12 0.15,0.36 0.2,0.46l3.37 6.65c0.04,0.11 0.15,0.35 0.2,0.43l4.48 8.89c0.05,0.1 0.19,0.33 0.25,0.43l8.25 14.26c0.58,1.02 0.95,1.81 1.6,2.91l43.49 58.87c0.19,0.19 0.74,0.7 0.92,0.88 1.28,1.33 0.34,0.28 1.36,1.65l12.01 12.56c0.72,0.49 0.33,0.14 0.85,0.88 0.17,0.24 -0.75,-0.22 1.08,1.6 2.48,2.45 1.37,0.28 2.67,2.26l5.3 4.85c0.06,0.03 0.23,0.18 0.3,0.23l15.35 13.62c0.07,0.06 0.25,0.23 0.32,0.29l2.17 1.53c1.79,1.32 2.57,2.29 4.21,3.93l4.19 3.29c0.04,0.01 0.2,0.15 0.25,0.18l30.66 23.61c0.18,0.1 0.43,0.22 0.6,0.32 1.2,0.75 0.21,0.02 1.69,1.03l15.6 9.8c1.95,0.67 0.2,-0.32 1.36,0.85l7.6 4.92c6.96,3.43 13.3,6.57 20.26,10.03l48.57 18.17c0.12,0.04 0.37,0.1 0.5,0.15l6.65 2.15c0.11,0.02 0.36,0.1 0.46,0.14l7.64 1.89c0.52,0.13 3.74,0.8 4.4,0.97l4.41 1.19c3.01,0.65 2.32,0.22 4.07,0.51 0.94,0.18 0.66,0.19 1.93,0.59l7.05 1.2c0.75,0.12 0.7,0.18 1.69,0.46l26.37 3.9c1.13,0.18 1.13,0.12 2.36,0.13 7.95,0.25 18.38,-0.8 25.8,1.03l3.55 0.7c2.11,0.18 4.21,0.3 6.32,0.4l14.93 0c4.45,-0.14 8.92,-0.36 13.39,-0.53l75.86 -12.35c0.16,-0.06 0.41,-0.18 0.56,-0.24 0.14,-0.05 0.4,-0.17 0.52,-0.22 0.13,-0.05 0.38,-0.14 0.49,-0.18l2.25 -0.28c0.97,-0.1 3.55,-0.57 4.38,-0.78l15.8 -6.26c4.62,-1.13 5.22,-0.68 10.47,-2.92 1.21,-0.52 1.12,-0.42 2.02,-0.68 1.32,-0.35 2.56,-0.77 4.39,-1.46l68.34 -37.31c0.04,-0.02 0.19,-0.15 0.23,-0.16l27.83 -20.75c0.03,-0.02 0.19,-0.17 0.23,-0.2l8.07 -6.39c0.08,-0.08 0.28,-0.23 0.37,-0.3l2.8 -2.09c5.03,-3.74 26.43,-25.23 31.39,-31.03l1.99 -2.62c0.05,-0.05 0.22,-0.26 0.26,-0.32 0.06,-0.05 0.22,-0.24 0.28,-0.31 0.11,-0.12 0.43,-0.44 0.53,-0.58 0.05,-0.06 0.21,-0.24 0.26,-0.32l3.57 -4.7c0.06,-0.08 0.18,-0.32 0.23,-0.38 0.04,-0.08 0.14,-0.29 0.19,-0.34 0.03,-0.05 0.14,-0.25 0.18,-0.28 0.02,-0.04 0.15,-0.2 0.18,-0.23l6.21 -7.12c1.71,-2.06 4.82,-4.37 5.94,-6.67l4.56 -6.97c1.42,-2.01 2.03,-2.07 3.32,-3.69 0.47,-0.59 0.45,-0.55 0.86,-1.33l3.59 -5.3c3.33,-5.45 7.71,-10.35 10.7,-16.01l12.19 -22.1c0.78,-1.4 1.43,-3.01 2.11,-4.5l4.48 -8.78c0.04,-0.1 0.18,-0.34 0.24,-0.44l6.56 -15.24c1.57,-3.8 4.37,-8.76 5.05,-12.84l6.62 -20.37c0.03,-0.1 0.12,-0.35 0.14,-0.44 1.23,-4.03 1.64,-9.08 3.19,-12.03 1.37,-2.59 0.41,-4.26 1.41,-7.1l4.32 -21.89c1.02,-4.6 0.23,-6.97 1.29,-11 1.08,-4.03 0.59,-7.23 0.94,-11.48l0.86 -8.09c0.25,-1.72 0.42,0.75 0.42,-2.06l0 -0.13 0 -0.15zm-399.13 -189.13c0,12.06 -9.36,27.8 -14.36,42.84 -5,15.04 -8.68,27.89 -13.53,43.55 -4.09,13.25 -2.24,15.37 -9.59,18.72 -6.68,3.03 -12.09,6.11 -18.48,10.01 -11.61,7.07 -24.56,12.86 -36.89,20.18 -5.78,3.42 -12.15,6.7 -18.65,9.82 -5.78,2.79 -23.72,14.82 -29.45,12.65 -2.88,-1.07 -21.06,-17.2 -23.46,-19.52 -2.6,-2.52 -4.86,-4.13 -7.5,-6.75 -2.66,-2.65 -4.09,-4.83 -6.77,-7.47 -8.67,-8.56 -19.91,-20.48 -25.22,-31.73 -5.11,-10.82 -4.03,-9.31 -0.98,-20.49l14.42 -42.58c5,-13.9 8.96,-28.14 16.2,-40.58 7.86,-13.48 11.83,-22.34 23.28,-33.65 2.78,-2.74 4.28,-4.14 7.44,-6.85 12.9,-11.02 49.8,-30.21 64.93,-35 11.24,-3.56 11.38,-3.25 19.09,3.65l10.94 10.45c12.68,16.9 48.58,51.58 48.58,72.75zm-305.24 160.99c0,-15.93 -3.67,-14.49 0.13,-39.15 3.97,-25.75 3.62,-26.62 11.64,-50.08 4.74,-13.91 4.6,-15.51 10.97,-30.11 2.15,-4.93 4.18,-8.91 6.33,-14.08 3.69,-8.92 9.89,-18.9 14.69,-27.12 12.87,-22.11 22.92,-41.65 41.73,-60.57 3.84,-3.87 5.5,-6.33 11.37,-8.72 3.27,4.17 8.65,14.76 12.04,17.69 -1.57,6.1 -4.22,9.57 -6.98,14.44l-19.24 40.31c-9.49,22.14 -19.5,52.69 -24.22,76.42 -4.17,21.02 -1.57,15.9 -21.28,38.2 -2.38,2.69 -2.43,3.69 -4.55,6.09 -1.62,1.84 -3.23,3.1 -4.93,4.9l-13.5 15.89c-2.52,3.66 -10.6,13.38 -14.2,15.89zm74.87 187.26c5.77,-3.64 17.67,-5.94 24.86,-8.11 14.65,-4.45 17.24,-7.77 30.18,-7.77 7.5,0 22.27,16.02 29.06,21.31l24.45 18.27c12.54,8.29 41.62,33.13 53.51,38.23 5.9,2.52 6.52,1.52 8.49,8.54 3.12,11.07 13.03,45.99 13.03,53.48 0,8.31 -36.32,10.52 -51.4,5.74 -24.29,-7.7 -58.29,-28.48 -78.09,-43.87l-11.65 -8.85c-8.02,-5.8 -15.1,-12.88 -21.59,-19.34 -13.67,-13.58 -21.94,-21.97 -20.51,-41.12 0.67,-8.91 -0.68,-12.71 -0.34,-16.51zm585.45 -248.85c0,13.47 -17.23,42.7 -26.67,54.26 -9.95,12.21 -7.12,13.86 -13.73,9.93l-86.89 -48.6c-10.02,-5.8 -8.37,-2.92 -12.4,-14.37l-13.66 -39.58c-4.39,-13.42 -8.83,-26.53 -13.32,-40.13 -2.25,-6.8 -4.23,-13.34 -6.28,-20.38 -1.77,-6.06 -5.83,-15.44 -3.15,-21.9 5.52,-13.26 13.48,-22.52 20.21,-34.13l16.53 -23.53c2.13,-3 3.75,-5.32 5.65,-7.76 2.58,-3.26 3.41,-4.67 8.48,-3.56 9.8,2.15 19.9,6.73 28.1,12.05 8.36,5.44 19.15,14.63 24.84,22.32l15.25 18.63c4.54,5.53 7.01,9.85 10.9,15.72l24.26 42.46c0.92,1.96 1.36,3.36 2.1,5.02 0.72,1.64 1.24,2.69 1.86,4.47l12.76 40.45c3.93,13.78 5.16,16.71 5.16,28.63zm-212.97 378.54c0.35,-1.98 14.36,-20.62 16.94,-23.94 9.84,-12.68 27.63,-36.12 39.96,-42.83 4.55,-2.49 8.63,-4.75 12.92,-7.64l32.19 -20.32c1.94,-1.29 3.69,-2.64 5.62,-4.1 4.07,-3.08 7.59,-5.89 11.7,-8.87 2.77,-2.02 3.93,-2.28 6.43,-4.2l17.93 -13.29c4.05,-2.49 8,-5.63 11.94,-8.59 4.38,-3.3 7.69,-5.11 11.87,-8.53 4.75,-3.88 6.05,-6.51 14.8,-5.23 -2.08,5.22 -3.73,8.94 -6.54,14.27 -8.94,17 -12.58,22.6 -25.05,37.28 -19.3,22.74 -41.39,41.04 -66.1,58.57l-25.57 16.25c-11.49,7.53 -15.19,9.57 -27.09,14.79 -6.09,2.67 -25.11,10.13 -31.95,6.38zm-52.92 -140.66c-1.09,-10.76 15.5,-108.8 18.93,-124.49 1.89,-8.71 4.67,-9.33 10.26,-14.08 9.99,-8.53 30.29,-23.33 41.41,-30.71l22.28 -14.21c12.07,-7.93 14.6,-9.9 24.82,-5.58 15.12,6.4 18.59,7.36 32.35,15.75 4.39,2.67 10.01,5.79 14.88,8.31 10.4,5.38 20.8,12 30.49,17.56 19.77,11.36 18.52,16.37 16.9,27.7 -2.82,19.56 -3.25,65.09 -11.87,84.03 -2.24,4.95 -14.17,13.56 -19.39,17.09 -2.19,1.5 -4.44,3.61 -6.4,5.2l-56.28 39.9c-5.71,3.82 -23.48,17.45 -29.31,17.45 -11.7,0 -37.77,-13.64 -49.24,-18.95 -18.21,-8.41 -26.76,-16.81 -39.83,-24.97zm-132.38 37.07c-15.55,0 -49.16,-21.75 -63.12,-33.79 -3.7,-3.19 -7,-5.54 -10.8,-8.83 -3.63,-3.1 -6.29,-6.41 -9.88,-9.66 -5.9,-5.38 -14.58,-12.85 -18.67,-19.59 -9.01,-14.83 2.93,-66.51 6.73,-83.44 5.35,-23.8 3.31,-18.16 13.53,-24.63 18.75,-11.86 89.87,-50.45 104.55,-50.56 9.03,-0.07 18.78,6.77 27.12,12.05l22.41 15.84c11.41,8.5 9.76,5.62 21.46,16.86 4.61,4.45 19.65,15.86 19.65,18.21 0,11.02 -2.04,24.68 -3.7,35.72 -2.64,17.71 -11.7,89.49 -19.92,96.59 -4.79,4.12 -14.66,10.86 -20.35,13.49 -11.53,5.36 -21.64,10.74 -34.28,14.75 -18.34,5.83 -17.93,6.99 -34.73,6.99zm6.37 -487.95c0,-7.6 15.97,-28.37 22.11,-35.59 23.5,-27.62 35.95,-22.77 68.86,-22.77 9.16,0 42.46,5.68 52.96,8.29l28.17 8.41c17.04,7.16 32.18,14.92 46.18,27.81 3.37,3.09 10.27,7.91 10.27,13.85 0,8.24 -20.43,37.69 -26.51,47.41 -9.91,15.87 -4.17,6.08 -12.37,16.07 -2.46,3 -3.47,5.93 -7.65,6.9 -5.31,1.23 -21.06,2.34 -26.75,2.49 -8.61,0.24 -18.22,1.54 -26.77,1.56l-41.27 2.8c-18.29,2.06 -16.21,1.55 -25.54,-6.44 -8.18,-6.98 -21.52,-24.68 -31.62,-35.1 -2.63,-2.7 -1.89,-3.07 -4.14,-5.67 -3.88,-4.52 -25.93,-24.58 -25.93,-30.02z",
        fill: "#373435",
      },
    ],
  },
];

// Concatenar símbolos extras ao array principal
BRACKET_SYMBOLS_BASE.push(...EXTRA_SYMBOLS);

export const BRACELET_SYMBOLS: BraceletSymbol[] = BRACKET_SYMBOLS_BASE;

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
];
