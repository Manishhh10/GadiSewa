export const rs = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
