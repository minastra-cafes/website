import { act, render } from "@testing-library/react";
import { VideoPreguicoso } from "./VideoPreguicoso";

let avisarVisivel: (() => void) | null = null;

function simularNavegador({ reduzirMovimento = false } = {}) {
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
  vi.stubGlobal("matchMedia", (consulta: string) => ({ matches: reduzirMovimento && consulta.includes("reduce") }));
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
}

function renderizar() {
  return render(<VideoPreguicoso mp4="/images/v.mp4" poster="/images/v.webp" rotulo="Colheita" className="w-full" />);
}

describe("VideoPreguicoso", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    avisarVisivel = null;
  });

  it("mostra só o poster enquanto o vídeo não aparece na tela", () => {
    simularNavegador();
    const { container } = renderizar();
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("poster", "/images/v.webp");
    expect(video).toHaveAttribute("aria-label", "Colheita");
    expect(container.querySelector("source")).not.toHaveAttribute("src");
  });

  it("carrega e toca o vídeo quando ele entra na tela", () => {
    simularNavegador();
    const { container } = renderizar();
    act(() => avisarVisivel!());
    expect(container.querySelector("source")).toHaveAttribute("src", "/images/v.mp4");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("não carrega o vídeo para quem pediu menos movimento", () => {
    simularNavegador({ reduzirMovimento: true });
    const { container } = renderizar();
    act(() => avisarVisivel?.());
    expect(container.querySelector("source")).not.toHaveAttribute("src");
  });
});
