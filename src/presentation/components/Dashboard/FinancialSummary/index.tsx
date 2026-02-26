import React from 'react';
import { useFinancialSummaryLogic } from './useLogic';
import { TrendingUp, DollarSign, PieChart, BarChart, ClipboardCheck } from 'lucide-react';
import './styles.css';

export const FinancialSummary: React.FC = () => {
  const { metrics, formatCurrency, hasData } = useFinancialSummaryLogic();

  if (!hasData) return null;

  return (
    <div className="financial-summary-container">
      <div className="financial-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: 'rgba(46, 125, 50, 0.15)', color: '#2e7d32' }}>
            <TrendingUp size={20} />
          </div>
          <div className="card-title">Faturamento Mensal Ativo</div>
        </div>
        <div className="card-value">{formatCurrency(metrics.monthlyActiveRevenue)}</div>
        <div className="card-subtitle">{metrics.activeCount} contratos em vigor</div>
      </div>

      <div className="financial-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: 'rgba(153, 102, 255, 0.15)', color: '#9966ff' }}>
            <ClipboardCheck size={20} />
          </div>
          <div className="card-title">Locações Ativas</div>
        </div>
        <div className="card-value">{metrics.activeCount}</div>
        <div className="card-subtitle">Volume total de contratos este mês</div>
      </div>

      <div className="financial-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: 'rgba(25, 118, 210, 0.15)', color: '#1976d2' }}>
            <DollarSign size={20} />
          </div>
          <div className="card-title">Ticket Médio Mensal</div>
        </div>
        <div className="card-value">{formatCurrency(metrics.averageMonthlyTicket)}</div>
        <div className="card-subtitle">Média por equipamento alocado</div>
      </div>

      <div className="financial-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: 'rgba(100, 108, 255, 0.15)', color: '#646cff' }}>
            <BarChart size={20} />
          </div>
          <div className="card-title">Valor Total Contratado (Ativo)</div>
        </div>
        <div className="card-value">{formatCurrency(metrics.totalContractedValue)}</div>
        <div className="card-subtitle">Soma total de todos os contratos</div>
      </div>

      <div className="financial-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: 'rgba(117, 117, 117, 0.15)', color: '#757575' }}>
            <PieChart size={20} />
          </div>
          <div className="card-title">Potencial Mensal Máximo</div>
        </div>
        <div className="card-value">{formatCurrency(metrics.totalPotentialMonthlyRevenue)}</div>
        <div className="card-subtitle">Capacidade total do estoque</div>
      </div>
    </div>
  );
};
