import { act, render } from "@testing-library/react";
import { Revelar } from "./Revelar";

let avisarVisivel: (() => void) | null = null;

function simularObservador() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        avisarVisivel = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      disconnect() {}
    },
  );
}

function renderizar() {
  return render(
    <Revelar>
      <p data-item>um</p>
      <p data-item>dois</p>
      <p data-item>três</p>
    </Revelar>,
  );
}

describe("Revelar", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    avisarVisivel = null;
    delete document.documentElement.dataset.revelarPronto;
  });

  it("marca data-visivel quando entra na tela", () => {
    simularObservador();
    const { container } = renderizar();
    const bloco = container.querySelector("[data-revelar]")!;
    expect(bloco).not.toHaveAttribute("data-visivel");
    act(() => avisarVisivel!());
    expect(bloco).toHaveAttribute("data-visivel");
  });

  it("atrasa cada data-item em 90 ms", () => {
    simularObservador();
    const { container } = renderizar();
    const atrasos = [...container.querySelectorAll<HTMLElement>("[data-item]")].map((item) => item.style.transitionDelay);
    expect(atrasos).toEqual(["0ms", "90ms", "180ms"]);
  });

  it("sem IntersectionObserver, mostra direto", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = renderizar();
    expect(container.querySelector("[data-revelar]")).toHaveAttribute("data-visivel");
  });

  it("sinaliza que está pronto (o script não tira a classe js)", () => {
    simularObservador();
    renderizar();
    expect(document.documentElement.dataset.revelarPronto).toBeDefined();
  });
});
