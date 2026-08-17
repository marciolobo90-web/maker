import {
  type BraceletOrder,
  BRACELET_SYMBOLS,
  BRACELET_COLORS,
  FRONT_FONTS,
  VERSO_FONT,
  getHalfCmFromSize,
  getHalfWidthSvg,
  getSizePrefixFromSize,
  getSymbolColor,
  getFrontMaxWidthSvg,
  getVersoMaxWidthSvg,
  getDentroMaxWidthSvg,
  estimateFrontTextWidth,
  estimateStandardTextWidth,
  getFrontTextBaselines,
  getStandardTextBaselines,
  SYMBOL_TEXT_GAP,
  SYMBOL_MAX_SIZE,
  SYMBOL_CUSTOM_HEIGHT,
  calcFrontFontSize,
  calcVersoFontSize,
  calcDentroFontSize,
} from "./constants";

function getTargetHeight(symbolId: string): number {
  if (SYMBOL_CUSTOM_HEIGHT[symbolId] !== undefined)
    return SYMBOL_CUSTOM_HEIGHT[symbolId];
  return SYMBOL_MAX_SIZE;
}

function getSymbolSize(symbolId: string): number {
  // Retorna a largura renderizada para cálculos de posicionamento horizontal
  var symbol = BRACELET_SYMBOLS.find(function (s) {
    return s.id === symbolId;
  });
  if (!symbol) return SYMBOL_MAX_SIZE;
  var vb = symbol.viewBox.split(" ").map(Number);
  var targetH = getTargetHeight(symbolId);
  var sc = targetH / vb[3]; // escala pela altura
  return Math.round(vb[2] * sc); // retorna largura renderizada
}

function getSymbolPaths(
  symbolId: string | undefined,
  braceletColor: string,
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
  // Escala pela altura = 7,5mm (altura fixa, largura proporcional)
  // Sempre usa SYMBOL_MAX_SIZE para a altura, ignorando 'size' que é a largura renderizada para posicionamento
  var targetH = getTargetHeight(symbolId);
  var sc = targetH / vb[3];
  var renderedW = vb[2] * sc;
  var tx = x + (size - renderedW) / 2 - vb[0] * sc;
  // O chamador já centraliza `y` usando a altura renderizada. `size` contém
  // a largura, portanto não pode participar do cálculo vertical.
  var ty = y - vb[1] * sc;

  // Determinar a cor do símbolo baseado na cor da pulseira
  var overrideColor = getSymbolColor(symbolId, braceletColor);
  var fillRuleAttr = symbol.fillRule
    ? ' fill-rule="' + symbol.fillRule + '"'
    : "";

  var paths = symbol.paths
    .map(function (pp) {
      var fillColor = overrideColor !== null ? overrideColor : pp.fill;
      return (
        '  <path transform="translate(' +
        tx.toFixed(2) +
        "," +
        ty.toFixed(2) +
        ") scale(" +
        sc.toFixed(6) +
        ')" d="' +
        pp.d +
        '" fill="' +
        fillColor +
        '"' +
        fillRuleAttr +
        "/>"
      );
    })
    .join("\n");
  return paths;
}

function getFontInfo(fontName: string): {
  clean: string;
  bold: boolean;
} {
  var f = FRONT_FONTS.find(function (x) {
    return x.name === fontName;
  });
  var fam = f ? f.family : "Calibri, sans-serif";
  var clean = fam.split(",")[0].replace(/'/g, "").trim();
  // Kids Station e Milky Matcha não são negrito; as demais são
  var bold = fontName !== "Kids Station" && fontName !== "Milky Matcha";
  return {
    clean: clean,
    bold: bold,
  };
}

function getCol(colorName: string): { hex: string; text: string } {
  var c = BRACELET_COLORS.find(function (x) {
    return x.name === colorName;
  });
  return c
    ? { hex: c.hex, text: c.textColor }
    : { hex: "#000000", text: "#FFFFFF" };
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (maximum < minimum) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

export function generateBraceletSVG(order: BraceletOrder): string {
  var col = getCol(order.cor);
  var bHex = col.hex;
  var tCol = order.corTexto || col.text;
  var isGradient =
    order.cor === "Colorido" ||
    order.cor === "Mesclado Rosa" ||
    order.cor === "Mesclado Azul";
  var fontInfo = getFontInfo(order.fonteFrente || "Segoe Print Negrito");
  var fFam = fontInfo.clean;
  var fBold = fontInfo.bold;
  // Verso sempre Calibri Negrito
  var vFam = VERSO_FONT.family.split(",")[0].replace(/'/g, "").trim();
  var vBold = true;

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

  var frenteY = 5267;
  var dentroY = 7606;
  // Tamanho de fonte da frente: auto-ajuste baseado na área máxima de personalização
  var frenteL2 = order.l2Frente || "";
  var hasFrenteL2 = frenteL2.length > 0;
  var fs = calcFrontFontSize(
    order.textoFrente,
    order.fonteFrente || "Segoe Print Negrito",
    sName,
    order.simboloFrente,
    order.simboloFrente2,
    frenteL2
  );
  // Tamanho de fonte do verso: auto-ajuste baseado na área máxima (suporta 3 linhas)
  var vfs = calcVersoFontSize(
    order.textoVerso || "",
    order.l2Verso || "",
    sName,
    order.simboloVerso,
    order.l3Verso || ""
  );
  // Tamanho de fonte do dentro1: auto-ajuste baseado na área máxima (suporta 3 linhas)
  var ifs1 = calcDentroFontSize(
    order.l1Dentro1 || "",
    order.l2Dentro1 || "",
    sName,
    order.simboloDentro1,
    order.l3Dentro1 || ""
  );
  // Tamanho de fonte do dentro2: auto-ajuste baseado na área máxima (suporta 3 linhas)
  var ifs2 = calcDentroFontSize(
    order.l1Dentro2 || "",
    order.l2Dentro2 || "",
    sName,
    order.simboloDentro2,
    order.l3Dentro2 || ""
  );
  var symGap = SYMBOL_TEXT_GAP;
  var dentroSymGap = SYMBOL_TEXT_GAP;

  // Calcular posições FRENTE com 2 símbolos possíveis
  var frontFontName = order.fonteFrente || "Segoe Print Negrito";
  var frenteTextW1 = estimateFrontTextWidth(
    order.textoFrente,
    fs,
    frontFontName
  );
  var frenteTextW2 = hasFrenteL2
    ? estimateFrontTextWidth(frenteL2, fs, frontFontName)
    : 0;
  var frenteTextW = Math.max(frenteTextW1, frenteTextW2);
  var hasSym1 = !!order.simboloFrente;
  var hasSym2 = !!order.simboloFrente2;
  var sym1Width = hasSym1 ? getSymbolSize(order.simboloFrente || "") : 0;
  var sym2Width = hasSym2 ? getSymbolSize(order.simboloFrente2 || "") : 0;
  var totalFrenteW = frenteTextW;
  if (hasSym1) totalFrenteW += sym1Width + symGap;
  if (hasSym2) totalFrenteW += symGap + sym2Width;
  var frontAreaWidth = getFrontMaxWidthSvg(sName);
  var frontAreaLeft = fCx - Math.round(frontAreaWidth / 2);
  var frontAreaRight = fCx + Math.round(frontAreaWidth / 2);
  var frenteGroupStart = fCx - Math.round(totalFrenteW / 2);
  // Offsets horizontais dos símbolos (mm → SVG units)
  var offsetSym1 = Math.round((order.offsetSimboloFrente || 0) * 100);
  var offsetSym2 = Math.round((order.offsetSimboloFrente2 || 0) * 100);
  var textFrenteX =
    frenteGroupStart +
    (hasSym1 ? sym1Width + symGap : 0) +
    Math.round(frenteTextW / 2);
  var frontTextLeft = textFrenteX - Math.round(frenteTextW / 2);
  var frontTextRight = textFrenteX + Math.round(frenteTextW / 2);
  var sym1X = hasSym1
    ? clamp(
        frenteGroupStart + offsetSym1,
        frontAreaLeft,
        frontTextLeft - symGap - sym1Width
      )
    : 0;
  var sym2BaseX = frontTextRight + symGap;
  var sym2X = hasSym2
    ? clamp(sym2BaseX + offsetSym2, sym2BaseX, frontAreaRight - sym2Width)
    : 0;

  // Calcular posições VERSO (agora com 3 linhas possíveis)
  var versoL1 = order.textoVerso || "";
  var versoL2 = order.l2Verso || "";
  var versoL3 = order.l3Verso || "";
  var hasVersoL2 = versoL2.length > 0;
  var hasVersoL3 = versoL3.length > 0;
  var versoTextW = Math.max(
    estimateStandardTextWidth(versoL1, vfs),
    estimateStandardTextWidth(versoL2, vfs),
    estimateStandardTextWidth(versoL3, vfs)
  );
  var hasSV = !!order.simboloVerso;
  var svWidth = hasSV ? getSymbolSize(order.simboloVerso || "") : 0;
  var totalVersoW = versoTextW;
  if (hasSV) totalVersoW += svWidth + symGap;
  var versoAreaWidth = getVersoMaxWidthSvg(sName);
  var versoAreaLeft = vCx - Math.round(versoAreaWidth / 2);
  var versoGroupStart = vCx - Math.round(totalVersoW / 2);
  var offsetSymVerso = Math.round((order.offsetSimboloVerso || 0) * 100);
  var textVersoX =
    versoGroupStart +
    (hasSV ? svWidth + symGap : 0) +
    Math.round(versoTextW / 2);
  var versoTextLeft = textVersoX - Math.round(versoTextW / 2);
  var symVX = hasSV
    ? clamp(
        versoGroupStart + offsetSymVerso,
        versoAreaLeft,
        versoTextLeft - symGap - svWidth
      )
    : 0;

  // Y positions para verso (1, 2 ou 3 linhas)
  var versoLines = hasVersoL3 ? 3 : hasVersoL2 ? 2 : 1;
  var versoBaselines = getStandardTextBaselines(vfs, versoLines, frenteY, rH);
  var versoTextY1 = versoBaselines[0];
  var versoTextY2 = versoBaselines[1] || 0;
  var versoTextY3 = versoBaselines[2] || 0;

  var frontBaselines = getFrontTextBaselines(
    frontFontName,
    fs,
    hasFrenteL2 ? 2 : 1,
    frenteY,
    rH
  );
  var frenteTextY1 = frontBaselines[0];
  var frenteTextY2 = frontBaselines[1] || 0;

  // Calcular posições DENTRO com centralização vertical
  var dentro1CX = Math.round(fX + rW / 2);
  var dentro2CX = Math.round(vX + rW / 2);

  var hasD1L2 = (order.l2Dentro1 || "").length > 0;
  var hasD1L3 = (order.l3Dentro1 || "").length > 0;
  var hasD2L2 = (order.l2Dentro2 || "").length > 0;
  var hasD2L3 = (order.l3Dentro2 || "").length > 0;

  var insideAreaWidth = getDentroMaxWidthSvg(sName);
  var inside1AreaLeft = dentro1CX - Math.round(insideAreaWidth / 2);
  var inside2AreaLeft = dentro2CX - Math.round(insideAreaWidth / 2);

  var d1Lines = hasD1L3 ? 3 : hasD1L2 ? 2 : 1;
  var d1Baselines = getStandardTextBaselines(ifs1, d1Lines, dentroY, rH);
  var d1Y1 = d1Baselines[0];
  var d1Y2 = d1Baselines[1] || 0;
  var d1Y3 = d1Baselines[2] || 0;

  // Y positions para dentro2 (1, 2 ou 3 linhas)
  var d2Lines = hasD2L3 ? 3 : hasD2L2 ? 2 : 1;
  var d2Baselines = getStandardTextBaselines(ifs2, d2Lines, dentroY, rH);
  var d2Y1 = d2Baselines[0];
  var d2Y2 = d2Baselines[1] || 0;
  var d2Y3 = d2Baselines[2] || 0;

  var p: string[] = [];

  // SVG header — formato CorelDRAW
  p.push('<?xml version="1.0" encoding="UTF-8"?>');
  p.push(
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
  );
  p.push(
    '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="210mm" height="297mm" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 21000 29700" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003">'
  );

  // Sem <g> wrapper para evitar agrupamento/bloqueio no CorelDRAW
  // Cada elemento fica solto na raiz do SVG

  // Gradientes (defs) — inserido antes dos elementos
  if (isGradient) {
    p.push(" <defs>");
    if (order.cor === "Colorido") {
      p.push(
        '  <linearGradient id="coloridoGrad" gradientUnits="objectBoundingBox" x1="0%" y1="50%" x2="99.99%" y2="50%">'
      );
      p.push(
        '   <stop offset="0" style="stop-opacity:1; stop-color:#FCDA11"/>'
      );
      p.push(
        '   <stop offset="0.2" style="stop-opacity:1; stop-color:#00A6D6"/>'
      );
      p.push(
        '   <stop offset="0.729412" style="stop-opacity:1; stop-color:#FF0099"/>'
      );
      p.push(
        '   <stop offset="1" style="stop-opacity:1; stop-color:#FCDA11"/>'
      );
      p.push("  </linearGradient>");
    } else if (order.cor === "Mesclado Rosa") {
      p.push(
        '  <linearGradient id="rosaGrad" gradientUnits="objectBoundingBox" x1="0%" y1="50%" x2="99.99%" y2="50%">'
      );
      p.push(
        '   <stop offset="0" style="stop-opacity:1; stop-color:#FF0099"/>'
      );
      p.push(
        '   <stop offset="0.2" style="stop-opacity:1; stop-color:#FF9EC2"/>'
      );
      p.push(
        '   <stop offset="0.380392" style="stop-opacity:1; stop-color:#FF0099"/>'
      );
      p.push(
        '   <stop offset="0.568627" style="stop-opacity:1; stop-color:#FF9EC2"/>'
      );
      p.push(
        '   <stop offset="0.788235" style="stop-opacity:1; stop-color:#FF0099"/>'
      );
      p.push(
        '   <stop offset="1" style="stop-opacity:1; stop-color:#FF9EC2"/>'
      );
      p.push("  </linearGradient>");
    } else if (order.cor === "Mesclado Azul") {
      p.push(
        '  <linearGradient id="azulGrad" gradientUnits="objectBoundingBox" x1="0%" y1="50%" x2="99.99%" y2="50%">'
      );
      p.push(
        '   <stop offset="0" style="stop-opacity:1; stop-color:#171796"/>'
      );
      p.push(
        '   <stop offset="0.2" style="stop-opacity:1; stop-color:#00A3E0"/>'
      );
      p.push(
        '   <stop offset="0.380392" style="stop-opacity:1; stop-color:#171796"/>'
      );
      p.push(
        '   <stop offset="0.568627" style="stop-opacity:1; stop-color:#00A3E0"/>'
      );
      p.push(
        '   <stop offset="0.788235" style="stop-opacity:1; stop-color:#171796"/>'
      );
      p.push(
        '   <stop offset="1" style="stop-opacity:1; stop-color:#00A3E0"/>'
      );
      p.push("  </linearGradient>");
    }
    p.push(" </defs>");
  }

  // ============================================================
  // REGRA COREL: Todos os retângulos ANTES de todos os textos
  // ============================================================

  // 1) Todos os 4 retângulos de pulseira juntos
  // Contorno cinza (20% preto) apenas na pulseira branca
  var strokeAttr =
    order.cor === "Branco" ? ' stroke="#CCCCCC" stroke-width="20"' : "";
  var gradId =
    order.cor === "Colorido"
      ? "coloridoGrad"
      : order.cor === "Mesclado Rosa"
        ? "rosaGrad"
        : order.cor === "Mesclado Azul"
          ? "azulGrad"
          : "";
  var rectFill = isGradient ? "url(#" + gradId + ")" : bHex;
  p.push(
    '  <rect id="' +
      pfx +
      'frente" fill="' +
      rectFill +
      '"' +
      strokeAttr +
      ' x="' +
      fX +
      '" y="' +
      frenteY +
      '" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );
  p.push(
    '  <rect id="' +
      pfx +
      'verso" fill="' +
      rectFill +
      '"' +
      strokeAttr +
      ' x="' +
      vX +
      '" y="' +
      frenteY +
      '" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );
  p.push(
    '  <rect id="' +
      pfx +
      'dentro1" fill="' +
      rectFill +
      '"' +
      strokeAttr +
      ' x="' +
      fX +
      '" y="' +
      dentroY +
      '" width="' +
      rW +
      '" height="' +
      rH +
      '"/>'
  );
  p.push(
    '  <rect id="' +
      pfx +
      'dentro2" fill="' +
      rectFill +
      '"' +
      strokeAttr +
      ' x="' +
      vX +
      '" y="' +
      dentroY +
      '" width="' +
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

  // ---- FRENTE: símbolo1 + texto + símbolo2 ----
  if (hasSym1) {
    var s1Sz = getSymbolSize(order.simboloFrente || "");
    var s1Y =
      frenteY +
      Math.round((rH - getTargetHeight(order.simboloFrente || "")) / 2);
    p.push(getSymbolPaths(order.simboloFrente, order.cor, sym1X, s1Y, s1Sz));
  }
  p.push(
    '  <text xml:space="preserve" x="' +
      textFrenteX +
      '" y="' +
      frenteTextY1 +
      '" text-anchor="middle" fill="' +
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
  if (hasFrenteL2) {
    p.push(
      '  <text xml:space="preserve" x="' +
        textFrenteX +
        '" y="' +
        frenteTextY2 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (fBold ? "bold" : "normal") +
        '" font-size="' +
        fs +
        '" font-family="' +
        esc(fFam) +
        '">' +
        esc(frenteL2) +
        "</text>"
    );
  }
  if (hasSym2) {
    var s2Sz = getSymbolSize(order.simboloFrente2 || "");
    var s2Y =
      frenteY +
      Math.round((rH - getTargetHeight(order.simboloFrente2 || "")) / 2);
    p.push(getSymbolPaths(order.simboloFrente2, order.cor, sym2X, s2Y, s2Sz));
  }

  // ---- VERSO: símbolo + texto (1, 2 ou 3 linhas) ----
  if (hasSV) {
    var svSz = getSymbolSize(order.simboloVerso || "");
    var svY =
      frenteY +
      Math.round((rH - getTargetHeight(order.simboloVerso || "")) / 2);
    p.push(getSymbolPaths(order.simboloVerso, order.cor, symVX, svY, svSz));
  }
  p.push(
    '  <text xml:space="preserve" x="' +
      textVersoX +
      '" y="' +
      versoTextY1 +
      '" text-anchor="middle" fill="' +
      tCol +
      '" font-weight="' +
      (vBold ? "bold" : "normal") +
      '" font-size="' +
      vfs +
      '" font-family="' +
      esc(vFam) +
      '">' +
      esc(versoL1) +
      "</text>"
  );
  if (hasVersoL2) {
    p.push(
      '  <text xml:space="preserve" x="' +
        textVersoX +
        '" y="' +
        versoTextY2 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (vBold ? "bold" : "normal") +
        '" font-size="' +
        vfs +
        '" font-family="' +
        esc(vFam) +
        '">' +
        esc(versoL2) +
        "</text>"
    );
  }
  if (hasVersoL3) {
    p.push(
      '  <text xml:space="preserve" x="' +
        textVersoX +
        '" y="' +
        versoTextY3 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="' +
        (vBold ? "bold" : "normal") +
        '" font-size="' +
        vfs +
        '" font-family="' +
        esc(vFam) +
        '">' +
        esc(versoL3) +
        "</text>"
    );
  }

  // ---- DENTRO1: símbolo WhatsApp (opcional) + 1 ou 2 linhas ----
  var hasSD1 = !!order.simboloDentro1;
  var hasD1Text = (order.l1Dentro1 || "").length > 0;
  if (hasSD1 && hasD1Text) {
    // Símbolo + texto: grupo centralizado, texto logo após o símbolo
    var sd1Width = getSymbolSize(order.simboloDentro1 || "");
    var d1TextW1 = estimateStandardTextWidth(order.l1Dentro1, ifs1);
    var d1TextW2 = estimateStandardTextWidth(order.l2Dentro1, ifs1);
    var d1TextW3 = estimateStandardTextWidth(order.l3Dentro1 || "", ifs1);
    var d1MaxTextW = Math.max(d1TextW1, d1TextW2, d1TextW3);
    var totalD1W = sd1Width + dentroSymGap + d1MaxTextW;
    var d1GroupStart = dentro1CX - Math.round(totalD1W / 2);
    var offsetD1 = Math.round((order.offsetSimboloDentro1 || 0) * 100);
    var d1TextX =
      d1GroupStart + sd1Width + dentroSymGap + Math.round(d1MaxTextW / 2);
    var d1TextLeft = d1TextX - Math.round(d1MaxTextW / 2);
    var sd1X = clamp(
      d1GroupStart + offsetD1,
      inside1AreaLeft,
      d1TextLeft - dentroSymGap - sd1Width
    );
    var sd1Sz = sd1Width;
    var sd1TargetH = getTargetHeight(order.simboloDentro1 || "");
    var sd1Y = dentroY + Math.round((rH - sd1TargetH) / 2);
    p.push(getSymbolPaths(order.simboloDentro1, order.cor, sd1X, sd1Y, sd1Sz));
    p.push(
      '  <text xml:space="preserve" x="' +
        d1TextX +
        '" y="' +
        d1Y1 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="bold" font-size="' +
        ifs1 +
        '" font-family="Calibri">' +
        esc(order.l1Dentro1) +
        "</text>"
    );
    if (hasD1L2) {
      p.push(
        '  <text xml:space="preserve" x="' +
          d1TextX +
          '" y="' +
          d1Y2 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs1 +
          '" font-family="Calibri">' +
          esc(order.l2Dentro1) +
          "</text>"
      );
    }
    if (hasD1L3) {
      p.push(
        '  <text xml:space="preserve" x="' +
          d1TextX +
          '" y="' +
          d1Y3 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs1 +
          '" font-family="Calibri">' +
          esc(order.l3Dentro1 || "") +
          "</text>"
      );
    }
  } else if (hasSD1 && !hasD1Text) {
    // Só símbolo sem texto: centralizar o símbolo no retângulo
    var sd1Width = getSymbolSize(order.simboloDentro1 || "");
    var offsetD1 = Math.round((order.offsetSimboloDentro1 || 0) * 100);
    var sd1X = clamp(
      dentro1CX - Math.round(sd1Width / 2) + offsetD1,
      inside1AreaLeft,
      inside1AreaLeft + insideAreaWidth - sd1Width
    );
    var sd1Sz = sd1Width;
    var sd1TargetH = getTargetHeight(order.simboloDentro1 || "");
    var sd1Y = dentroY + Math.round((rH - sd1TargetH) / 2);
    p.push(getSymbolPaths(order.simboloDentro1, order.cor, sd1X, sd1Y, sd1Sz));
  } else {
    p.push(
      '  <text xml:space="preserve" x="' +
        dentro1CX +
        '" y="' +
        d1Y1 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="bold" font-size="' +
        ifs1 +
        '" font-family="Calibri">' +
        esc(order.l1Dentro1) +
        "</text>"
    );
    if (hasD1L2) {
      p.push(
        '  <text xml:space="preserve" x="' +
          dentro1CX +
          '" y="' +
          d1Y2 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs1 +
          '" font-family="Calibri">' +
          esc(order.l2Dentro1) +
          "</text>"
      );
    }
    if (hasD1L3) {
      p.push(
        '  <text xml:space="preserve" x="' +
          dentro1CX +
          '" y="' +
          d1Y3 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs1 +
          '" font-family="Calibri">' +
          esc(order.l3Dentro1 || "") +
          "</text>"
      );
    }
  }

  // ---- DENTRO2: símbolo WhatsApp (opcional) + 1 ou 2 linhas ----
  var hasSD2 = !!order.simboloDentro2;
  var hasD2Text = (order.l1Dentro2 || "").length > 0;
  if (hasSD2 && hasD2Text) {
    // Símbolo + texto: grupo centralizado, texto logo após o símbolo
    var sd2Width = getSymbolSize(order.simboloDentro2 || "");
    var d2TextW1 = estimateStandardTextWidth(order.l1Dentro2, ifs2);
    var d2TextW2 = estimateStandardTextWidth(order.l2Dentro2, ifs2);
    var d2TextW3 = estimateStandardTextWidth(order.l3Dentro2 || "", ifs2);
    var d2MaxTextW = Math.max(d2TextW1, d2TextW2, d2TextW3);
    var totalD2W = sd2Width + dentroSymGap + d2MaxTextW;
    var d2GroupStart = dentro2CX - Math.round(totalD2W / 2);
    var offsetD2 = Math.round((order.offsetSimboloDentro2 || 0) * 100);
    var d2TextX =
      d2GroupStart + sd2Width + dentroSymGap + Math.round(d2MaxTextW / 2);
    var d2TextLeft = d2TextX - Math.round(d2MaxTextW / 2);
    var sd2X = clamp(
      d2GroupStart + offsetD2,
      inside2AreaLeft,
      d2TextLeft - dentroSymGap - sd2Width
    );
    var sd2Sz = sd2Width;
    var sd2TargetH = getTargetHeight(order.simboloDentro2 || "");
    var sd2Y = dentroY + Math.round((rH - sd2TargetH) / 2);
    p.push(getSymbolPaths(order.simboloDentro2, order.cor, sd2X, sd2Y, sd2Sz));
    p.push(
      '  <text xml:space="preserve" x="' +
        d2TextX +
        '" y="' +
        d2Y1 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="bold" font-size="' +
        ifs2 +
        '" font-family="Calibri">' +
        esc(order.l1Dentro2) +
        "</text>"
    );
    if (hasD2L2) {
      p.push(
        '  <text xml:space="preserve" x="' +
          d2TextX +
          '" y="' +
          d2Y2 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs2 +
          '" font-family="Calibri">' +
          esc(order.l2Dentro2) +
          "</text>"
      );
    }
    if (hasD2L3) {
      p.push(
        '  <text xml:space="preserve" x="' +
          d2TextX +
          '" y="' +
          d2Y3 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs2 +
          '" font-family="Calibri">' +
          esc(order.l3Dentro2 || "") +
          "</text>"
      );
    }
  } else if (hasSD2 && !hasD2Text) {
    // Só símbolo sem texto: centralizar o símbolo no retângulo
    var sd2Width = getSymbolSize(order.simboloDentro2 || "");
    var offsetD2 = Math.round((order.offsetSimboloDentro2 || 0) * 100);
    var sd2X = clamp(
      dentro2CX - Math.round(sd2Width / 2) + offsetD2,
      inside2AreaLeft,
      inside2AreaLeft + insideAreaWidth - sd2Width
    );
    var sd2Sz = sd2Width;
    var sd2TargetH = getTargetHeight(order.simboloDentro2 || "");
    var sd2Y = dentroY + Math.round((rH - sd2TargetH) / 2);
    p.push(getSymbolPaths(order.simboloDentro2, order.cor, sd2X, sd2Y, sd2Sz));
  } else {
    p.push(
      '  <text xml:space="preserve" x="' +
        dentro2CX +
        '" y="' +
        d2Y1 +
        '" text-anchor="middle" fill="' +
        tCol +
        '" font-weight="bold" font-size="' +
        ifs2 +
        '" font-family="Calibri">' +
        esc(order.l1Dentro2) +
        "</text>"
    );
    if (hasD2L2) {
      p.push(
        '  <text xml:space="preserve" x="' +
          dentro2CX +
          '" y="' +
          d2Y2 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs2 +
          '" font-family="Calibri">' +
          esc(order.l2Dentro2) +
          "</text>"
      );
    }
    if (hasD2L3) {
      p.push(
        '  <text xml:space="preserve" x="' +
          dentro2CX +
          '" y="' +
          d2Y3 +
          '" text-anchor="middle" fill="' +
          tCol +
          '" font-weight="bold" font-size="' +
          ifs2 +
          '" font-family="Calibri">' +
          esc(order.l3Dentro2 || "") +
          "</text>"
      );
    }
  }

  // Badge quantidade texto
  if (order.quantidade && order.quantidade > 1) {
    p.push(
      '  <text x="19600" y="720" text-anchor="middle" fill="#FFFFFF" font-weight="bold" font-size="400" font-family="Calibri">Qtd: ' +
        order.quantidade +
        "</text>"
    );
  }

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
