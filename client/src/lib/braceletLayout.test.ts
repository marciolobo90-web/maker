import { describe, expect, it } from "vitest";
import {
  BRACELET_HORIZONTAL_PADDING,
  BRACELET_RECT_HEIGHT,
  BRACELET_SIZES,
  FRONT_FONTS,
  SYMBOL_TEXT_GAP,
  calcDentroFontSize,
  calcFrontFontSize,
  calcVersoFontSize,
  canAddCharToFront,
  estimateFrontTextWidth,
  estimateStandardTextWidth,
  getDentroMaxWidthSvg,
  getFrontMaxWidthSvg,
  getFrontTextBaselines,
  getHalfWidthSvg,
  getStandardTextBaselines,
  getSymbolWidthForCalc,
  getVersoMaxWidthSvg,
} from "./constants";

const RECT_Y = 5267;
const LONG_LINE = "WWW MARCIO LOBO DE OLIVEIRA 1234567890 WWW";

describe("motor de encaixe da pulseira", () => {
  it.each(BRACELET_SIZES)(
    "mantém todas as áreas dentro da pulseira $name",
    bracelet => {
      const physicalWidth =
        getHalfWidthSvg(bracelet.halfCm) - BRACELET_HORIZONTAL_PADDING * 2;

      expect(getFrontMaxWidthSvg(bracelet.name)).toBeLessThanOrEqual(
        physicalWidth
      );
      expect(getVersoMaxWidthSvg(bracelet.name)).toBeLessThanOrEqual(
        physicalWidth
      );
      expect(getDentroMaxWidthSvg(bracelet.name)).toBeLessThanOrEqual(
        physicalWidth
      );
    }
  );

  it.each(
    BRACELET_SIZES.flatMap(bracelet =>
      FRONT_FONTS.map(font => ({ bracelet, font }))
    )
  )(
    "encaixa texto e dois símbolos com $font.name na pulseira $bracelet.name",
    ({ bracelet, font }) => {
      const symbol1 = "68";
      const symbol2 = "104";
      const fontSize = calcFrontFontSize(
        LONG_LINE,
        font.name,
        bracelet.name,
        symbol1,
        symbol2,
        LONG_LINE
      );
      const totalWidth =
        estimateFrontTextWidth(LONG_LINE, fontSize, font.name) +
        getSymbolWidthForCalc(symbol1) +
        getSymbolWidthForCalc(symbol2) +
        SYMBOL_TEXT_GAP * 2;

      expect(totalWidth).toBeLessThanOrEqual(
        getFrontMaxWidthSvg(bracelet.name)
      );
    }
  );

  it.each(FRONT_FONTS)(
    "centraliza duas linhas de $name sem colisão vertical",
    font => {
      const fontSize = calcFrontFontSize(
        "MARCIO LOBO",
        font.name,
        "M adulto",
        undefined,
        undefined,
        "RUA PEDRO PRADO"
      );
      const [first, second] = getFrontTextBaselines(
        font.name,
        fontSize,
        2,
        RECT_Y
      );
      const ascent = font.ascentRatio || 0.82;
      const descent = font.descentRatio || 0.2;
      const firstTop = first - fontSize * ascent;
      const firstBottom = first + fontSize * descent;
      const secondTop = second - fontSize * ascent;
      const secondBottom = second + fontSize * descent;

      expect(firstTop).toBeGreaterThanOrEqual(RECT_Y);
      expect(secondBottom).toBeLessThanOrEqual(RECT_Y + BRACELET_RECT_HEIGHT);
      expect(secondTop).toBeGreaterThan(firstBottom);
      expect(
        Math.abs(
          firstTop - RECT_Y - (RECT_Y + BRACELET_RECT_HEIGHT - secondBottom)
        )
      ).toBeLessThanOrEqual(1.5);
    }
  );

  it("dá mais espaço ao texto quando não há símbolos", () => {
    const withoutSymbols = calcFrontFontSize(
      LONG_LINE,
      "Segoe Print Negrito",
      "Bebê"
    );
    const withSymbols = calcFrontFontSize(
      LONG_LINE,
      "Segoe Print Negrito",
      "Bebê",
      "68",
      "104"
    );

    expect(withoutSymbols).toBeGreaterThan(withSymbols);
  });

  it("varia o limite de caracteres conforme a largura da fonte", () => {
    const candidate = "MMMMMMMMMMMMMM";

    expect(canAddCharToFront(candidate, "Kids Station", "Bebê")).toBe(true);
    expect(canAddCharToFront(candidate, "Milky Matcha", "Bebê")).toBe(false);
  });

  it.each(BRACELET_SIZES)(
    "encaixa verso e dentro com três linhas e símbolo em $name",
    bracelet => {
      const symbol = "68";
      const symbolSpace = getSymbolWidthForCalc(symbol) + SYMBOL_TEXT_GAP;
      const versoSize = calcVersoFontSize(
        LONG_LINE,
        LONG_LINE,
        bracelet.name,
        symbol,
        LONG_LINE
      );
      const dentroSize = calcDentroFontSize(
        LONG_LINE,
        LONG_LINE,
        bracelet.name,
        symbol,
        LONG_LINE
      );

      expect(
        estimateStandardTextWidth(LONG_LINE, versoSize) + symbolSpace
      ).toBeLessThanOrEqual(getVersoMaxWidthSvg(bracelet.name));
      expect(
        estimateStandardTextWidth(LONG_LINE, dentroSize) + symbolSpace
      ).toBeLessThanOrEqual(getDentroMaxWidthSvg(bracelet.name));
    }
  );

  it("mantém três linhas internas separadas e dentro da altura", () => {
    const fontSize = calcDentroFontSize(
      "MARCIO",
      "LOBO",
      "M adulto",
      undefined,
      "DE OLIVEIRA"
    );
    const baselines = getStandardTextBaselines(fontSize, 3, RECT_Y);
    const ascent = 0.75;
    const descent = 0.2;

    expect(baselines[0] - fontSize * ascent).toBeGreaterThanOrEqual(RECT_Y);
    expect(baselines[2] + fontSize * descent).toBeLessThanOrEqual(
      RECT_Y + BRACELET_RECT_HEIGHT
    );
    expect(baselines[1] - fontSize * ascent).toBeGreaterThan(
      baselines[0] + fontSize * descent
    );
    expect(baselines[2] - fontSize * ascent).toBeGreaterThan(
      baselines[1] + fontSize * descent
    );
  });
});
