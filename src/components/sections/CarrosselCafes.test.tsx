import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Cafes } from "./Cafes";

describe("carrossel dos cafés", () => {
  it("os três cartões ficam no trilho que desliza de lado", () => {
    const { container } = render(<Cafes />);
    const trilho = container.querySelector("[data-trilho]");
    expect(trilho).not.toBeNull();
    expect(trilho!.querySelectorAll('a[href^="/produto/"]')).toHaveLength(3);
  });

  it("a palavra CAFÉ do fundo fica fora do leitor de tela", () => {
    const { getByText } = render(<Cafes />);
    expect(getByText("CAFÉ")).toHaveAttribute("aria-hidden", "true");
  });

  it("tem um ponto por café, o primeiro marcado, com alvo de toque de 44 px", () => {
    const { getAllByRole } = render(<Cafes />);
    const pontos = getAllByRole("button", { name: /Ver café \d de 3/ });
    expect(pontos).toHaveLength(3);
    expect(pontos[0]).toHaveAttribute("aria-current", "true");
    expect(pontos[1]).not.toHaveAttribute("aria-current");
    expect(pontos[0]).toHaveClass("h-11", "w-11");
  });

  it("tocar num ponto rola o carrossel até o café dele", () => {
    const { container, getAllByRole } = render(<Cafes />);
    const trilho = container.querySelector<HTMLElement>("[data-trilho]")!;
    trilho.scrollTo = vi.fn();
    fireEvent.click(getAllByRole("button", { name: /Ver café 3 de 3/ })[0]);
    expect(trilho.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
  });
});
