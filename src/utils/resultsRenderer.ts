import { getRiskColor, getRiskText } from './riskUtils';
import type { AnalysisResult } from '../types/analysis';

export function displayAnalysisResults(results: AnalysisResult, container: HTMLElement) {
  const alias = results.alias || 'NoAlias';
  
  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Análisis: ${alias}</h1>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-semibold text-gray-900">Nivel de Riesgo</h2>
            <span class="text-lg font-bold ${getRiskColor(results.riskPhishing.totalRiskScore).replace('bg-', 'text-')}">
              ${results.riskPhishing.totalRiskScore.toFixed(1)} - ${getRiskText(results.riskPhishing.totalRiskScore)}
            </span>
          </div>
          <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-500 ${getRiskColor(results.riskPhishing.totalRiskScore)}"
              style="width: ${(results.riskPhishing.totalRiskScore / 10) * 100}%"
            ></div>
          </div>
        </div>
        <div class="text-gray-600 leading-relaxed">${results.emailSummary}</div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Análisis General</h2>
        <div class="text-gray-600 leading-relaxed mb-6">${results.overallAnalysis}</div>
        
        <h3 class="text-md font-semibold text-gray-900 mb-3">Señales de Advertencia</h3>
        <ul class="space-y-3">
          ${results.negative_signals.map((warning: string) => `
            <li class="flex items-start space-x-3">
              <svg class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span class="text-gray-600">${warning}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Recomendaciones</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${results.recomendation.map((rec) => `
            <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">${rec.recommendation_title}</h3>
              <p class="text-gray-600">${rec.recommendation_detail}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}