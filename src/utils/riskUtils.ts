export function getRiskColor(score: number): string {
  if (score <= 4) return 'bg-green-500';
  if (score <= 7) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getRiskText(score: number): string {
  if (score <= 4) return 'Riesgo Bajo';
  if (score <= 7) return 'Riesgo Medio';
  return 'Riesgo Alto';
}

export function getRiskBadgeClass(score: number): string {
  if (score <= 4) return 'bg-green-100 text-green-800';
  if (score <= 7) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}