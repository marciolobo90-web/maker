import {
  type BraceletOrder,
  BRACELET_SYMBOLS,
  BRACELET_COLORS,
  FRONT_BACK_FONTS,
  getHalfCmFromSize,
  getHalfWidthSvg,
  getSizePrefixFromSize,
} from "./constants";

function getSymbolGroupTag(symbolId: string | undefined, x: number, y: number, size: number): string {
  if (!symbolId) return "";
  const symbol = BRACELET_SYMBOLS.find((s) => s.id === symbolId);
  if (!symbol) return "";

  const vb = symbol.viewBox.split(" ").map(Number);
  const vbMinX = vb[0];
  const vbMinY = vb[1];
  const vbW = vb[2];
  const vbH = vb[3];

  const scale = Math.min(size / vbW, size / vbH);
  const scaledW = vbW * scale;
  const scaledH = vbH * scale;
  const offsetX = x + (size - scaledW) / 2;
  const offsetY = y + (size - scaledH) / 2;
  const tx = offsetX - vbMinX * scale;
  const ty = offsetY - vbMinY * scale;

  const pathTags = symbol.paths.map((p) =>
    '  <path d="' + p.d + '" fill="' + p.fill + '" fill-rule="evenodd" clip-rule="evenodd"/>'
  ).join("\n");

  return ' <g transform="translate(' + tx.toFixed(2) + ',' + ty.toFixed(2) + ') scale(' + scale.toFixed(6) + ')">\n' + pathTags + '\n </g>';
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

function estimateTextWidth(text: string, fontSize: number): number {
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
  const H = 29700;

  const sizeName = order.tamanhoLabel || order.tamanho;
  const halfCm = getHalfCmFromSize(sizeName);
  const rectW = getHalfWidthSvg(halfCm);
  const rectH = 1200;

  const prefix = getSizePrefixFromSize(sizeName);

  const totalW = rectW * 2;
  const startX = Math.round((W - totalW) / 2);
  const frenteX = startX;
  const versoX = startX + rectW;

  const padding = 750;
  const frenteUsableStart = frenteX + padding;
  const frenteUsableEnd = frenteX + rectW - padding;
  const versoUsableStart = versoX + padding;
  const versoUsableEnd = versoX + rectW - padding;

  const frenteCenterX = Math.round((frenteUsableStart + frenteUsableEnd) / 2);
  const versoCenterX = Math.round((versoUsableStart + versoUsableEnd) / 2);

  const symbolSize = rectH - 100;
  const symbolY = 5267 + 50;
  const fontSize = 423;
  const insideFontSize = 406;

  const frenteTextW = estimateTextWidth(order.textoFrente, fontSize);
  const versoTextW = estimateTextWidth(order.textoVerso, fontSize);
  const symbolGap = 100;

  // Seguindo a estrutura EXATA do SVG exportado pelo CorelDRAW
  const parts: string[] = [];

  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
  parts.push('<!-- Creator: CorelDRAW -->');
  parts.push('<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="210mm" height="297mm" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"');
  parts.push('viewBox="0 0 ' + W + ' ' + H + '"');
  parts.push(' xmlns:xlink="http://www.w3.org/1999/xlink"');
  parts.push(' text-anchor="middle"');
  parts.push(' xmlns:xodm="http://www.corel.com/coreldraw/odm/2003">');

  // Defs com estilos CSS - igual ao CorelDRAW
  parts.push(' <defs>');
  parts.push('  <style type="text/css">');
  parts.push('   <![CDATA[');
  parts.push('    .fil_bracelet {fill:' + braceletHex + '}');
  parts.push('    .fil_text {fill:' + textOnBracelet + '}');
  parts.push('    .fil_bg1 {fill:#D2D3D5}');
  parts.push('    .fil_bg2 {fill:#606062}');
  parts.push('    .fil_bg3 {fill:#FEFEFE}');
  parts.push('    .fil_label {fill:#727376}');
  parts.push('    .fil_dark {fill:#373435}');
  parts.push('    .fil_footer {fill:#A9ABAE}');
  parts.push('    .fil_badge {fill:#F58634}');
  parts.push('    .fil_white {fill:#FFFFFF}');
  parts.push('    .fnt_client {font-weight:bold;font-size:767.66px;font-family:\'Calibri\'}');
  parts.push('    .fnt_desc {font-weight:normal;font-size:567.28px;font-family:\'Arial\'}');
  parts.push('    .fnt_size_bold {font-weight:bold;font-size:529.17px;font-family:\'Arial\'}');
  parts.push('    .fnt_size_normal {font-weight:normal;font-size:529.17px;font-family:\'Arial\'}');
  parts.push('    .fnt_label {font-style:italic;font-weight:normal;font-size:502.53px;font-family:\'Arial\'}');
  parts.push('    .fnt_inside {font-weight:bold;font-size:' + insideFontSize + 'px;font-family:\'Calibri\'}');
  parts.push('    .fnt_frente {font-weight:' + (boldFrente ? 'bold' : 'normal') + ';font-size:' + fontSize + 'px;font-family:\'' + escapeXml(fontFrente.split(',')[0].replace(/'/g, '')) + '\'}');
  parts.push('    .fnt_verso {font-weight:' + (boldVerso ? 'bold' : 'normal') + ';font-size:' + fontSize + 'px;font-family:\'' + escapeXml(fontVerso.split(',')[0].replace(/'/g, '')) + '\'}');
  parts.push('    .fnt_badge {font-weight:bold;font-size:400px;font-family:\'Calibri\'}');
  parts.push('   ]]>');
  parts.push('  </style>');
  parts.push(' </defs>');

  // Grupo principal com metadata CorelDRAW
  parts.push(' <g id="Camada_x0020_1">');
  parts.push('  <metadata id="CorelCorpID_0Corel-Layer"/>');

  // Retângulos das pulseiras - PRIMEIRO, como no original
  // Ordem: frente, dentro1, dentro2 primeiro; verso por último (após textos)
  parts.push('  <rect id="_' + prefix + 'frente" class="fil_bracelet" x="' + frenteX + '" y="5267.18" width="' + rectW + '" height="' + rectH + '"/>');
  parts.push('  <rect id="_' + prefix + 'dentro1" class="fil_bracelet" x="' + frenteX + '" y="7605.9" width="' + rectW + '" height="' + rectH + '"/>');
  parts.push('  <rect id="_' + prefix + 'dentro2" class="fil_bracelet" x="' + versoX + '" y="7605.9" width="' + rectW + '" height="' + rectH + '"/>');

  // Backgrounds
  parts.push('  <rect class="fil_bg1" x="-0.01" y="-0.02" width="20999.99" height="2700"/>');
  parts.push('  <rect class="fil_bg2" x="0" y="-0.02" width="20999.99" height="1200"/>');

  // Client name
  parts.push('  <text x="800" y="850" text-anchor="start" class="fil_bg3 fnt_client">Cliente: ' + escapeXml(order.nomeCliente) + '</text>');

  // Product description
  parts.push('  <text x="800" y="2050" text-anchor="start" class="fil_dark fnt_desc">Pulseira de silicone: Personalização baixo relevo + aplicação de tinta</text>');

  // Footer bar
  parts.push('  <rect class="fil_footer" x="0" y="10790.53" width="20999.99" height="500"/>');

  // Size info
  var sizeText = order.tamanhoCm + " cm (" + order.tamanhoLabel + ")";
  parts.push('  <text x="10500" y="3853.85" class="fil_dark fnt_size_bold">' + escapeXml(sizeText) + '</text>');

  // Labels "dentro" e "frente" - usando transform como no original
  parts.push('  <text x="10500" y="7350" class="fil_label fnt_label">dentro</text>');
  parts.push('  <text x="10500" y="4900" class="fil_label fnt_label">frente</text>');

  // Textos dentro1
  var dentro1CenterX = Math.round((frenteX + padding + frenteX + rectW - padding) / 2);
  parts.push('  <text x="' + dentro1CenterX + '" y="8135.55" class="fil_text fnt_inside">' + escapeXml(order.l1Dentro1) + '</text>');
  parts.push('  <text x="' + dentro1CenterX + '" y="8544.43" class="fil_text fnt_inside">' + escapeXml(order.l2Dentro1) + '</text>');

  // Textos dentro2
  var dentro2CenterX = Math.round((versoX + padding + versoX + rectW - padding) / 2);
  parts.push('  <text x="' + dentro2CenterX + '" y="8135.55" class="fil_text fnt_inside">' + escapeXml(order.l1Dentro2) + '</text>');
  parts.push('  <text x="' + dentro2CenterX + '" y="8544.43" class="fil_text fnt_inside">' + escapeXml(order.l2Dentro2) + '</text>');

  // Retângulo VERSO - colocado DEPOIS dos textos internos, como no original
  parts.push('  <rect id="_' + prefix + 'verso" class="fil_bracelet" x="' + versoX + '" y="5267.18" width="' + rectW + '" height="' + rectH + '"/>');

  // Texto verso
  var hasSymbolVerso = !!order.simboloVerso;
  if (hasSymbolVerso) {
    var totalVersoW = symbolSize + symbolGap + versoTextW;
    var versoGroupStart = versoCenterX - Math.round(totalVersoW / 2);
    var symbolVersoX = versoGroupStart;
    var textVersoX = versoGroupStart + symbolSize + symbolGap + Math.round(versoTextW / 2);
    parts.push(getSymbolGroupTag(order.simboloVerso, symbolVersoX, symbolY, symbolSize));
    parts.push('  <text x="' + textVersoX + '" y="5976.82" class="fil_text fnt_verso">' + escapeXml(order.textoVerso) + '</text>');
  } else {
    parts.push('  <text x="' + versoCenterX + '" y="5976.82" class="fil_text fnt_verso">' + escapeXml(order.textoVerso) + '</text>');
  }

  // Texto frente
  var hasSymbolFrente = !!order.simboloFrente;
  if (hasSymbolFrente) {
    var totalFrenteW = symbolSize + symbolGap + frenteTextW;
    var frenteGroupStart = frenteCenterX - Math.round(totalFrenteW / 2);
    var symbolFrenteX = frenteGroupStart;
    var textFrenteX = frenteGroupStart + symbolSize + symbolGap + Math.round(frenteTextW / 2);
    parts.push(getSymbolGroupTag(order.simboloFrente, symbolFrenteX, symbolY, symbolSize));
    parts.push('  <text x="' + textFrenteX + '" y="5976.82" class="fil_text fnt_frente">' + escapeXml(order.textoFrente) + '</text>');
  } else {
    parts.push('  <text x="' + frenteCenterX + '" y="5976.82" class="fil_text fnt_frente">' + escapeXml(order.textoFrente) + '</text>');
  }

  // Quantity badge
  if (order.quantidade && order.quantidade > 1) {
    parts.push('  <rect x="18500" y="300" width="2200" height="600" rx="100" class="fil_badge"/>');
    parts.push('  <text x="19600" y="720" class="fil_white fnt_badge">Qtd: ' + order.quantidade + '</text>');
  }

  parts.push(' </g>');
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
