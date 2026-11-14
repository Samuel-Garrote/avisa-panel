import { Button } from '@nimbus-ds/components/Button';
import { MailIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns/EmptyMessage';
import { SummaryStats } from '@nimbus-ds/patterns/SummaryStats';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ErrorState } from '../components/ErrorState';
import { Loading } from '../components/Loading';
import { useRequest } from '../useRequest';

const numberFormat = new Intl.NumberFormat('es');

export function DashboardPage() {
  const navigate = useNavigate();
  const { state, reload } = useRequest(api.getMetrics);

  if (state.status === 'loading') {
    return <Loading />;
  }
  if (state.status === 'error') {
    return <ErrorState onRetry={reload} />;
  }

  const metrics = state.data;

  // Initial state: the app works, but no shopper has asked for a notification yet
  if (metrics.requested === 0) {
    return (
      <EmptyMessage
        icon={<MailIcon size={32} />}
        title="Todavía no hay avisos"
        text={
          'Cuando un cliente pida que le avisen de un producto sin stock, lo verás aquí. ' +
          'El botón «Avísame cuando vuelva» ya aparece en tu tienda en los productos agotados.'
        }
        actions={<Button onClick={() => navigate('/settings')}>Personalizar el mensaje</Button>}
      />
    );
  }

  return (
    <SummaryStats layout="horizontal">
      <SummaryStats.Item
        id="requested"
        value={numberFormat.format(metrics.requested)}
        description="Avisos pedidos"
      />
      <SummaryStats.Item
        id="notified"
        value={numberFormat.format(metrics.notified)}
        description="Avisos enviados"
      />
      <SummaryStats.Item
        id="pending"
        value={numberFormat.format(metrics.pending)}
        description="Esperando stock"
      />
    </SummaryStats>
  );
}
