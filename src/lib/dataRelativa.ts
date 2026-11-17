const DIA_MS = 24 * 60 * 60 * 1000;
const formato = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function inicioDoDia(data: Date): number {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate()).getTime();
}

// "hoje", "ontem", "há 3 dias", "há 2 meses", "há 2 anos". Conta dias do calendário (no fuso de quem
// lê): uma avaliação de ontem às 23h, vista hoje às 9h, é "ontem".
export function formatarDataRelativa(iso: string, agora: Date = new Date()): string {
  const dias = Math.max(0, Math.round((inicioDoDia(agora) - inicioDoDia(new Date(iso))) / DIA_MS));
  if (dias < 30) return formato.format(-dias, "day");
  if (dias < 365) return formato.format(-Math.max(1, Math.round(dias / 30.44)), "month");
  return formato.format(-Math.floor(dias / 365), "year");
}
