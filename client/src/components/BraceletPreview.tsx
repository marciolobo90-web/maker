import type { BraceletOrder, BraceletSymbol } from "@/lib/constants";
import { BRACELET_COLORS, BRACELET_SYMBOLS, FRONT_BACK_FONTS, getHalfCmFromSize, getHalfWidthSvg, getSizePrefixFromSize } from "@/lib/constants";

interface BraceletPreviewProps {
  order: BraceletOrder;
  compact?: boolean;
}

function getBraceletColor(colorName: string) {
  const color = BRACELET_COLORS.find((c) => c.name === colorName);
  return color ? { hex: color.hex, textColor: color.textColor } : { hex: "#000000", textColor: "#FFFFFF" };
}

function getFontFamily(fontName: string): string {
  const font = FRONT_BACK_FONTS.find((f) => f.name === fontName);
  return font ? font.family : "Calibri, 'Segoe UI', sans-serif";
}

function isBoldFont(fontName: string): boolean {
  return fontName === "Calibri Negrito";
}

// Renderiza símbolo usando <g transform> ao invés de <svg> aninhado
// Isso evita que o CorelDRAW bloqueie os elementos
function SymbolGroup({ symbol, x, y, size }: { symbol: BraceletSymbol; x: number; y: number; size: number }) {
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

  return (
    <g transform={`translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${scale.toFixed(6)})`}>
      {symbol.paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </g>
  );
}

function estimateTextWidth(text: string, fontSize: number): number {
  return Math.round(text.length * fontSize * 0.55);
}

export default function BraceletPreview({ order, compact = false }: BraceletPreviewProps) {
  const colorInfo = getBraceletColor(order.cor);
  const braceletHex = colorInfo.hex;
  const textColor = order.corTexto || colorInfo.textColor;
  const fontFrente = getFontFamily(order.fonteFrente || "Bahnschrift");
  const fontVerso = getFontFamily(order.fonteVerso || "Bahnschrift");
  const boldFrente = isBoldFont(order.fonteFrente);
  const boldVerso = isBoldFont(order.fonteVerso);
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

  const padding = 750;
  const frenteUsableStart = frenteX + padding;
  const frenteUsableEnd = frenteX + rectW - padding;
  const versoUsableStart = versoX + padding;
  const versoUsableEnd = versoX + rectW - padding;

  const frenteCenterX = Math.round((frenteUsableStart + frenteUsableEnd) / 2);
  const versoCenterX = Math.round((versoUsableStart + versoUsableEnd) / 2);

  const symbolFrente = BRACELET_SYMBOLS.find((s) => s.id === order.simboloFrente);
  const symbolVerso = BRACELET_SYMBOLS.find((s) => s.id === order.simboloVerso);

  const symbolSize = rectH - 100;
  const symbolY = 5267 + 50;
  const fontSize = 423;
  const symbolGap = 100;

  const frenteTextW = estimateTextWidth(order.textoFrente, fontSize);
  const versoTextW = estimateTextWidth(order.textoVerso, fontSize);

  let symbolFrenteX = 0, textFrenteX = frenteCenterX;
  if (symbolFrente) {
    const totalFrenteW = symbolSize + symbolGap + frenteTextW;
    const frenteGroupStart = frenteCenterX - Math.round(totalFrenteW / 2);
    symbolFrenteX = frenteGroupStart;
    textFrenteX = frenteGroupStart + symbolSize + symbolGap + Math.round(frenteTextW / 2);
  }

  let symbolVersoX = 0, textVersoX = versoCenterX;
  if (symbolVerso) {
    const totalVersoW = symbolSize + symbolGap + versoTextW;
    const versoGroupStart = versoCenterX - Math.round(totalVersoW / 2);
    symbolVersoX = versoGroupStart;
    textVersoX = versoGroupStart + symbolSize + symbolGap + Math.round(versoTextW / 2);
  }

  const dentro1CenterX = Math.round((frenteX + padding + frenteX + rectW - padding) / 2);
  const dentro2CenterX = Math.round((versoX + padding + versoX + rectW - padding) / 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: compact ? "200px" : "400px" }}>
      <rect x="0" y="0" width={W} height={H} fill="#FFFFFF" />
      <rect x="0" y="0" width={W} height="1200" fill="#606062" />
      <rect x="0" y="1200" width={W} height="1500" fill="#D2D3D5" />

      <text x="800" y="850" textAnchor="start" fill="#FEFEFE" fontFamily="Calibri, sans-serif" fontWeight="bold" fontSize="768">
        Cliente: {order.nomeCliente}
      </text>

      {order.quantidade && order.quantidade > 1 && (
        <g>
          <rect x="18500" y="300" width="2200" height="600" rx="100" fill="#F58634" />
          <text x="19600" y="720" textAnchor="middle" fill="#FFFFFF" fontFamily="Calibri, sans-serif" fontWeight="bold" fontSize="400">
            Qtd: {order.quantidade}
          </text>
        </g>
      )}

      <text x="800" y="2050" textAnchor="start" fill="#373435" fontFamily="Arial, sans-serif" fontSize="500">
        Pulseira de silicone: Personalização baixo relevo + aplicação de tinta
      </text>

      <text x="10500" y="3854" textAnchor="middle" fill="#373435" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="529">
        {order.tamanhoCm} cm ({order.tamanhoLabel})
      </text>

      <text x="10500" y="4900" textAnchor="middle" fill="#727376" fontFamily="Arial, sans-serif" fontStyle="italic" fontSize="503">
        frente
      </text>

      <rect id={`${prefix}frente`} x={frenteX} y="5267" width={rectW} height={rectH} fill={braceletHex} />
      <rect id={`${prefix}verso`} x={versoX} y="5267" width={rectW} height={rectH} fill={braceletHex} />

      {symbolFrente && (
        <SymbolGroup symbol={symbolFrente} x={symbolFrenteX} y={symbolY} size={symbolSize} />
      )}
      <text
        x={textFrenteX}
        y="5977"
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontFrente}
        fontWeight={boldFrente ? "bold" : "normal"}
        fontSize={fontSize}
      >
        {order.textoFrente}
      </text>

      {symbolVerso && (
        <SymbolGroup symbol={symbolVerso} x={symbolVersoX} y={symbolY} size={symbolSize} />
      )}
      <text
        x={textVersoX}
        y="5977"
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontVerso}
        fontWeight={boldVerso ? "bold" : "normal"}
        fontSize={fontSize}
      >
        {order.textoVerso}
      </text>

      <text x="10500" y="7350" textAnchor="middle" fill="#727376" fontFamily="Arial, sans-serif" fontStyle="italic" fontSize="503">
        dentro
      </text>

      <rect id={`${prefix}dentro1`} x={frenteX} y="7606" width={rectW} height={rectH} fill={braceletHex} />
      <rect id={`${prefix}dentro2`} x={versoX} y="7606" width={rectW} height={rectH} fill={braceletHex} />

      <text x={dentro1CenterX} y="8076" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l1Dentro1}
      </text>
      <text x={dentro1CenterX} y="8486" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l2Dentro1}
      </text>
      <text x={dentro2CenterX} y="8076" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l1Dentro2}
      </text>
      <text x={dentro2CenterX} y="8486" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l2Dentro2}
      </text>

      {!compact && <rect x="0" y="10790" width={W} height="500" fill="#A9ABAE" />}
    </svg>
  );
}
