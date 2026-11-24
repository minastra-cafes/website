import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CarrosselAvaliacoes, INTERVALO_MS } from "./CarrosselAvaliacoes";

// jsdom não mede layout: cada card ganha 300 px de largura (offsetLeft pela posição na fila), o trilho
// mostra 300 px de 900 (três paradas: 0, 300 e 600) e o matchMedia responde como um navegador.
function montar({ reduzido = false, mouse = true } = {}) {
  window.matchMedia = vi.fn().mockImplementation((consulta: string) => ({
    matches: consulta.includes("reduce") ? reduzido : consulta.includes("hover") ? mouse : false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const originais = Object.getOwnPropertyDescriptors(HTMLElement.prototype);
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => 900 });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 300 });
  Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
    configurable: true,
    get(this: HTMLElement) {
      return this.parentElement ? [...this.parentElement.children].indexOf(this) * 300 : 0;
    },
  });
  const scrollTo = vi.fn();
  HTMLElement.prototype.scrollTo = scrollTo;
  const resultado = render(
    <CarrosselAvaliacoes>
      <div>Ana</div>
      <div>Bruno</div>
      <div>Carla</div>
    </CarrosselAvaliacoes>,
  );
  const trilho = resultado.container.querySelector<HTMLElement>("[data-carrossel-avaliacoes]")!;
  return { scrollTo, trilho, restaura: () => Object.defineProperties(HTMLElement.prototype, originais) };
}

describe("carrossel das avaliações", () => {
  let restaura = () => {};
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    restaura();
    vi.useRealTimers();
  });

  it("desliza para a próxima avaliação a cada 3 s", () => {
    const m = montar();
    restaura = m.restaura;
    expect(INTERVALO_MS).toBe(3000);
    act(() => vi.advanceTimersByTime(INTERVALO_MS - 1));
    expect(m.scrollTo).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(m.scrollTo).toHaveBeenLastCalledWith({ left: 300, behavior: "smooth" });
  });

  it("depois da última, volta para a primeira", () => {
    const m = montar();
    restaura = m.restaura;
    m.trilho.scrollLeft = 600;
    act(() => vi.advanceTimersByTime(INTERVALO_MS));
    expect(m.scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: "smooth" });
  });

  it("tem uma bolinha por parada, a primeira marcada, com alvo de toque de 44 px", () => {
    const m = montar();
    restaura = m.restaura;
    const bolinhas = screen.getAllByRole("button", { name: /Ver avaliação \d de 3/ });
    expect(bolinhas).toHaveLength(3);
    expect(bolinhas[0]).toHaveAttribute("aria-current", "true");
    expect(bolinhas[0]).toHaveClass("h-11", "w-11");
  });

  it("tocar numa bolinha vai até ela e recomeça a contar os 3 s", () => {
    const m = montar();
    restaura = m.restaura;
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByRole("button", { name: "Ver avaliação 3 de 3" }));
    expect(m.scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: "smooth" });
    expect(screen.getByRole("button", { name: "Ver avaliação 3 de 3" })).toHaveAttribute("aria-current", "true");
    m.scrollTo.mockClear();
    act(() => vi.advanceTimersByTime(INTERVALO_MS - 1));
    expect(m.scrollTo).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(m.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("com o mouse em cima, não anda", () => {
    const m = montar();
    restaura = m.restaura;
    fireEvent.mouseEnter(m.trilho);
    act(() => vi.advanceTimersByTime(INTERVALO_MS * 2));
    expect(m.scrollTo).not.toHaveBeenCalled();
  });

  it("no celular (sem mouse), um toque não deixa o carrossel parado", () => {
    const m = montar({ mouse: false });
    restaura = m.restaura;
    fireEvent.mouseEnter(m.trilho); // o toque simula um mouse em cima
    act(() => vi.advanceTimersByTime(INTERVALO_MS));
    expect(m.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("com reduzir movimento, não anda sozinho, mas as bolinhas continuam", () => {
    const m = montar({ reduzido: true });
    restaura = m.restaura;
    act(() => vi.advanceTimersByTime(INTERVALO_MS * 3));
    expect(m.scrollTo).not.toHaveBeenCalled();
    expect(screen.getAllByRole("button", { name: /Ver avaliação/ })).toHaveLength(3);
  });
});
