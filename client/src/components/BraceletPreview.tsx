import type { BraceletOrder } from "@/lib/constants";
import {
  BRACELET_COLORS,
  BRACELET_SYMBOLS,
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
} from "@/lib/constants";

function getTargetHeight(symbolId: string): number {
  if (SYMBOL_CUSTOM_HEIGHT[symbolId] !== undefined)
    return SYMBOL_CUSTOM_HEIGHT[symbolId];
  return SYMBOL_MAX_SIZE;
}

function getSymbolSize(symbolId: string): number {
  const symbol = BRACELET_SYMBOLS.find(s => s.id === symbolId);
  if (!symbol) return SYMBOL_MAX_SIZE;
  const vb = symbol.viewBox.split(" ").map(Number);
  const targetH = getTargetHeight(symbolId);
  const sc = targetH / vb[3];
  return Math.round(vb[2] * sc);
}

interface BraceletPreviewProps {
  order: BraceletOrder;
  compact?: boolean;
}

function getBraceletColor(colorName: string) {
  const color = BRACELET_COLORS.find(c => c.name === colorName);
  return color
    ? { hex: color.hex, textColor: color.textColor }
    : { hex: "#000000", textColor: "#FFFFFF" };
}

function getFontFamily(fontName: string): string {
  const font = FRONT_FONTS.find(f => f.name === fontName);
  return font ? font.family : "Calibri, 'Segoe UI', sans-serif";
}

function isBoldFont(fontName: string): boolean {
  return fontName !== "Kids Station" && fontName !== "Milky Matcha";
}

function SymbolGroup({
  symbolId,
  braceletColor,
  x,
  y,
  size,
}: {
  symbolId: string;
  braceletColor: string;
  x: number;
  y: number;
  size: number;
}) {
  const symbol = BRACELET_SYMBOLS.find(s => s.id === symbolId);
  if (!symbol) return null;

  const vb = symbol.viewBox.split(" ").map(Number);
  // Escala pela altura = 7,5mm (altura fixa, largura proporcional)
  // Sempre usa SYMBOL_MAX_SIZE para a altura, 'size' é a largura renderizada para posicionamento
  const targetH = getTargetHeight(symbolId);
  const scale = targetH / vb[3];
  const scaledW = vb[2] * scale;
  const tx = x + (size - scaledW) / 2 - vb[0] * scale;
  // O chamador já centraliza `y` usando a altura renderizada. Usar `size`
  // aqui deslocava símbolos largos (como o tubarão) para baixo, pois `size`
  // representa a largura do símbolo.
  const ty = y - vb[1] * scale;

  const overrideColor = getSymbolColor(symbolId, braceletColor);

  return (
    <g
      transform={`translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${scale.toFixed(6)})`}
    >
      {symbol.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={overrideColor !== null ? overrideColor : p.fill}
          fillRule={symbol.fillRule || "evenodd"}
          clipRule={symbol.fillRule || "evenodd"}
        />
      ))}
    </g>
  );
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (maximum < minimum) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

export default function BraceletPreview({
  order,
  compact = false,
}: BraceletPreviewProps) {
  const colorInfo = getBraceletColor(order.cor);
  const braceletHex = colorInfo.hex;
  const isGradient =
    order.cor === "Colorido" ||
    order.cor === "Mesclado Rosa" ||
    order.cor === "Mesclado Azul";
  const gradientId =
    order.cor === "Colorido"
      ? "coloridoGrad"
      : order.cor === "Mesclado Rosa"
        ? "rosaGrad"
        : order.cor === "Mesclado Azul"
          ? "azulGrad"
          : "";
  const gradientFill = isGradient ? `url(#${gradientId})` : braceletHex;
  const textColor = order.corTexto || colorInfo.textColor;
  const fontFrente = getFontFamily(order.fonteFrente || "Segoe Print Negrito");
  // Verso sempre Calibri Negrito
  const fontVerso = VERSO_FONT.family;
  const boldFrente = isBoldFont(order.fonteFrente || "Segoe Print Negrito");
  const boldVerso = true;
  const insideFont = "Calibri, 'Segoe UI', sans-serif";

  const W = 21000;
  const H = compact ? 9200 : 11300;

  const sizeName = order.tamanhoLabel || order.tamanho;
  const halfCm = getHalfCmFromSize(sizeName);
  const rectW = getHalfWidthSvg(halfCm);
  const rectH = 1200;

  const prefix = getSizePrefixFromSize(sizeName);

  const totalW = rectW * 2;
  const startX = Math.round((W - totalW) / 2);
  const frenteX = startX;
  const versoX = startX + rectW;

  const frenteCX = Math.round(frenteX + rectW / 2);
  const versoCX = Math.round(versoX + rectW / 2);

  const frenteY = 5267;
  const dentroY = 7606;
  // Tamanho de fonte da frente: auto-ajuste baseado na área máxima de personalização
  const frenteL2 = order.l2Frente || "";
  const hasFrenteL2 = frenteL2.length > 0;
  const fontSize = calcFrontFontSize(
    order.textoFrente,
    order.fonteFrente || "Segoe Print Negrito",
    sizeName,
    order.simboloFrente,
    order.simboloFrente2,
    frenteL2
  );
  // Tamanho de fonte do verso: auto-ajuste baseado na área máxima (suporta 3 linhas)
  const versoFontSize = calcVersoFontSize(
    order.textoVerso || "",
    order.l2Verso || "",
    sizeName,
    order.simboloVerso,
    order.l3Verso || ""
  );
  // Tamanho de fonte do dentro1: auto-ajuste (suporta 3 linhas)
  const inside1FontSize = calcDentroFontSize(
    order.l1Dentro1 || "",
    order.l2Dentro1 || "",
    sizeName,
    order.simboloDentro1,
    order.l3Dentro1 || ""
  );
  // Tamanho de fonte do dentro2: auto-ajuste (suporta 3 linhas)
  const inside2FontSize = calcDentroFontSize(
    order.l1Dentro2 || "",
    order.l2Dentro2 || "",
    sizeName,
    order.simboloDentro2,
    order.l3Dentro2 || ""
  );
  const symGap = SYMBOL_TEXT_GAP;
  const dentroSymGap = SYMBOL_TEXT_GAP;

  // ---- FRENTE: símbolo1 + texto + símbolo2 ----
  const hasSym1 = !!order.simboloFrente;
  const hasSym2 = !!order.simboloFrente2;
  const sym1Width = hasSym1 ? getSymbolSize(order.simboloFrente!) : 0;
  const sym2Width = hasSym2 ? getSymbolSize(order.simboloFrente2!) : 0;
  const frontFontName = order.fonteFrente || "Segoe Print Negrito";
  // A linha mais larga define o espaço reservado para o bloco de texto.
  const frenteTextW1 = estimateFrontTextWidth(
    order.textoFrente,
    fontSize,
    frontFontName
  );
  const frenteTextW2 = hasFrenteL2
    ? estimateFrontTextWidth(frenteL2, fontSize, frontFontName)
    : 0;
  const frenteTextW = Math.max(frenteTextW1, frenteTextW2);
  let totalFrenteW = frenteTextW;
  if (hasSym1) totalFrenteW += sym1Width + symGap;
  if (hasSym2) totalFrenteW += symGap + sym2Width;
  const frontAreaWidth = getFrontMaxWidthSvg(sizeName);
  const frontAreaLeft = frenteCX - Math.round(frontAreaWidth / 2);
  const frontAreaRight = frenteCX + Math.round(frontAreaWidth / 2);
  const frenteGroupStart = frenteCX - Math.round(totalFrenteW / 2);
  // Offsets horizontais dos símbolos (mm → SVG units)
  const offsetSym1 = Math.round((order.offsetSimboloFrente || 0) * 100);
  const offsetSym2 = Math.round((order.offsetSimboloFrente2 || 0) * 100);
  const textFrenteX =
    frenteGroupStart +
    (hasSym1 ? sym1Width + symGap : 0) +
    Math.round(frenteTextW / 2);
  const frontTextLeft = textFrenteX - Math.round(frenteTextW / 2);
  const frontTextRight = textFrenteX + Math.round(frenteTextW / 2);
  const sym1X = hasSym1
    ? clamp(
        frenteGroupStart + offsetSym1,
        frontAreaLeft,
        frontTextLeft - symGap - sym1Width
      )
    : 0;
  const sym2BaseX = frontTextRight + symGap;
  const sym2X = hasSym2
    ? clamp(sym2BaseX + offsetSym2, sym2BaseX, frontAreaRight - sym2Width)
    : 0;

  const frontBaselines = getFrontTextBaselines(
    frontFontName,
    fontSize,
    hasFrenteL2 ? 2 : 1,
    frenteY,
    rectH
  );
  const frenteTextY1 = frontBaselines[0];
  const frenteTextY2 = frontBaselines[1] || 0;

  // ---- VERSO: símbolo + texto (1, 2 ou 3 linhas) ----
  const versoL1 = order.textoVerso || "";
  const versoL2 = order.l2Verso || "";
  const versoL3 = order.l3Verso || "";
  const hasVersoL2 = versoL2.length > 0;
  const hasVersoL3 = versoL3.length > 0;
  const hasSV = !!order.simboloVerso;
  const svSymWidth = hasSV ? getSymbolSize(order.simboloVerso!) : 0;
  const versoTextW = Math.max(
    estimateStandardTextWidth(versoL1, versoFontSize),
    estimateStandardTextWidth(versoL2, versoFontSize),
    estimateStandardTextWidth(versoL3, versoFontSize)
  );
  let totalVersoW = versoTextW;
  if (hasSV) totalVersoW += svSymWidth + symGap;
  const versoAreaWidth = getVersoMaxWidthSvg(sizeName);
  const versoAreaLeft = versoCX - Math.round(versoAreaWidth / 2);
  const versoGroupStart = versoCX - Math.round(totalVersoW / 2);
  const offsetSymVerso = Math.round((order.offsetSimboloVerso || 0) * 100);
  const textVersoX =
    versoGroupStart +
    (hasSV ? svSymWidth + symGap : 0) +
    Math.round(versoTextW / 2);
  const versoTextLeft = textVersoX - Math.round(versoTextW / 2);
  const symVX = hasSV
    ? clamp(
        versoGroupStart + offsetSymVerso,
        versoAreaLeft,
        versoTextLeft - symGap - svSymWidth
      )
    : 0;

  const versoLines = hasVersoL3 ? 3 : hasVersoL2 ? 2 : 1;
  const versoBaselines = getStandardTextBaselines(
    versoFontSize,
    versoLines,
    frenteY,
    rectH
  );
  const versoTextY1 = versoBaselines[0];
  const versoTextY2 = versoBaselines[1] || 0;
  const versoTextY3 = versoBaselines[2] || 0;

  // ---- DENTRO: centralizado se 1 linha ----
  const dentro1CX = Math.round(frenteX + rectW / 2);
  const dentro2CX = Math.round(versoX + rectW / 2);

  const hasD1L2 = (order.l2Dentro1 || "").length > 0;
  const hasD1L3 = (order.l3Dentro1 || "").length > 0;
  const hasD2L2 = (order.l2Dentro2 || "").length > 0;
  const hasD2L3 = (order.l3Dentro2 || "").length > 0;

  const insideAreaWidth = getDentroMaxWidthSvg(sizeName);
  const inside1AreaLeft = dentro1CX - Math.round(insideAreaWidth / 2);
  const inside2AreaLeft = dentro2CX - Math.round(insideAreaWidth / 2);

  const d1Lines = hasD1L3 ? 3 : hasD1L2 ? 2 : 1;
  const d1Baselines = getStandardTextBaselines(
    inside1FontSize,
    d1Lines,
    dentroY,
    rectH
  );
  const d1Y1 = d1Baselines[0];
  const d1Y2 = d1Baselines[1] || 0;
  const d1Y3 = d1Baselines[2] || 0;

  const d2Lines = hasD2L3 ? 3 : hasD2L2 ? 2 : 1;
  const d2Baselines = getStandardTextBaselines(
    inside2FontSize,
    d2Lines,
    dentroY,
    rectH
  );
  const d2Y1 = d2Baselines[0];
  const d2Y2 = d2Baselines[1] || 0;
  const d2Y3 = d2Baselines[2] || 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      style={{ maxHeight: compact ? "200px" : "400px" }}
    >
      <rect x="0" y="0" width={W} height={H} fill="#FFFFFF" />
      <rect x="0" y="0" width={W} height="1200" fill="#606062" />
      <rect x="0" y="1200" width={W} height="1500" fill="#D2D3D5" />

      <text
        x="800"
        y="850"
        textAnchor="start"
        fill="#FEFEFE"
        fontFamily="Calibri, sans-serif"
        fontWeight="bold"
        fontSize="768"
      >
        Cliente: {order.nomeCliente}
      </text>

      {order.quantidade && order.quantidade > 1 && (
        <g>
          <rect
            x="18500"
            y="300"
            width="2200"
            height="600"
            rx="100"
            fill="#F58634"
          />
          <text
            x="19600"
            y="720"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Calibri, sans-serif"
            fontWeight="bold"
            fontSize="400"
          >
            Qtd: {order.quantidade}
          </text>
        </g>
      )}

      <text
        x="800"
        y="2050"
        textAnchor="start"
        fill="#373435"
        fontFamily="Arial, sans-serif"
        fontSize="500"
      >
        Pulseira de silicone: Personalização baixo relevo + aplicação de tinta
      </text>

      <text
        x="10500"
        y="3854"
        textAnchor="middle"
        fill="#373435"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="529"
      >
        {order.tamanhoCm} cm ({order.tamanhoLabel})
      </text>

      <text
        x="10500"
        y="4900"
        textAnchor="middle"
        fill="#727376"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontSize="503"
      >
        frente
      </text>

      {/* Gradientes para cores especiais */}
      {isGradient && (
        <defs>
          {order.cor === "Colorido" && (
            <linearGradient
              id="coloridoGrad"
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0" stopColor="#FCDA11" />
              <stop offset="0.2" stopColor="#00A6D6" />
              <stop offset="0.729" stopColor="#FF0099" />
              <stop offset="1" stopColor="#FCDA11" />
            </linearGradient>
          )}
          {order.cor === "Mesclado Rosa" && (
            <linearGradient id="rosaGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0" stopColor="#FF0099" />
              <stop offset="0.2" stopColor="#FF9EC2" />
              <stop offset="0.38" stopColor="#FF0099" />
              <stop offset="0.568" stopColor="#FF9EC2" />
              <stop offset="0.788" stopColor="#FF0099" />
              <stop offset="1" stopColor="#FF9EC2" />
            </linearGradient>
          )}
          {order.cor === "Mesclado Azul" && (
            <linearGradient id="azulGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0" stopColor="#171796" />
              <stop offset="0.2" stopColor="#00A3E0" />
              <stop offset="0.38" stopColor="#171796" />
              <stop offset="0.568" stopColor="#00A3E0" />
              <stop offset="0.788" stopColor="#171796" />
              <stop offset="1" stopColor="#00A3E0" />
            </linearGradient>
          )}
        </defs>
      )}

      {/* 4 retângulos de pulseira */}
      <rect
        id={`${prefix}frente`}
        x={frenteX}
        y={frenteY}
        width={rectW}
        height={rectH}
        fill={gradientFill}
        {...(order.cor === "Branco"
          ? { stroke: "#CCCCCC", strokeWidth: 20 }
          : {})}
      />
      <rect
        id={`${prefix}verso`}
        x={versoX}
        y={frenteY}
        width={rectW}
        height={rectH}
        fill={gradientFill}
        {...(order.cor === "Branco"
          ? { stroke: "#CCCCCC", strokeWidth: 20 }
          : {})}
      />

      {/* FRENTE: símbolo1 + texto + símbolo2 */}
      {hasSym1 && (
        <SymbolGroup
          symbolId={order.simboloFrente!}
          braceletColor={order.cor}
          x={sym1X}
          y={
            frenteY +
            Math.round((rectH - getTargetHeight(order.simboloFrente!)) / 2)
          }
          size={sym1Width}
        />
      )}
      <text
        x={textFrenteX}
        y={frenteTextY1}
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontFrente}
        fontWeight={boldFrente ? "bold" : "normal"}
        fontSize={fontSize}
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
      >
        {order.textoFrente}
      </text>
      {hasFrenteL2 && (
        <text
          x={textFrenteX}
          y={frenteTextY2}
          textAnchor="middle"
          fill={textColor}
          fontFamily={fontFrente}
          fontWeight={boldFrente ? "bold" : "normal"}
          fontSize={fontSize}
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
        >
          {frenteL2}
        </text>
      )}
      {hasSym2 && (
        <SymbolGroup
          symbolId={order.simboloFrente2!}
          braceletColor={order.cor}
          x={sym2X}
          y={
            frenteY +
            Math.round((rectH - getTargetHeight(order.simboloFrente2!)) / 2)
          }
          size={sym2Width}
        />
      )}

      {/* VERSO: símbolo + texto (1 ou 2 linhas) */}
      {hasSV && (
        <SymbolGroup
          symbolId={order.simboloVerso!}
          braceletColor={order.cor}
          x={symVX}
          y={
            frenteY +
            Math.round((rectH - getTargetHeight(order.simboloVerso!)) / 2)
          }
          size={svSymWidth}
        />
      )}
      <text
        x={textVersoX}
        y={versoTextY1}
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontVerso}
        fontWeight={boldVerso ? "bold" : "normal"}
        fontSize={versoFontSize}
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
      >
        {versoL1}
      </text>
      {hasVersoL2 && (
        <text
          x={textVersoX}
          y={versoTextY2}
          textAnchor="middle"
          fill={textColor}
          fontFamily={fontVerso}
          fontWeight={boldVerso ? "bold" : "normal"}
          fontSize={versoFontSize}
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
        >
          {versoL2}
        </text>
      )}
      {hasVersoL3 && (
        <text
          x={textVersoX}
          y={versoTextY3}
          textAnchor="middle"
          fill={textColor}
          fontFamily={fontVerso}
          fontWeight={boldVerso ? "bold" : "normal"}
          fontSize={versoFontSize}
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
        >
          {versoL3}
        </text>
      )}

      <text
        x="10500"
        y="7350"
        textAnchor="middle"
        fill="#727376"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontSize="503"
      >
        dentro
      </text>

      <rect
        id={`${prefix}dentro1`}
        x={frenteX}
        y={dentroY}
        width={rectW}
        height={rectH}
        fill={gradientFill}
        {...(order.cor === "Branco"
          ? { stroke: "#CCCCCC", strokeWidth: 20 }
          : {})}
      />
      <rect
        id={`${prefix}dentro2`}
        x={versoX}
        y={dentroY}
        width={rectW}
        height={rectH}
        fill={gradientFill}
        {...(order.cor === "Branco"
          ? { stroke: "#CCCCCC", strokeWidth: 20 }
          : {})}
      />

      {/* DENTRO1: símbolo WhatsApp (opcional) + 1 ou 2 linhas */}
      {(() => {
        const hasSD1 = !!order.simboloDentro1;
        const hasD1Text = (order.l1Dentro1 || "").length > 0;
        if (hasSD1 && hasD1Text) {
          const sd1Width = getSymbolSize(order.simboloDentro1!);
          const d1TextW1 = estimateStandardTextWidth(
            order.l1Dentro1,
            inside1FontSize
          );
          const d1TextW2 = estimateStandardTextWidth(
            order.l2Dentro1,
            inside1FontSize
          );
          const d1TextW3 = estimateStandardTextWidth(
            order.l3Dentro1 || "",
            inside1FontSize
          );
          const d1MaxTextW = Math.max(d1TextW1, d1TextW2, d1TextW3);
          const totalD1W = sd1Width + dentroSymGap + d1MaxTextW;
          const d1GroupStart = dentro1CX - Math.round(totalD1W / 2);
          const offsetD1 = Math.round((order.offsetSimboloDentro1 || 0) * 100);
          const d1TextX =
            d1GroupStart + sd1Width + dentroSymGap + Math.round(d1MaxTextW / 2);
          const d1TextLeft = d1TextX - Math.round(d1MaxTextW / 2);
          const sd1X = clamp(
            d1GroupStart + offsetD1,
            inside1AreaLeft,
            d1TextLeft - dentroSymGap - sd1Width
          );
          const sd1TargetH = getTargetHeight(order.simboloDentro1!);
          const sd1Y = dentroY + Math.round((rectH - sd1TargetH) / 2);
          return (
            <>
              <SymbolGroup
                symbolId={order.simboloDentro1!}
                braceletColor={order.cor}
                x={sd1X}
                y={sd1Y}
                size={sd1Width}
              />
              <text
                x={d1TextX}
                y={d1Y1}
                textAnchor="middle"
                fill={textColor}
                fontFamily={insideFont}
                fontWeight="bold"
                fontSize={inside1FontSize}
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
              >
                {order.l1Dentro1}
              </text>
              {hasD1L2 && (
                <text
                  x={d1TextX}
                  y={d1Y2}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside1FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l2Dentro1}
                </text>
              )}
              {hasD1L3 && (
                <text
                  x={d1TextX}
                  y={d1Y3}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside1FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l3Dentro1}
                </text>
              )}
            </>
          );
        } else if (hasSD1 && !hasD1Text) {
          const sd1Width = getSymbolSize(order.simboloDentro1!);
          const offsetD1 = Math.round((order.offsetSimboloDentro1 || 0) * 100);
          const sd1X = clamp(
            dentro1CX - Math.round(sd1Width / 2) + offsetD1,
            inside1AreaLeft,
            inside1AreaLeft + insideAreaWidth - sd1Width
          );
          const sd1TargetH = getTargetHeight(order.simboloDentro1!);
          const sd1Y = dentroY + Math.round((rectH - sd1TargetH) / 2);
          return (
            <SymbolGroup
              symbolId={order.simboloDentro1!}
              braceletColor={order.cor}
              x={sd1X}
              y={sd1Y}
              size={sd1Width}
            />
          );
        } else {
          return (
            <>
              <text
                x={dentro1CX}
                y={d1Y1}
                textAnchor="middle"
                fill={textColor}
                fontFamily={insideFont}
                fontWeight="bold"
                fontSize={inside1FontSize}
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
              >
                {order.l1Dentro1}
              </text>
              {hasD1L2 && (
                <text
                  x={dentro1CX}
                  y={d1Y2}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside1FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l2Dentro1}
                </text>
              )}
              {hasD1L3 && (
                <text
                  x={dentro1CX}
                  y={d1Y3}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside1FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l3Dentro1}
                </text>
              )}
            </>
          );
        }
      })()}

      {/* DENTRO2: símbolo WhatsApp (opcional) + 1 ou 2 linhas */}
      {(() => {
        const hasSD2 = !!order.simboloDentro2;
        const hasD2Text = (order.l1Dentro2 || "").length > 0;
        if (hasSD2 && hasD2Text) {
          const sd2Width = getSymbolSize(order.simboloDentro2!);
          const d2TextW1 = estimateStandardTextWidth(
            order.l1Dentro2,
            inside2FontSize
          );
          const d2TextW2 = estimateStandardTextWidth(
            order.l2Dentro2,
            inside2FontSize
          );
          const d2TextW3 = estimateStandardTextWidth(
            order.l3Dentro2 || "",
            inside2FontSize
          );
          const d2MaxTextW = Math.max(d2TextW1, d2TextW2, d2TextW3);
          const totalD2W = sd2Width + dentroSymGap + d2MaxTextW;
          const d2GroupStart = dentro2CX - Math.round(totalD2W / 2);
          const offsetD2 = Math.round((order.offsetSimboloDentro2 || 0) * 100);
          const d2TextX =
            d2GroupStart + sd2Width + dentroSymGap + Math.round(d2MaxTextW / 2);
          const d2TextLeft = d2TextX - Math.round(d2MaxTextW / 2);
          const sd2X = clamp(
            d2GroupStart + offsetD2,
            inside2AreaLeft,
            d2TextLeft - dentroSymGap - sd2Width
          );
          const sd2TargetH = getTargetHeight(order.simboloDentro2!);
          const sd2Y = dentroY + Math.round((rectH - sd2TargetH) / 2);
          return (
            <>
              <SymbolGroup
                symbolId={order.simboloDentro2!}
                braceletColor={order.cor}
                x={sd2X}
                y={sd2Y}
                size={sd2Width}
              />
              <text
                x={d2TextX}
                y={d2Y1}
                textAnchor="middle"
                fill={textColor}
                fontFamily={insideFont}
                fontWeight="bold"
                fontSize={inside2FontSize}
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
              >
                {order.l1Dentro2}
              </text>
              {hasD2L2 && (
                <text
                  x={d2TextX}
                  y={d2Y2}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside2FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l2Dentro2}
                </text>
              )}
              {hasD2L3 && (
                <text
                  x={d2TextX}
                  y={d2Y3}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside2FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l3Dentro2}
                </text>
              )}
            </>
          );
        } else if (hasSD2 && !hasD2Text) {
          const sd2Width = getSymbolSize(order.simboloDentro2!);
          const offsetD2 = Math.round((order.offsetSimboloDentro2 || 0) * 100);
          const sd2X = clamp(
            dentro2CX - Math.round(sd2Width / 2) + offsetD2,
            inside2AreaLeft,
            inside2AreaLeft + insideAreaWidth - sd2Width
          );
          const sd2TargetH = getTargetHeight(order.simboloDentro2!);
          const sd2Y = dentroY + Math.round((rectH - sd2TargetH) / 2);
          return (
            <SymbolGroup
              symbolId={order.simboloDentro2!}
              braceletColor={order.cor}
              x={sd2X}
              y={sd2Y}
              size={sd2Width}
            />
          );
        } else {
          return (
            <>
              <text
                x={dentro2CX}
                y={d2Y1}
                textAnchor="middle"
                fill={textColor}
                fontFamily={insideFont}
                fontWeight="bold"
                fontSize={inside2FontSize}
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
              >
                {order.l1Dentro2}
              </text>
              {hasD2L2 && (
                <text
                  x={dentro2CX}
                  y={d2Y2}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside2FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l2Dentro2}
                </text>
              )}
              {hasD2L3 && (
                <text
                  x={dentro2CX}
                  y={d2Y3}
                  textAnchor="middle"
                  fill={textColor}
                  fontFamily={insideFont}
                  fontWeight="bold"
                  fontSize={inside2FontSize}
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                >
                  {order.l3Dentro2}
                </text>
              )}
            </>
          );
        }
      })()}

      {!compact && (
        <rect x="0" y="10790" width={W} height="500" fill="#A9ABAE" />
      )}
    </svg>
  );
}
