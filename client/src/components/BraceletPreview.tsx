import type { BraceletOrder } from "@/lib/constants";
import { BRACELET_COLORS, BRACELET_SYMBOLS, FRONT_BACK_FONTS } from "@/lib/constants";

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
  return font ? font.family : "Arial, Helvetica, sans-serif";
}

function SymbolIcon({ symbolId, x, y, size, color }: { symbolId?: string; x: number; y: number; size: number; color: string }) {
  if (!symbolId) return null;
  const symbol = BRACELET_SYMBOLS.find((s) => s.id === symbolId);
  if (!symbol) return null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={symbol.svgPath} fill={color} transform={`scale(${size / 24})`} />
    </g>
  );
}

export default function BraceletPreview({ order, compact = false }: BraceletPreviewProps) {
  const colorInfo = getBraceletColor(order.cor);
  const braceletHex = colorInfo.hex;
  const textColor = order.corTexto || colorInfo.textColor;
  const fontFrente = getFontFamily(order.fonteFrente || "Arial");
  const fontVerso = getFontFamily(order.fonteVerso || "Arial");
  const insideFont = "Calibri, 'Segoe UI', sans-serif";

  const W = 21000;
  const H = compact ? 9200 : 11300;

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
      <rect x="2000" y="5267" width="8500" height="1200" fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Verso rectangle */}
      <rect x="10500" y="5267" width="8500" height="1200" fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Symbol on frente */}
      <SymbolIcon symbolId={order.simboloFrente} x={2250} y={5517} size={20} color={textColor} />

      {/* Frente text */}
      <text x="6250" y="5977" textAnchor="middle" fill={textColor} fontFamily={fontFrente} fontSize="423">
        {order.textoFrente}
      </text>

      {/* Symbol on verso */}
      <SymbolIcon symbolId={order.simboloVerso} x={10750} y={5517} size={20} color={textColor} />

      {/* Verso text */}
      <text x="14750" y="5977" textAnchor="middle" fill={textColor} fontFamily={fontVerso} fontSize="423">
        {order.textoVerso}
      </text>

      {/* "dentro" label */}
      <text x="10500" y="7350" textAnchor="middle" fill="#727376" fontFamily="Arial, sans-serif" fontStyle="italic" fontSize="503">
        dentro
      </text>

      {/* Inside rectangle 1 */}
      <rect x="2000" y="7606" width="8500" height="1200" fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Inside rectangle 2 */}
      <rect x="10500" y="7606" width="8500" height="1200" fill={braceletHex} stroke="#999" strokeWidth="4" />

      {/* Inside texts */}
      <text x="6250" y="8076" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l1Dentro1}
      </text>
      <text x="6250" y="8486" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l2Dentro1}
      </text>
      <text x="14750" y="8076" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l1Dentro2}
      </text>
      <text x="14750" y="8486" textAnchor="middle" fill={textColor} fontFamily={insideFont} fontWeight="bold" fontSize="406">
        {order.l2Dentro2}
      </text>

      {/* Footer bar */}
      {!compact && <rect x="0" y="10790" width={W} height="500" fill="#A9ABAE" />}
    </svg>
  );
}
