import { describe, expect, it } from "vitest";
import type { BraceletOrder } from "./constants";
import { generateBraceletSVG } from "./svgGenerator";

function createOrder(overrides: Partial<BraceletOrder> = {}): BraceletOrder {
  return {
    id: "teste",
    nomeCliente: "Marcio",
    textoFrente: "Marcio",
    l2Frente: "Lobo",
    textoVerso: "Marcio",
    l1Dentro1: "Marcio",
    l2Dentro1: "Lobo",
    l1Dentro2: "Marcio",
    l2Dentro2: "Lobo",
    cor: "Preto",
    corTexto: "#FFFFFF",
    fonteFrente: "Milky Matcha",
    fonteVerso: "Calibri Negrito",
    tamanho: "M adulto",
    tamanhoLabel: "M adulto",
    tamanhoCm: "18,5",
    ...overrides,
  };
}

describe("generateBraceletSVG", () => {
  it("centraliza verticalmente símbolos largos pela altura renderizada", () => {
    const svg = generateBraceletSVG(createOrder({ simboloDentro1: "68" }));

    expect(svg).toContain('transform="translate(');
    expect(svg).toContain(',7831.00) scale(1.000000)');
  });

  it("compensa a métrica vertical da Milky Matcha em duas linhas", () => {
    const svg = generateBraceletSVG(createOrder());

    expect(svg).toContain('y="5927"');
    expect(svg).toContain('y="6323"');
  });

  it("compensa a métrica vertical da Segoe Print em duas linhas", () => {
    const svg = generateBraceletSVG(
      createOrder({ fonteFrente: "Segoe Print Negrito" })
    );

    expect(svg).toContain('y="5797"');
    expect(svg).toContain('y="6193"');
  });
});
