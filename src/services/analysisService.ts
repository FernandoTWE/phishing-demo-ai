export async function fetchAnalysisHistory() {
  try {
    const response = await fetch('https://4bda4.twidget.io/pishingdemo');
    if (!response.ok) throw new Error('Error al obtener el historial');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

export async function fetchAnalysisResult(requestId: string) {
  try {
    const response = await fetch(`https://4bda4.twidget.io/requestid?requestId=${requestId}`);
    if (!response.ok) throw new Error('Error al obtener resultados');
    return await response.json();
  } catch (error) {
    console.error('Error fetching result:', error);
    return null;
  }
}