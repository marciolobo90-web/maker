import { describe, expect, it } from "vitest";
import { findSize, parseCSV, parseGoogleSheetUrl, parseOrdersFromCSV } from "./sheetImport";

describe("parseGoogleSheetUrl", () => {
  it("preserva o gid informado na query string", () => {
    expect(
      parseGoogleSheetUrl("https://docs.google.com/spreadsheets/d/abc-123/edit?gid=456")
    ).toEqual({ sheetId: "abc-123", gid: "456" });
  });

  it("preserva o gid informado no hash", () => {
    expect(
      parseGoogleSheetUrl("https://docs.google.com/spreadsheets/d/abc_123/edit#gid=789")
    ).toEqual({ sheetId: "abc_123", gid: "789" });
  });
});

describe("parseCSV", () => {
  it("aceita o CSV com ponto e vírgula usado pelo Excel em pt-BR", () => {
    expect(parseCSV('NOME_CLIENTE;TEXTO_FRENTE\r\n"Maria, Silva";Olá')).toEqual([
      ["NOME_CLIENTE", "TEXTO_FRENTE"],
      ["Maria, Silva", "Olá"],
    ]);
  });
});

describe("findSize", () => {
  it.each([
    ["", "M adulto", "18,5"],
    ["M", "M adulto", "18,5"],
    ["P", "P adulto", "17,5"],
    ["M infantil", "M infantil", "14,5"],
    ["14.5 cm", "M infantil", "14,5"],
  ])("interpreta %j sem correspondência parcial ambígua", (input, expectedName, expectedCm) => {
    expect(findSize(input)).toMatchObject({ tamanho: expectedName, tamanhoCm: expectedCm });
  });
});

describe("parseOrdersFromCSV", () => {
  it("gera IDs únicos e aplica padrões seguros", () => {
    const csv = "NOME_CLIENTE;TAMANHO;COR;QUANTIDADE\nAna;M; ;0";
    const first = parseOrdersFromCSV(csv, "csv")[0];
    const second = parseOrdersFromCSV(csv, "csv")[0];

    expect(first.id).not.toBe(second.id);
    expect(first).toMatchObject({
      nomeCliente: "Ana",
      tamanho: "M adulto",
      tamanhoCm: "18,5",
      cor: "Preto",
      quantidade: 1,
    });
  });
});
