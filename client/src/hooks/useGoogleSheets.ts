import { useCallback, useEffect, useState } from "react";
import type { BraceletOrder } from "@/lib/constants";
import { SHEETS_PUBLIC_CSV } from "@/lib/constants";
import { parseGoogleSheetUrl, parseOrdersFromCSV } from "@/lib/sheetImport";

const STORAGE_KEY = "pulseira-maker-orders";

export type ImportResult =
  | { ok: true; count: number }
  | { ok: false; count: 0; error: string };

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function loadOrdersFromStorage(): BraceletOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Dados antigos ou corrompidos são ignorados.
  }
  return [];
}

function saveOrdersToStorage(orders: BraceletOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // O aplicativo continua funcionando se o navegador bloquear o armazenamento.
  }
}

export function useGoogleSheets() {
  const [orders, setOrders] = useState<BraceletOrder[]>(() => loadOrdersFromStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState("");

  useEffect(() => {
    saveOrdersToStorage(orders);
  }, [orders]);

  const appendOrders = useCallback((text: string, source: string): number => {
    const parsed = parseOrdersFromCSV(text, source);
    setOrders((previous) => [...previous, ...parsed]);
    return parsed.length;
  }, []);

  const fetchSheet = useCallback(
    async (url: string): Promise<ImportResult> => {
      setLoading(true);
      setError(null);

      try {
        const { sheetId, gid } = parseGoogleSheetUrl(url);
        const response = await fetch(SHEETS_PUBLIC_CSV(sheetId, gid));

        if (!response.ok) {
          throw new Error(
            "Não foi possível acessar a planilha. Verifique se ela está compartilhada como 'Qualquer pessoa com o link'."
          );
        }

        const count = appendOrders(await response.text(), "sheet");
        setSheetUrl(url);
        return { ok: true, count };
      } catch (caughtError) {
        const message = getErrorMessage(caughtError, "Erro ao processar a planilha.");
        setError(message);
        return { ok: false, count: 0, error: message };
      } finally {
        setLoading(false);
      }
    },
    [appendOrders]
  );

  const loadFromCSVText = useCallback(
    (text: string): ImportResult => {
      setLoading(true);
      setError(null);

      try {
        const count = appendOrders(text, "csv");
        return { ok: true, count };
      } catch (caughtError) {
        const message = getErrorMessage(caughtError, "Erro ao processar o CSV.");
        setError(message);
        return { ok: false, count: 0, error: message };
      } finally {
        setLoading(false);
      }
    },
    [appendOrders]
  );

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
