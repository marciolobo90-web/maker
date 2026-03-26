import {
  type BraceletOrder,
  BRACELET_SYMBOLS,
  BRACELET_COLORS,
  FRONT_BACK_FONTS,
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

  const parts: string[] = [];

  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="210mm" height="113mm" version="1.1"');
  parts.push('  viewBox="0 0 ' + W + ' ' + H + '" text-anchor="middle"');
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

  // Frente rectangle
  parts.push('<rect x="2000" y="5267" width="8500" height="1200" fill="' + braceletHex + '" stroke="#333" stroke-width="2"/>');

  // Verso rectangle
  parts.push('<rect x="10500" y="5267" width="8500" height="1200" fill="' + braceletHex + '" stroke="#333" stroke-width="2"/>');

  // Symbol on frente
  var hasSymbolFrente = !!order.simboloFrente;
  if (order.simboloFrente) {
    parts.push(getSymbolSvgTag(order.simboloFrente, 2150, 5317, 1100));
  }

  // Frente text
  var frenteTextX = hasSymbolFrente ? "6750" : "6250";
  parts.push('<text x="' + frenteTextX + '" y="5977" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + escapeXml(fontFrente) + '" font-weight="' + (boldFrente ? "bold" : "normal") + '" font-size="423">' + escapeXml(order.textoFrente) + '</text>');

  // Symbol on verso
  var hasSymbolVerso = !!order.simboloVerso;
  if (order.simboloVerso) {
    parts.push(getSymbolSvgTag(order.simboloVerso, 10650, 5317, 1100));
  }

  // Verso text
  var versoTextX = hasSymbolVerso ? "15250" : "14750";
  parts.push('<text x="' + versoTextX + '" y="5977" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + escapeXml(fontVerso) + '" font-weight="' + (boldVerso ? "bold" : "normal") + '" font-size="423">' + escapeXml(order.textoVerso) + '</text>');

  // "dentro" label
  parts.push('<text x="10500" y="7350" text-anchor="middle" fill="#727376" font-family="Arial, sans-serif" font-style="italic" font-size="503">dentro</text>');

  // Inside rectangles
  parts.push('<rect x="2000" y="7606" width="8500" height="1200" fill="' + braceletHex + '" stroke="#333" stroke-width="2"/>');
  parts.push('<rect x="10500" y="7606" width="8500" height="1200" fill="' + braceletHex + '" stroke="#333" stroke-width="2"/>');

  // Inside texts (Calibri)
  var insideFont = "Calibri, 'Segoe UI', sans-serif";
  parts.push('<text x="6250" y="8076" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l1Dentro1) + '</text>');
  parts.push('<text x="6250" y="8486" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l2Dentro1) + '</text>');
  parts.push('<text x="14750" y="8076" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l1Dentro2) + '</text>');
  parts.push('<text x="14750" y="8486" text-anchor="middle" fill="' + textOnBracelet + '" font-family="' + insideFont + '" font-weight="bold" font-size="406">' + escapeXml(order.l2Dentro2) + '</text>');

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
