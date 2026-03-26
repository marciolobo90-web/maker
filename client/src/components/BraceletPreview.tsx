import type { BraceletOrder, BraceletSymbol } from "@/lib/constants";
import { BRACELET_COLORS, BRACELET_SYMBOLS, FRONT_BACK_FONTS, getHalfCmFromSize, getHalfWidthSvg } from "@/lib/constants";

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

// Renders a symbol inline as a nested <svg> with the correct viewBox and paths
function SymbolInline({ symbol, x, y, size }: { symbol: BraceletSymbol; x: number; y: number; size: number }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox={symbol.viewBox} preserveAspectRatio="xMidYMid meet">
      {symbol.paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </svg>
  );
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

  // Calcular larguras proporcionais baseadas no tamanho real da pulseira
  const halfCm = getHalfCmFromSize(order.tamanhoLabel || order.tamanho);
  const rectW = getHalfWidthSvg(halfCm);
  const rectH = 1200;

  // Centralizar os dois retângulos lado a lado no SVG
  const totalW = rectW * 2;
  const gap = 0; // sem gap entre frente e verso (é uma pulseira contínua)
  const startX = Math.round((W - totalW - gap) / 2);
  const frenteX = startX;
  const versoX = startX + rectW + gap;

  const symbolFrente = BRACELET_SYMBOLS.find((s) => s.id === order.simboloFrente);
  const symbolVerso = BRACELET_SYMBOLS.find((s) => s.id === order.simboloVerso);

  // Posições de texto centralizadas em cada retângulo
  const frenteCenterX = frenteX + Math.round(rectW / 2);
  const versoCenterX = versoX + Math.round(rectW / 2);

  // Tamanho do símbolo proporcional à altura do retângulo
  const symbolSize = rectH - 100;
  const symbolY = 5267 + 50;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: compact ? "200px" : "400px" }}>
      {/* Background */}
      <rect x="0" y="0" width={W} height={H} fill="#FFFFFF" />

      {/* Header bar */}
      <rect x="0" y="0" width={W} height="1200" fill="#606062" />

      {/* Sub-header bar */}
      <rect x="0" y="1200" width={W} height="1500" fill="#D2D3D5" />

      {/* Client name */}
      <text x="800" y="850" textAnchor="start" fill="#FEFEFE" fontFamily="Calibri, sans-serif" fontWeight="bold" fontSize="768">
        Cliente: {order.nomeCliente}
      </text>

      {/* Quantity badge */}
      {order.quantidade && order.quantidade > 1 && (
        <g>
          <rect x="18500" y="300" width="2200" height="600" rx="100" fill="#F58634" />
          <text x="19600" y="720" textAnchor="middle" fill="#FFFFFF" fontFamily="Calibri, sans-serif" fontWeight="bold" fontSize="400">
            Qtd: {order.quantidade}
          </text>
        </g>
      )}

      {/* Product description */}
      <text x="800" y="2050" textAnchor="start" fill="#373435" fontFamily="Arial, sans-serif" fontSize="500">
        Pulseira de silicone: Personalização baixo relevo + aplicação de tinta
      </text>

      {/* Size */}
      <text x="10500" y="3854" textAnchor="middle" fill="#373435" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="529">
        {order.tamanhoCm} cm ({order.tamanhoLabel})
      </text>

      {/* "frente" label */}
      <text x="10500" y="4900" textAnchor="middle" fill="#727376" fontFamily="Arial, sans-serif" fontStyle="italic" fontSize="503">
        frente
      </text>

      {/* Frente rectangle */}
      <rect x={frenteX} y="5267" width={rectW} height={rectH} fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Verso rectangle */}
      <rect x={versoX} y="5267" width={rectW} height={rectH} fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Symbol on frente */}
      {symbolFrente && (
        <SymbolInline symbol={symbolFrente} x={frenteX + 50} y={symbolY} size={symbolSize} />
      )}

      {/* Frente text */}
      <text
        x={symbolFrente ? frenteCenterX + Math.round(symbolSize / 2) : frenteCenterX}
        y="5977"
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontFrente}
        fontWeight={boldFrente ? "bold" : "normal"}
        fontSize="423"
      >
        {order.textoFrente}
      </text>

      {/* Symbol on verso */}
      {symbolVerso && (
        <SymbolInline symbol={symbolVerso} x={versoX + 50} y={symbolY} size={symbolSize} />
      )}

      {/* Verso text */}
      <text
        x={symbolVerso ? versoCenterX + Math.round(symbolSize / 2) : versoCenterX}
        y="5977"
        textAnchor="middle"
        fill={textColor}
        fontFamily={fontVerso}
        fontWeight={boldVerso ? "bold" : "normal"}
        fontSize="423"
      >
        {order.textoVerso}
      </text>

      {/* "dentro" label */}
      <text x="10500" y="7350" textAnchor="middle" fill="#727376" fontFamily="Arial, sans-serif" fontStyle="italic" fontSize="503">
        dentro
      </text>

      {/* Inside rectangle 1 */}
      <rect x={frenteX} y="7606" width={rectW} height={rectH} fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Inside rectangle 2 */}
      <rect x={versoX} y="7606" width={rectW} height={rectH} fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Inside texts - always Calibri */}
      <text x={frenteCenterX} y="8076" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l1Dentro1}
      </text>
      <text x={frenteCenterX} y="8486" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l2Dentro1}
      </text>
      <text x={versoCenterX} y="8076" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l1Dentro2}
      </text>
      <text x={versoCenterX} y="8486" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l2Dentro2}
      </text>

      {/* Footer bar */}
      {!compact && <rect x="0" y="10790" width={W} height="500" fill="#A9ABAE" />}
    </svg>
  );
}
