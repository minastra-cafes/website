import { dynamicParams, generateStaticParams } from "./page";

describe("página de produto", () => {
  it("gera uma página para cada café", () => {
    expect(generateStaticParams()).toEqual([{ id: "bronze" }, { id: "ouro" }, { id: "ouro-graos" }]);
  });

  it("não aceita id fora da lista (o export estático não tem servidor)", () => {
    expect(dynamicParams).toBe(false);
  });
});
