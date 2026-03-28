import type { BraceletOrder, BraceletSymbol } from "@/lib/constants";
import {
  BRACELET_COLORS,
  BRACELET_SYMBOLS,
  FRONT_FONTS,
  VERSO_FONT,
  getHalfCmFromSize,
  getHalfWidthSvg,
  getSizePrefixFromSize,
  getSymbolColor,
  SYMBOL_MAX_SIZE,
  AUTISMO_SYMBOL_SIZE,
} from "@/lib/constants";

function getSymbolSize(symbolId: string): number {
  return symbolId === "autismo" ? AUTISMO_SYMBOL_SIZE : SYMBOL_MAX_SIZE;
}

interface BraceletPreviewProps {
  order: BraceletOrder;
  compact?: boolean;
}

function getBraceletColor(colorName: string) {
  const color = BRACELET_COLORS.find((c) => c.name === colorName);
  return color
    ? { hex: color.hex, textColor: color.textColor }
    : { hex: "#000000", textColor: "#FFFFFF" };
}

function getFontFamily(fontName: string): string {
  const font = FRONT_FONTS.find((f) => f.name === fontName);
  return font ? font.family : "Calibri, 'Segoe UI', sans-serif";
}

function getFontSvgSize(fontName: string): number {
  const font = FRONT_FONTS.find((f) => f.name === fontName);
  return font?.svgFontSize || 635;
}

function getFontYOffset(fontName: string): number {
  const font = FRONT_FONTS.find((f) => f.name === fontName);
  return font?.fontYOffset || 0;
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
  const symbol = BRACELET_SYMBOLS.find((s) => s.id === symbolId);
  if (!symbol) return null;

  const vb = symbol.viewBox.split(" ").map(Number);
  const scale = Math.min(size / vb[2], size / vb[3]);
  const scaledW = vb[2] * scale;
  const scaledH = vb[3] * scale;
  const tx = x + (size - scaledW) / 2 - vb[0] * scale;
  const ty = y + (size - scaledH) / 2 - vb[1] * scale;

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
          fillRule="evenodd"
          clipRule="evenodd"
        />
      ))}
    </g>
  );
}

function estimateTextWidth(text: string, fontSize: number): number {
  return Math.round(text.length * fontSize * 0.55);
}

export default function BraceletPreview({
  order,
  compact = false,
}: BraceletPreviewProps) {
  const colorInfo = getBraceletColor(order.cor);
  const braceletHex = colorInfo.hex;
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

  // Tamanho máximo do símbolo: 7.5mm = 750 SVG units
  const symSz = SYMBOL_MAX_SIZE;
  const frenteY = 5267;
  const dentroY = 7606;
  const symFrenteY = frenteY + Math.round((rectH - symSz) / 2);
  // Tamanho de fonte da frente varia por fonte selecionada
  const fontSize = getFontSvgSize(order.fonteFrente || "Segoe Print Negrito");
  const versoFontSize = 423; // Calibri Negrito 12pt fixo
  const insideFontSize = 423; // Calibri Negrito 12pt fixo
  const symGap = 100;

  // ---- FRENTE: símbolo1 + texto + símbolo2 ----
  const hasSym1 = !!order.simboloFrente;
  const hasSym2 = !!order.simboloFrente2;
  const sym1Width = hasSym1 ? getSymbolSize(order.simboloFrente!) : 0;
  const sym2Width = hasSym2 ? getSymbolSize(order.simboloFrente2!) : 0;
  const frenteTextW = estimateTextWidth(order.textoFrente, fontSize);
  let totalFrenteW = frenteTextW;
  if (hasSym1) totalFrenteW += sym1Width + symGap;
  if (hasSym2) totalFrenteW += symGap + sym2Width;
  const frenteGroupStart = frenteCX - Math.round(totalFrenteW / 2);
  const sym1X = frenteGroupStart;
  const textFrenteX =
    frenteGroupStart +
    (hasSym1 ? sym1Width + symGap : 0) +
    Math.round(frenteTextW / 2);
  const sym2X =
    textFrenteX + Math.round(frenteTextW / 2) + symGap;

  // Offset vertical de 0,7mm = 70 SVG units para centralizar textos corretamente
  const textYOffset = 70;

  // Frente text Y (sempre centralizado) + offset extra por fonte
  const fontExtraOffset = getFontYOffset(order.fonteFrente || "Segoe Print Negrito");
  const frenteTextY = frenteY + Math.round(rectH * 0.58) + textYOffset + fontExtraOffset;

  // ---- VERSO: símbolo + texto (1 ou 2 linhas) ----
  const versoL1 = order.textoVerso || "";
  const versoL2 = order.l2Verso || "";
  const hasVersoL2 = versoL2.length > 0;
  const hasSV = !!order.simboloVerso;
  const svSymWidth = hasSV ? getSymbolSize(order.simboloVerso!) : 0;
  const versoTextW = estimateTextWidth(versoL1, versoFontSize);
  let totalVersoW = versoTextW;
  if (hasSV) totalVersoW += svSymWidth + symGap;
  const versoGroupStart = versoCX - Math.round(totalVersoW / 2);
  const symVX = versoGroupStart;
  const textVersoX =
    versoGroupStart +
    (hasSV ? svSymWidth + symGap : 0) +
    Math.round(versoTextW / 2);

  let versoTextY1: number;
  let versoTextY2: number;
  if (hasVersoL2) {
    versoTextY1 = frenteY + Math.round(rectH * 0.38) + textYOffset;
    versoTextY2 = frenteY + Math.round(rectH * 0.72) + textYOffset;
  } else {
    versoTextY1 = frenteY + Math.round(rectH * 0.58) + textYOffset;
    versoTextY2 = 0;
  }

  // ---- DENTRO: centralizado se 1 linha ----
  const dentro1CX = Math.round(frenteX + rectW / 2);
  const dentro2CX = Math.round(versoX + rectW / 2);

  const hasD1L2 = (order.l2Dentro1 || "").length > 0;
  const hasD2L2 = (order.l2Dentro2 || "").length > 0;

  let d1Y1: number, d1Y2: number;
  if (hasD1L2) {
    d1Y1 = dentroY + Math.round(rectH * 0.38) + textYOffset;
    d1Y2 = dentroY + Math.round(rectH * 0.72) + textYOffset;
  } else {
    d1Y1 = dentroY + Math.round(rectH * 0.58) + textYOffset;
    d1Y2 = 0;
  }

  let d2Y1: number, d2Y2: number;
  if (hasD2L2) {
    d2Y1 = dentroY + Math.round(rectH * 0.38) + textYOffset;
    d2Y2 = dentroY + Math.round(rectH * 0.72) + textYOffset;
  } else {
    d2Y1 = dentroY + Math.round(rectH * 0.58) + textYOffset;
    d2Y2 = 0;
  }

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

      {/* 4 retângulos de pulseira */}
      <rect
        id={`${prefix}frente`}
        x={frenteX}
        y={frenteY}
        width={rectW}
        height={rectH}
        fill={braceletHex}
        {...(order.cor === "Branco" ? { stroke: "#CCCCCC", strokeWidth: 20 } : {})}
      />
      <rect
        id={`${prefix}verso`}
        x={versoX}
        y={frenteY}
        width={rectW}
        height={rectH}
        fill={braceletHex}
        {...(order.cor === "Branco" ? { stroke: "#CCCCCC", strokeWidth: 20 } : {})}
      />

      {/* FRENTE: símbolo1 + texto + símbolo2 */}
      {hasSym1 && (
        <SymbolGroup
          symbolId={order.simboloFrente!}
          braceletColor={order.cor}
          x={sym1X}
          y={frenteY + Math.round((rectH - sym1Width) / 2)}
          size={sym1Width}
        />
      )}
      <text
        x={textFrenteX}
        y={frenteTextY}
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontFrente}
        fontWeight={boldFrente ? "bold" : "normal"}
        fontSize={fontSize}
      >
        {order.textoFrente}
      </text>
      {hasSym2 && (
        <SymbolGroup
          symbolId={order.simboloFrente2!}
          braceletColor={order.cor}
          x={sym2X}
          y={frenteY + Math.round((rectH - sym2Width) / 2)}
          size={sym2Width}
        />
      )}

      {/* VERSO: símbolo + texto (1 ou 2 linhas) */}
      {hasSV && (
        <SymbolGroup
          symbolId={order.simboloVerso!}
          braceletColor={order.cor}
          x={symVX}
          y={frenteY + Math.round((rectH - svSymWidth) / 2)}
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
        >
          {versoL2}
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
        fill={braceletHex}
        {...(order.cor === "Branco" ? { stroke: "#CCCCCC", strokeWidth: 20 } : {})}
      />
      <rect
        id={`${prefix}dentro2`}
        x={versoX}
        y={dentroY}
        width={rectW}
        height={rectH}
        fill={braceletHex}
        {...(order.cor === "Branco" ? { stroke: "#CCCCCC", strokeWidth: 20 } : {})}
      />

      {/* DENTRO1: 1 ou 2 linhas, centralizado se 1 */}
      <text
        x={dentro1CX}
        y={d1Y1}
        textAnchor="middle"
        fill={textColor}
        fontFamily={insideFont}
        fontWeight="bold"
        fontSize={insideFontSize}
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
          fontSize={insideFontSize}
        >
          {order.l2Dentro1}
        </text>
      )}

      {/* DENTRO2: 1 ou 2 linhas, centralizado se 1 */}
      <text
        x={dentro2CX}
        y={d2Y1}
        textAnchor="middle"
        fill={textColor}
        fontFamily={insideFont}
        fontWeight="bold"
        fontSize={insideFontSize}
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
          fontSize={insideFontSize}
        >
          {order.l2Dentro2}
        </text>
      )}

      {!compact && (
        <rect x="0" y="10790" width={W} height="500" fill="#A9ABAE" />
      )}
    </svg>
  );
}
