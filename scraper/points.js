export function calculatePoints(product) {
  let points = 0;

  if (product.price) points += Math.floor(product.price / 2);
  if (product.promotion?.points) points += product.promotion.points;
  if (product.bonus_points) points += product.bonus_points;

  return points;
}