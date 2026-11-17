import { formatarDataRelativa } from "./dataRelativa";

const AGORA = new Date("2026-11-17T12:00:00Z");

describe("formatarDataRelativa", () => {
  it.each([
    ["2026-11-17T09:00:00Z", "hoje"],
    ["2026-11-14T12:00:00Z", "há 3 dias"],
    ["2026-09-17T12:00:00Z", "há 2 meses"],
    ["2024-11-17T12:00:00Z", "há 2 anos"],
  ])("%s vira %s", (iso, esperado) => {
    expect(formatarDataRelativa(iso, AGORA)).toBe(esperado);
  });
});

describe("formatarDataRelativa pelo dia do calendário", () => {
  it("chama de ontem uma avaliação de ontem à noite vista hoje de manhã", () => {
    expect(formatarDataRelativa(new Date(2026, 10, 16, 23, 0).toISOString(), new Date(2026, 10, 17, 9, 0))).toBe("ontem");
  });

  it("chama de hoje uma avaliação de hoje cedo vista à noite", () => {
    expect(formatarDataRelativa(new Date(2026, 10, 17, 0, 30).toISOString(), new Date(2026, 10, 17, 23, 0))).toBe("hoje");
  });
});
