import { act, renderHook } from "@testing-library/react";
import { useContagem } from "./useContagem";

function simularMovimento({ reduzir }: { reduzir: boolean }) {
  vi.stubGlobal("matchMedia", (consulta: string) => ({ matches: reduzir && consulta.includes("reduce") }));
}

describe("useContagem", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fica em 0 até começar", () => {
    simularMovimento({ reduzir: false });
    const { result } = renderHook(() => useContagem(5, false));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(0);
  });

  it("chega ao valor final em 900 ms", () => {
    simularMovimento({ reduzir: false });
    const { result, rerender } = renderHook(({ iniciar }) => useContagem(5, iniciar), { initialProps: { iniciar: false } });
    rerender({ iniciar: true });
    act(() => vi.advanceTimersByTime(450));
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(5);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(5);
  });

  it("com reduzir movimento, devolve o final na hora", () => {
    simularMovimento({ reduzir: true });
    const { result } = renderHook(() => useContagem(4.5, false));
    expect(result.current).toBe(4.5);
  });

  it("cancela o quadro pendente ao desmontar", () => {
    simularMovimento({ reduzir: false });
    const cancelar = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = renderHook(() => useContagem(5, true));
    act(() => vi.advanceTimersByTime(100));
    unmount();
    expect(cancelar).toHaveBeenCalled();
  });
});

describe("useContagem no primeiro quadro", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("nunca fica negativo quando o quadro começa antes da leitura do relógio", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.spyOn(performance, "now").mockReturnValue(1000);
    let chamado = false;
    vi.stubGlobal("requestAnimationFrame", (passo: FrameRequestCallback) => {
      if (!chamado) {
        chamado = true;
        passo(990);
      }
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    const { result } = renderHook(() => useContagem(5, true));
    expect(result.current).toBeGreaterThanOrEqual(0);
  });
});
