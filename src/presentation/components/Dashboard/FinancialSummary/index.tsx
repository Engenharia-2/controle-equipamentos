import React from 'react';
import { useFinancialSummaryLogic } from './useLogic';
import { TrendingUp, DollarSign, PieChart, BarChart, ClipboardCheck } from 'lucide-react';
import styles from './styles.module.css';

export const FinancialSummary: React.FC = () => {
  const { metrics, formatCurrency, hasData } = useFinancialSummaryLogic();

  if (!hasData) return null;

  return (
    <div className={styles.financialSummaryContainer}>
      <div className={styles.financialCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ backgroundColor: 'rgba(46, 125, 50, 0.15)', color: '#2e7d32' }}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.cardTitle}>Faturamento Mensal Ativo</div>
        </div>
        <div className={styles.cardValue}>{formatCurrency(metrics.monthlyActiveRevenue)}</div>
        <div className={styles.cardSubtitle}>{metrics.activeCount} contratos em vigor</div>
      </div>

      <div className={styles.financialCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ backgroundColor: 'rgba(153, 102, 255, 0.15)', color: '#9966ff' }}>
            <ClipboardCheck size={20} />
          </div>
          <div className={styles.cardTitle}>Locações Ativas</div>
        </div>
        <div className={styles.cardValue}>{metrics.activeCount}</div>
        <div className={styles.cardSubtitle}>Volume total de contratos este mês</div>
      </div>

      <div className={styles.financialCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ backgroundColor: 'rgba(25, 118, 210, 0.15)', color: '#1976d2' }}>
            <DollarSign size={20} />
          </div>
          <div className={styles.cardTitle}>Ticket Médio Mensal</div>
        </div>
        <div className={styles.cardValue}>{formatCurrency(metrics.averageMonthlyTicket)}</div>
        <div className={styles.cardSubtitle}>Média por equipamento alocado</div>
      </div>

      <div className={styles.financialCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ backgroundColor: 'rgba(100, 108, 255, 0.15)', color: '#646cff' }}>
            <BarChart size={20} />
          </div>
          <div className={styles.cardTitle}>Valor Total Contratado (Ativo)</div>
        </div>
        <div className={styles.cardValue}>{formatCurrency(metrics.totalContractedValue)}</div>
        <div className={styles.cardSubtitle}>Soma total de todos os contratos</div>
      </div>
    </div>
  );
};
