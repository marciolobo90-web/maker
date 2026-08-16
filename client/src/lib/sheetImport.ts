import {
  BRACELET_COLORS,
  BRACELET_SIZES,
  EXPECTED_COLUMNS,
  SHEETS_URL_PATTERN,
  type BraceletOrder,
} from "./constants.ts";

export interface GoogleSheetReference {
  sheetId: string;
  gid: string;
}

type IdFactory = (source: string, index: number) => string;

function normalizeValue(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function normalizeHeader(header: string): string {
  return normalizeValue(header).replace(/\s+/g, "_");
}

function countDelimiter(line: string, delimiter: string): number {
  let count = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && line[i] === delimiter) {
      count++;
    }
  }

  return count;
}

function detectDelimiter(text: string): string {
  const firstLine = text.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0] || "";
  const candidates = [",", ";", "\t"];
  return candidates.reduce((best, current) =>
    countDelimiter(firstLine, current) > countDelimiter(firstLine, best) ? current : best
  );
}

export function parseCSV(text: string): string[][] {
  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(current.trim());
      current = "";
    } else if (char === "\n" || char === "\r") {
      row.push(current.trim());
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      current = "";
      if (char === "\r" && next === "\n") i++;
    } else {
      current += char;
    }
  }

  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
  }

  return rows;
}

export function parseGoogleSheetUrl(url: string): GoogleSheetReference {
  const match = url.match(SHEETS_URL_PATTERN);
  if (!match) {
    throw new Error("URL inválida. Cole a URL completa da sua planilha Google Sheets.");
  }

  let gid = "0";
  try {
    const parsed = new URL(url);
    const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ""));
    gid = parsed.searchParams.get("gid") || hashParams.get("gid") || "0";
  } catch {
    // O regex já validou o ID; URLs antigas sem formato completo usam a primeira aba.
  }

  return { sheetId: match[1], gid: /^\d+$/.test(gid) ? gid : "0" };
}

function findColorByName(name: string): { cor: string; corTexto: string } {
  const normalized = normalizeValue(name);
  if (!normalized) return { cor: "Preto", corTexto: "#FFFFFF" };

  const exact = BRACELET_COLORS.find((color) => normalizeValue(color.name) === normalized);
  if (exact) return { cor: exact.name, corTexto: exact.textColor };

  const partial = BRACELET_COLORS.filter((color) => {
    const candidate = normalizeValue(color.name);
    return candidate.includes(normalized) || normalized.includes(candidate);
  });
  if (partial.length === 1) {
    return { cor: partial[0].name, corTexto: partial[0].textColor };
  }

  return { cor: "Preto", corTexto: "#FFFFFF" };
}

export function findSize(name: string): { tamanho: string; tamanhoLabel: string; tamanhoCm: string } {
  const normalized = normalizeValue(name);
  const defaultSize = BRACELET_SIZES.find((size) => size.name === "M adulto")!;
  if (!normalized) return toSizeResult(defaultSize);

  const aliases: Record<string, string> = {
    PP: "PP adulto",
    P: "P adulto",
    M: "M adulto",
    G: "G adulto",
    GG: "GG adulto",
    BEBE: "Bebê",
  };
  const alias = aliases[normalized];
  if (alias) {
    return toSizeResult(BRACELET_SIZES.find((size) => size.name === alias) || defaultSize);
  }

  const normalizedCm = normalized.replace(/\s*CM$/, "").replace(".", ",");
  const exact = BRACELET_SIZES.find(
    (size) =>
      normalizeValue(size.name) === normalized ||
      normalizeValue(size.label) === normalized ||
      size.cm === normalizedCm
  );

  return toSizeResult(exact || defaultSize);
}

function toSizeResult(size: (typeof BRACELET_SIZES)[number]) {
  return { tamanho: size.name, tamanhoLabel: size.label, tamanhoCm: size.cm };
}

function defaultIdFactory(source: string, index: number): string {
  const randomId = globalThis.crypto?.randomUUID?.();
  if (randomId) return `${source}_${randomId}`;
  return `${source}_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 10)}`;
}

export function parseOrdersFromCSV(
  text: string,
  source = "order",
  idFactory: IdFactory = defaultIdFactory
): BraceletOrder[] {
  const rows = parseCSV(text);
  if (rows.length < 2) {
    throw new Error("O arquivo parece estar vazio ou não tem dados suficientes.");
  }

  const headers = rows[0].map(normalizeHeader);
  if (!headers.some((header) => EXPECTED_COLUMNS.includes(header))) {
    throw new Error("Nenhuma coluna reconhecida. Confira os nomes das colunas e o separador do CSV.");
  }

  const getCol = (row: string[], colName: string): string => {
    const index = headers.indexOf(colName);
    return index >= 0 && index < row.length ? row[index] : "";
  };

  return rows.slice(1).map((row, index) => {
    const colorInfo = findColorByName(getCol(row, "COR"));
    const sizeInfo = findSize(getCol(row, "TAMANHO"));
    const parsedQuantity = Number.parseInt(getCol(row, "QUANTIDADE") || "1", 10);
    const quantidade = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

    return {
      id: idFactory(source, index),
      nomeCliente: getCol(row, "NOME_CLIENTE") || `Cliente ${index + 1}`,
      textoFrente: getCol(row, "TEXTO_FRENTE"),
      l2Frente: getCol(row, "L2_FRENTE"),
      textoVerso: getCol(row, "TEXTO_VERSO"),
      l2Verso: getCol(row, "L2_VERSO"),
      l3Verso: getCol(row, "L3_VERSO"),
      l1Dentro1: getCol(row, "L1_DENTRO1"),
      l2Dentro1: getCol(row, "L2_DENTRO1"),
      l3Dentro1: getCol(row, "L3_DENTRO1"),
      l1Dentro2: getCol(row, "L1_DENTRO2"),
      l2Dentro2: getCol(row, "L2_DENTRO2"),
      l3Dentro2: getCol(row, "L3_DENTRO2"),
      cor: colorInfo.cor,
      corTexto: getCol(row, "COR_TEXTO") || colorInfo.corTexto,
      fonteFrente: getCol(row, "FONTE_FRENTE") || "Segoe Print Negrito",
      fonteVerso: "Calibri Negrito",
      tamanho: sizeInfo.tamanho,
      tamanhoLabel: sizeInfo.tamanhoLabel,
      tamanhoCm: sizeInfo.tamanhoCm,
      simboloFrente: getCol(row, "SIMBOLO_FRENTE") || undefined,
      simboloFrente2: getCol(row, "SIMBOLO_FRENTE2") || undefined,
      simboloVerso: getCol(row, "SIMBOLO_VERSO") || undefined,
      simboloDentro1: getCol(row, "SIMBOLO_DENTRO1") || undefined,
      simboloDentro2: getCol(row, "SIMBOLO_DENTRO2") || undefined,
      quantidade,
    };
  });
}
