import {
  type BraceletOrder,
  BRACELET_SYMBOLS,
  BRACELET_COLORS,
  FRONT_BACK_FONTS,
  getHalfCmFromSize,
  getHalfWidthSvg,
  getSizePrefixFromSize,
} from "./constants";

function getSymbolPaths(
  symbolId: string | undefined,
  x: number,
  y: number,
  size: number
): string {
  if (!symbolId) return "";
  var symbol = BRACELET_SYMBOLS.find(function (s) {
    return s.id === symbolId;
  });
  if (!symbol) return "";
  var vb = symbol.viewBox.split(" ").map(Number);
  var sc = Math.min(size / vb[2], size / vb[3]);
  var tx = x + (size - vb[2] * sc) / 2 - vb[0] * sc;
  var ty = y + (size - vb[3] * sc) / 2 - vb[1] * sc;
  // Each path gets its own transform attribute — NO <g> wrapper
  var paths = symbol.paths
    .map(function (pp) {
      return '  <path transform="translate(' + tx.toFixed(2) + ',' + ty.toFixed(2) + ') scale(' + sc.toFixed(6) + ')" d="' + pp.d + '" fill="' + pp.fill + '"/>';
    })
    .join("\n");
  return paths;
}

function getFontClean(fontName: string): string {
  var f = FRONT_BACK_FONTS.find(function (x) {
    return x.name === fontName;
  });
  var fam = f ? f.family : "Calibri, sans-serif";
  return fam.split(",")[0].replace(/'/g, "").trim();
}

function isBoldFont(fontName: string): boolean {
  return fontName === "Calibri Negrito";
}

function getCol(colorName: string): { hex: string; text: string } {
  var c = BRACELET_COLORS.find(function (x) {
    return x.name === colorName;
  });
  return c ? { hex: c.hex, text: c.textColor } : { hex: "#000000", text: "#FFFFFF" };
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function estW(text: string, fontSize: number): number {
  return Math.round(text.length * fontSize * 0.55);
}

export function generateBraceletSVG(order: BraceletOrder): string {
  var col = getCol(order.cor);
  var bHex = col.hex;
  var tCol = order.corTexto || col.text;
  var fFam = getFontClean(order.fonteFrente || "Bahnschrift");
  var vFam = getFontClean(order.fonteVerso || "Bahnschrift");
  var fBold = isBoldFont(order.fonteFrente);
  var vBold = isBoldFont(order.fonteVerso);

  var sName = order.tamanhoLabel || order.tamanho;
  var hCm = getHalfCmFromSize(sName);
  var rW = getHalfWidthSvg(hCm);
  var rH = 1200;
  var pfx = getSizePrefixFromSize(sName);
  var tW = rW * 2;
  var sX = Math.round((21000 - tW) / 2);
  var fX = sX;
  var vX = sX + rW;
  var fCx = Math.round(fX + rW / 2);
  var vCx = Math.round(vX + rW / 2);
  var symSz = rH - 100;
  var symY = 5317;
  var fs = 423;
  var ifs = 406;
  var symGap = 100;
  var fTw = estW(order.textoFrente, fs);
  var vTw = estW(order.textoVerso, fs);

  var p: string[] = [];

  // SVG header — formato CorelDRAW
  p.push('<?xml version="1.0" encoding="UTF-8"?>');
  p.push(
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
  );
  p.push(
    '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="210mm" height="297mm" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 21000 29700" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003">'
  );

  p.push(' <g id="Camada_x0020_1">');
  p.push('  <metadata id="CorelCorpID_0Corel-Layer"/>');

  // ============================================================
  // REGRA COREL: Todos os retângulos ANTES de todos os textos
  // Retângulos que ficam depois de textos sobrepostos = bloqueados
  // ============================================================

  // 1) Todos os 4 retângulos de pulseira juntos
  p.push(
    '  <rect id="' +
      pfx +
      'frente" fill="' +
      bHex +
      '" x="' +
      fX +
      '" y="5267.18" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );
  p.push(
    '  <rect id="' +
      pfx +
      'verso" fill="' +
      bHex +
      '" x="' +
      vX +
      '" y="5267.18" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );
  p.push(
    '  <rect id="' +
      pfx +
      'dentro1" fill="' +
      bHex +
      '" x="' +
      fX +
      '" y="7605.9" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );
  p.push(
    '  <rect id="' +
      pfx +
      'dentro2" fill="' +
      bHex +
      '" x="' +
      vX +
      '" y="7605.9" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );

  // 2) Backgrounds cabeçalho
  p.push(
    '  <rect fill="#D2D3D5" x="-0.01" y="-0.02" width="20999.99" height="2700"/>'
  );
  p.push(
    '  <rect fill="#606062" x="0" y="-0.02" width="20999.99" height="1200"/>'
  );

  // 3) Rodapé
  p.push(
    '  <rect fill="#A9ABAE" x="0" y="10790.53" width="20999.99" height="500"/>'
  );

  // 4) Badge quantidade (se > 1)
  if (order.quantidade && order.quantidade > 1) {
    p.push(
      '  <rect fill="#F58634" x="18500" y="300" width="2200" height="600" rx="100"/>'
    );
  }

  // ============================================================
  // AGORA todos os textos e símbolos (DEPOIS dos retângulos)
  // ============================================================

  // Nome do cliente
  p.push(
    '  <text x="800" y="850" text-anchor="start" fill="#FEFEFE" font-weight="bold" font-size="767.66" font-family="Calibri">Cliente: ' +
      esc(order.nomeCliente) +
      "</text>"
  );

  // Descrição
  p.push(
    '  <text x="800" y="2050" text-anchor="start" fill="#373435" font-size="567.28" font-family="Arial">Pulseira de silicone: Personalização baixo relevo + aplicação de tinta</text>'
  );

  // Tamanho
  p.push(
    '  <text x="10500" y="3853.85" text-anchor="middle" fill="#373435" font-weight="bold" font-size="529.17" font-family="Arial">' +
      esc(order.tamanhoCm + " cm (" + order.tamanhoLabel + ")") +
      "</text>"
  );

  // Labels
  p.push(
    '  <text x="10500" y="4900" text-anchor="middle" fill="#727376" font-style="italic" font-size="502.53" font-family="Arial">frente</text>'
  );
  p.push(
    '  <text x="10500" y="7350" text-anchor="middle" fill="#727376" font-style="italic" font-size="502.53" font-family="Arial">dentro</text>'
  );

  // Texto e símbolo FRENTE
  if (order.simboloFrente) {
    var totFW = symSz + symGap + fTw;
    var fGS = fCx - Math.round(totFW / 2);
    var sFX = fGS;
    var tFX = fGS + symSz + symGap + Math.round(fTw / 2);
    p.push(getSymbolPaths(order.simboloFrente, sFX, symY, symSz));
    p.push(
      '  <text x="' +
        tFX +
        '" y="5976.82" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (fBold ? "bold" : "normal") +
        '" font-size="' +
        fs +
        '" font-family="' +
        esc(fFam) +
        '">' +
        esc(order.textoFrente) +
        "</text>"
    );
  } else {
    p.push(
      '  <text x="' +
        fCx +
        '" y="5976.82" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (fBold ? "bold" : "normal") +
        '" font-size="' +
        fs +
        '" font-family="' +
        esc(fFam) +
        '">' +
        esc(order.textoFrente) +
        "</text>"
    );
  }

  // Texto e símbolo VERSO
  if (order.simboloVerso) {
    var totVW = symSz + symGap + vTw;
    var vGS = vCx - Math.round(totVW / 2);
    var sVX = vGS;
    var tVX = vGS + symSz + symGap + Math.round(vTw / 2);
    p.push(getSymbolPaths(order.simboloVerso, sVX, symY, symSz));
    p.push(
      '  <text x="' +
        tVX +
        '" y="5976.82" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (vBold ? "bold" : "normal") +
        '" font-size="' +
        fs +
        '" font-family="' +
        esc(vFam) +
        '">' +
        esc(order.textoVerso) +
        "</text>"
    );
  } else {
    p.push(
      '  <text x="' +
        vCx +
        '" y="5976.82" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (vBold ? "bold" : "normal") +
        '" font-size="' +
        fs +
        '" font-family="' +
        esc(vFam) +
        '">' +
        esc(order.textoVerso) +
        "</text>"
    );
  }

  // Textos dentro
  p.push(
    '  <text x="' +
      fCx +
      '" y="8135.55" text-anchor="middle" fill="' +
      tCol +
      '" font-weight="bold" font-size="' +
      ifs +
      '" font-family="Calibri">' +
      esc(order.l1Dentro1) +
      "</text>"
  );
  p.push(
    '  <text x="' +
      fCx +
      '" y="8544.43" text-anchor="middle" fill="' +
      tCol +
      '" font-weight="bold" font-size="' +
      ifs +
      '" font-family="Calibri">' +
      esc(order.l2Dentro1) +
      "</text>"
  );
  p.push(
    '  <text x="' +
      vCx +
      '" y="8135.55" text-anchor="middle" fill="' +
      tCol +
      '" font-weight="bold" font-size="' +
      ifs +
      '" font-family="Calibri">' +
      esc(order.l1Dentro2) +
      "</text>"
  );
  p.push(
    '  <text x="' +
      vCx +
      '" y="8544.43" text-anchor="middle" fill="' +
      tCol +
      '" font-weight="bold" font-size="' +
      ifs +
      '" font-family="Calibri">' +
      esc(order.l2Dentro2) +
      "</text>"
  );

  // Badge quantidade texto
  if (order.quantidade && order.quantidade > 1) {
    p.push(
      '  <text x="19600" y="720" text-anchor="middle" fill="#FFFFFF" font-weight="bold" font-size="400" font-family="Calibri">Qtd: ' +
        order.quantidade +
        "</text>"
    );
  }

  p.push(" </g>");
  p.push("</svg>");

  return p.join("\n");
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
  orders.forEach(function (order, index) {
    var svg = generateBraceletSVG(order);
    var filename =
      (order.nomeCliente || "pulseira_" + (index + 1)).replace(/\s+/g, "_") +
      ".svg";
    setTimeout(function () {
      downloadSVG(svg, filename);
    }, index * 200);
  });
}
