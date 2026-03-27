import { useState, useCallback } from "react";
import type { BraceletOrder } from "@/lib/constants";
import { BRACELET_COLORS, BRACELET_SIZES, SHEETS_URL_PATTERN } from "@/lib/constants";

function parseCSV(text: string): string[][] {
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
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\n" || (char === "\r" && next === "\n")) {
        row.push(current.trim());
        if (row.some((cell) => cell !== "")) {
          rows.push(row);
        }
        row = [];
        current = "";
        if (char === "\r") i++;
      } else {
        current += char;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }
  return rows;
}

function normalizeHeader(header: string): string {
  return header
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function findColorByName(name: string): { cor: string; corTexto: string } {
  const normalized = name.toLowerCase().trim();
  const found = BRACELET_COLORS.find((c) => c.name.toLowerCase() === normalized);
  if (found) return { cor: found.name, corTexto: found.textColor };
  // Try partial match
  const partial = BRACELET_COLORS.find((c) => c.name.toLowerCase().includes(normalized) || normalized.includes(c.name.toLowerCase()));
  if (partial) return { cor: partial.name, corTexto: partial.textColor };
  return { cor: "Preto", corTexto: "#FFFFFF" };
}

function findSize(name: string): { tamanho: string; tamanhoLabel: string; tamanhoCm: string } {
  const normalized = name.toUpperCase().trim();
  const found = BRACELET_SIZES.find((s) => s.name === normalized || s.label.toUpperCase().includes(normalized) || normalized.includes(s.cm));
  if (found) return { tamanho: found.name, tamanhoLabel: found.label, tamanhoCm: found.cm };
  return { tamanho: "M adulto", tamanhoLabel: "M adulto", tamanhoCm: "18,5" };
}

export function useGoogleSheets() {
  const [orders, setOrders] = useState<BraceletOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState("");

  const fetchSheet = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const match = url.match(SHEETS_URL_PATTERN);
      if (!match) {
        throw new Error("URL inválida. Cole a URL completa da sua planilha Google Sheets.");
      }

      const sheetId = match[1];
      // Try public CSV export
      const csvUrl = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:csv";

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Não foi possível acessar a planilha. Verifique se ela está compartilhada como 'Qualquer pessoa com o link'.");
      }

      const text = await response.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        throw new Error("A planilha parece estar vazia ou não tem dados suficientes.");
      }

      const headers = rows[0].map(normalizeHeader);
      const dataRows = rows.slice(1);

      const getCol = (row: string[], colName: string): string => {
        const idx = headers.indexOf(colName);
        return idx >= 0 && idx < row.length ? row[idx] : "";
      };

      const parsed: BraceletOrder[] = dataRows.map((row, i) => {
        const corName = getCol(row, "COR") || "Preto";
        const colorInfo = findColorByName(corName);
        const sizeName = getCol(row, "TAMANHO") || "M";
        const sizeInfo = findSize(sizeName);
        const qty = parseInt(getCol(row, "QUANTIDADE") || "1", 10);

        return {
          id: "order_" + (i + 1),
          nomeCliente: getCol(row, "NOME_CLIENTE") || "Cliente " + (i + 1),
          textoFrente: getCol(row, "TEXTO_FRENTE") || "",
          textoVerso: getCol(row, "TEXTO_VERSO") || "",
          l2Verso: getCol(row, "L2_VERSO") || "",
          l1Dentro1: getCol(row, "L1_DENTRO1") || "",
          l2Dentro1: getCol(row, "L2_DENTRO1") || "",
          l1Dentro2: getCol(row, "L1_DENTRO2") || "",
          l2Dentro2: getCol(row, "L2_DENTRO2") || "",
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
          quantidade: isNaN(qty) ? 1 : qty,
        };
      });

      setOrders(parsed);
      setSheetUrl(url);
    } catch (err: any) {
      setError(err.message || "Erro ao processar a planilha.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFromCSVText = useCallback((text: string) => {
    setLoading(true);
    setError(null);

    try {
      const rows = parseCSV(text);
      if (rows.length < 2) {
        throw new Error("O CSV parece estar vazio ou não tem dados suficientes.");
      }

      const headers = rows[0].map(normalizeHeader);
      const dataRows = rows.slice(1);

      const getCol = (row: string[], colName: string): string => {
        const idx = headers.indexOf(colName);
        return idx >= 0 && idx < row.length ? row[idx] : "";
      };

      const parsed: BraceletOrder[] = dataRows.map((row, i) => {
        const corName = getCol(row, "COR") || "Preto";
        const colorInfo = findColorByName(corName);
        const sizeName = getCol(row, "TAMANHO") || "M";
        const sizeInfo = findSize(sizeName);
        const qty = parseInt(getCol(row, "QUANTIDADE") || "1", 10);

        return {
          id: "order_" + (i + 1),
          nomeCliente: getCol(row, "NOME_CLIENTE") || "Cliente " + (i + 1),
          textoFrente: getCol(row, "TEXTO_FRENTE") || "",
          textoVerso: getCol(row, "TEXTO_VERSO") || "",
          l2Verso: getCol(row, "L2_VERSO") || "",
          l1Dentro1: getCol(row, "L1_DENTRO1") || "",
          l2Dentro1: getCol(row, "L2_DENTRO1") || "",
          l1Dentro2: getCol(row, "L1_DENTRO2") || "",
          l2Dentro2: getCol(row, "L2_DENTRO2") || "",
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
          quantidade: isNaN(qty) ? 1 : qty,
        };
      });

      setOrders(parsed);
    } catch (err: any) {
      setError(err.message || "Erro ao processar o CSV.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    setOrders,
    loading,
    error,
    sheetUrl,
    fetchSheet,
    loadFromCSVText,
  };
}
