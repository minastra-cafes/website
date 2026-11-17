import { render } from "@testing-library/react";
import { Bastidores } from "./Bastidores";
import { Cafes } from "./Cafes";
import { Chamada } from "./Chamada";
import { Origem } from "./Origem";
import { Qualidade } from "./Qualidade";

describe("seções que entram ao rolar", () => {
  it.each([
    ["Cafés", <Cafes key="cafes" />],
    ["Origem", <Origem key="origem" />],
    ["Qualidade", <Qualidade key="qualidade" />],
    ["Bastidores", <Bastidores key="bastidores" />],
    ["Chamada", <Chamada key="chamada" />],
  ])("%s tem um bloco Revelar com itens", (_secao, elemento) => {
    const { container } = render(elemento);
    expect(container.querySelector("[data-revelar] [data-item]")).not.toBeNull();
  });

  it("os três cartões de café entram em cascata no mesmo bloco", () => {
    const { container } = render(<Cafes />);
    const cartoes = [...container.querySelectorAll('a[href^="/produto/"]')];
    expect(cartoes).toHaveLength(3);
    const bloco = cartoes[0].closest("[data-revelar]");
    expect(bloco).not.toBeNull();
    // O data-item fica num invólucro: o link mantém a própria transição (hover e toque).
    expect(cartoes.every((cartao) => cartao.closest("[data-item]") !== null && cartao.closest("[data-revelar]") === bloco)).toBe(true);
  });

  it("os cartões afundam levemente ao toque", () => {
    const { container } = render(<Cafes />);
    expect(container.querySelector('a[href^="/produto/"]')).toHaveClass("motion-safe:active:scale-[0.98]");
  });

  it("o selo Alfenas · MG desliza para o lugar", () => {
    const { getByText } = render(<Origem />);
    const selo = getByText("Alfenas · MG").parentElement!;
    expect(selo).toHaveAttribute("data-item");
    expect(selo.className).toContain("motion-safe:escondido:translate-x-6");
  });
});

describe("ajustes da revisão", () => {
  it("o cartão de café ocupa a altura toda da linha do grid (cartões alinhados no desktop)", () => {
    const { container } = render(<Cafes />);
    expect(container.querySelector('a[href^="/produto/"]')).toHaveClass("h-full");
  });

  it("na Origem, o texto tem um bloco próprio, separado do selo da foto", () => {
    const { getByText, getByRole } = render(<Origem />);
    const blocoSelo = getByText("Alfenas · MG").closest("[data-revelar]");
    const blocoTexto = getByRole("heading", { level: 2 }).closest("[data-revelar]");
    expect(blocoSelo).not.toBeNull();
    expect(blocoTexto).not.toBeNull();
    expect(blocoTexto).not.toBe(blocoSelo);
  });
});
