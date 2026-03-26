import {
  type BraceletOrder,
  BRACELET_SYMBOLS,
  BRACELET_COLORS,
  FRONT_BACK_FONTS,
  getHalfCmFromSize,
  getHalfWidthSvg,
  getSizePrefixFromSize,
} from "./constants";

function getSymbolSvgTag(symbolId: string | undefined, x: number, y: number, size: number): string {
  if (!symbolId) return "";
  const symbol = BRACELET_SYMBOLS.find((s) => s.id === symbolId);
  if (!symbol) return "";
  const pathTags = symbol.paths.map((p) =>
    '<path d="' + p.d + '" fill="' + p.fill + '" fill-rule="evenodd" clip-rule="evenodd"/>'
  ).join("\n");
  return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="' + symbol.viewBox + '" preserveAspectRatio="xMidYMid meet">\n' + pathTags + '\n</svg>';
}

function getFontFamily(fontName: string): string {
  const font = FRONT_BACK_FONTS.find((f) => f.name === fontName);
  return font ? font.family : "Calibri, 'Segoe UI', sans-serif";
}

function isBoldFont(fontName: string): boolean {
  return fontName === "Calibri Negrito";
}

function getBraceletColor(colorName: string): { hex: string; textColor: string } {
  const color = BRACELET_COLORS.find((c) => c.name === colorName);
  return color ? { hex: color.hex, textColor: color.textColor } : { hex: "#000000", textColor: "#FFFFFF" };
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Estima a largura do texto em SVG units baseado no número de caracteres e tamanho da fonte
function estimateTextWidth(text: string, fontSize: number): number {
  // Fator médio: cada caractere ocupa ~0.55 da altura da fonte
  return Math.round(text.length * fontSize * 0.55);
}

export function generateBraceletSVG(order: BraceletOrder): string {
  const colorInfo = getBraceletColor(order.cor);
  const braceletHex = colorInfo.hex;
  const textOnBracelet = order.corTexto || colorInfo.textColor;
  const fontFrente = getFontFamily(order.fonteFrente || "Bahnschrift");
  const fontVerso = getFontFamily(order.fonteVerso || "Bahnschrift");
  const boldFrente = isBoldFont(order.fonteFrente);
  const boldVerso = isBoldFont(order.fonteVerso);

  const W = 21000;
  const H = 11300;

  // Escala exata: 100 SVG units = 1mm
  const sizeName = order.tamanhoLabel || order.tamanho;
  const halfCm = getHalfCmFromSize(sizeName);
  const rectW = getHalfWidthSvg(halfCm);
  const rectH = 1200;

  // Prefixo para IDs dos objetos (ex: "12" para Bebê, "21" para GG adulto)
  const prefix = getSizePrefixFromSize(sizeName);

  // Centralizar os dois retângulos lado a lado no SVG
  const totalW = rectW * 2;
  const startX = Math.round((W - totalW) / 2);
  const frenteX = startX;
  const versoX = startX + rectW;

  // Área útil: 15mm = 1500 SVG units menor de cada lado
  const padding = 750; // 7.5mm de cada lado = 15mm total
  const frenteUsableStart = frenteX + padding;
  const frenteUsableEnd = frenteX + rectW - padding;
  const versoUsableStart = versoX + padding;
  const versoUsableEnd = versoX + rectW - padding;

  // Texto centralizado na área útil
  const frenteCenterX = Math.round((frenteUsableStart + frenteUsableEnd) / 2);
  const versoCenterX = Math.round((versoUsableStart + versoUsableEnd) / 2);

  // Tamanho do símbolo proporcional à altura do retângulo
  const symbolSize = rectH - 100;
  const symbolY = 5267 + 50;
  const fontSize = 423;

  // Calcular posição do símbolo próximo ao texto
  const frenteTextW = estimateTextWidth(order.textoFrente, fontSize);
  const versoTextW = estimateTextWidth(order.textoVerso, fontSize);
  const symbolGap = 100; // 1mm de gap entre símbolo e texto

  const parts: string[] = [];

  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="210mm" height="113mm" version="1.1"');
  parts.push('  viewBox="0 0 ' + W + ' ' + H + '"');
  parts.push('  style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision">');

  // Background
  parts.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#FFFFFF"/>');

  // Header bar
  parts.push('<rect x="0" y="0" width="' + W + '" height="1200" fill="#606062"/>');

  // Sub-header bar
  parts.push('<rect x="0" y="1200" width="' + W + '" height="1500" fill="#D2D3D5"/>');

  // Client name
  parts.push('<text x="800" y="850" text-anchor="start" fill="#FEFEFE" font-family="Calibri, sans-serif" font-weight="bold" font-size="768">Cliente: ' + escapeXml(order.nomeCliente) + '</text>');

  // Product description
  parts.push('<text x="800" y="2050" text-anchor="start" fill="#373435" font-family="Arial, sans-serif" font-size="567">Pulseira de silicone: Personalização baixo relevo + aplicação de tinta</text>');

  // Size info
  var sizeText = order.tamanhoCm + " cm (" + order.tamanhoLabel + ")";
  parts.push('<text x="10500" y="3854" text-anchor="middle" fill="#373435" font-family="Arial, sans-serif" font-weight="bold" font-size="529">' + escapeXml(sizeText) + '</text>');

  // "frente" label
  parts.push('<text x="10500" y="4900" text-anchor="middle" fill="#727376" font-family="Arial, sans-serif" font-style="italic" font-size="503">frente</text>');

  // Frente rectangle - sem stroke, sem lock
  parts.push('<rect id="' + prefix + 'frente" x="' + frenteX + '" y="5267" width="' + rectW + '" height="' + rectH + '" fill="' + braceletHex + '"/>');

  // Verso rectangle - sem stroke, sem lock
  parts.push('<rect id="' + prefix + 'verso" x="' + versoX + '" y="5267" width="' + rectW + '" height="' + rectH + '" fill="' + braceletHex + '"/>');

  // Symbol + text na frente: símbolo à esquerda do texto, ambos centralizados na área útil
  var hasSymbolFrente = !!order.simboloFrente;
  if (hasSymbolFrente) {
    // Conjunto símbolo+texto centralizado na área útil
    var totalFrenteW = symbolSize + symbolGap + frenteTextW;
    var frenteGroupStart = frenteCenterX - Math.round(totalFrenteW / 2);
    var symbolFrenteX = frenteGroupStart;
    var textFrenteX = frenteGroupStart + symbolSize + symbolGap + Math.round(frenteTextW / 2);
    parts.push(getSymbolSvgTag(order.simboloFrente, symbolFrenteX, symbolY, symbolSize));
    parts.push('<text x="' + textFrenteX + '" y="5977" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + escapeXml(fontFrente) + '" font-weight="' + (boldFrente ? "bold" : "normal") + '" font-size="' + fontSize + '">' + escapeXml(order.textoFrente) + '</text>');
  } else {
    parts.push('<text x="' + frenteCenterX + '" y="5977" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + escapeXml(fontFrente) + '" font-weight="' + (boldFrente ? "bold" : "normal") + '" font-size="' + fontSize + '">' + escapeXml(order.textoFrente) + '</text>');
  }

  // Symbol + text no verso: símbolo à esquerda do texto, ambos centralizados na área útil
  var hasSymbolVerso = !!order.simboloVerso;
  if (hasSymbolVerso) {
    var totalVersoW = symbolSize + symbolGap + versoTextW;
    var versoGroupStart = versoCenterX - Math.round(totalVersoW / 2);
    var symbolVersoX = versoGroupStart;
    var textVersoX = versoGroupStart + symbolSize + symbolGap + Math.round(versoTextW / 2);
    parts.push(getSymbolSvgTag(order.simboloVerso, symbolVersoX, symbolY, symbolSize));
    parts.push('<text x="' + textVersoX + '" y="5977" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + escapeXml(fontVerso) + '" font-weight="' + (boldVerso ? "bold" : "normal") + '" font-size="' + fontSize + '">' + escapeXml(order.textoVerso) + '</text>');
  } else {
    parts.push('<text x="' + versoCenterX + '" y="5977" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + escapeXml(fontVerso) + '" font-weight="' + (boldVerso ? "bold" : "normal") + '" font-size="' + fontSize + '">' + escapeXml(order.textoVerso) + '</text>');
  }

  // "dentro" label
  parts.push('<text x="10500" y="7350" text-anchor="middle" fill="#727376" font-family="Arial, sans-serif" font-style="italic" font-size="503">dentro</text>');

  // Inside rectangles - sem stroke, sem lock
  parts.push('<rect id="' + prefix + 'dentro1" x="' + frenteX + '" y="7606" width="' + rectW + '" height="' + rectH + '" fill="' + braceletHex + '"/>');
  parts.push('<rect id="' + prefix + 'dentro2" x="' + versoX + '" y="7606" width="' + rectW + '" height="' + rectH + '" fill="' + braceletHex + '"/>');

  // Inside texts (Calibri) - centralizados na área útil
  var dentro1CenterX = Math.round((frenteX + padding + frenteX + rectW - padding) / 2);
  var dentro2CenterX = Math.round((versoX + padding + versoX + rectW - padding) / 2);
  var insideFont = "Calibri, 'Segoe UI', sans-serif";
  parts.push('<text x="' + dentro1CenterX + '" y="8076" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l1Dentro1) + '</text>');
  parts.push('<text x="' + dentro1CenterX + '" y="8486" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l2Dentro1) + '</text>');
  parts.push('<text x="' + dentro2CenterX + '" y="8076" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l1Dentro2) + '</text>');
  parts.push('<text x="' + dentro2CenterX + '" y="8486" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l2Dentro2) + '</text>');

  // Footer bar
  parts.push('<rect x="0" y="10790" width="' + W + '" height="500" fill="#A9ABAE"/>');

  // Quantity badge
  if (order.quantidade && order.quantidade > 1) {
    parts.push('<rect x="18500" y="300" width="2200" height="600" rx="100" fill="#F58634"/>');
    parts.push('<text x="19600" y="720" text-anchor="middle" fill="#FFFFFF" font-family="Calibri, sans-serif" font-weight="bold" font-size="400">Qtd: ' + order.quantidade + '</text>');
  }

  parts.push('</svg>');

  return parts.join('\n');
}

export function downloadSVG(svgContent: string, filename: string): void {
  var blob = new Blob([svgContent], { type: "image/svg+xml" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAllSVGs(orders: BraceletOrder[]): void {
  orders.forEach(function(order, index) {
    var svg = generateBraceletSVG(order);
    var filename = (order.nomeCliente || "pulseira_" + (index + 1)).replace(/\s+/g, "_") + ".svg";
    setTimeout(function() { downloadSVG(svg, filename); }, index * 200);
  });
}
