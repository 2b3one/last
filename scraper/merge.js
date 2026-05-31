import { calculatePoints } from "./points.js";

export function mergeData(zabka, jush, gazetka) {
  const all = [...zabka, ...jush, ...gazetka];
  const map = new Map();

  for (const p of all) {
    if (!map.has(p.name)) {
      const product = { ...p };
      product.points = calculatePoints(product);
      map.set(p.name, product);
    }
  }

  return [...map.values()];
}