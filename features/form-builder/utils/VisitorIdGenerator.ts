export function GenerateVisitoriD() {
  const radmonChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 26 },
    () => radmonChars[Math.floor(Math.random() * radmonChars.length)],
  ).join("");
}
