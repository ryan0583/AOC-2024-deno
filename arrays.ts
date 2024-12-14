export const sum = (arr: number[]) => arr.reduce((sum, value) => sum + value, 0);

export const product = (arr: number[]) => arr.reduce((product, value) => product * value, 1);

export const overlapCount = (a: unknown[], b: unknown[]) => b.filter((entry) => a.includes(entry)).length;

const gcd2 = (a: number, b: number) => {
  if (!b) return b === 0 ? a : NaN;
  return gcd2(b, a % b);
};

export const gcd = (array: number[]) => array.reduce((acc, entry) => gcd2(entry, acc), 0);

const lcm2 = (a: number, b: number) => (a * b) / gcd2(a, b);

export const lcm = (array: number[]) => array.reduce((acc, entry) => lcm2(entry, acc), 1);
