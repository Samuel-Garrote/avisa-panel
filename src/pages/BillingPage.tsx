import { Alert } from '@nimbus-ds/components/Alert';
import { Box } from '@nimbus-ds/components/Box';
import { Button } from '@nimbus-ds/components/Button';
import { Card } from '@nimbus-ds/components/Card';
import { ProgressBar } from '@nimbus-ds/components/ProgressBar';
import { Tag } from '@nimbus-ds/components/Tag';
import { Text } from '@nimbus-ds/components/Text';
import { openInDefaultBrowser } from '@tiendanube/nexo';
import { useState } from 'react';
import { api } from '../api';
import { ErrorState } from '../components/ErrorState';
import { Loading } from '../components/Loading';
import { config } from '../config';
import { nexo } from '../nexo';
import { useRequest } from '../useRequest';

// Stripe statuses shown to the merchant
const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  trialing: 'En prueba',
  past_due: 'Pago pendiente',
  unpaid: 'Impago',
  canceled: 'Cancelado',
  incomplete: 'Pago incompleto',
};

const numberFormat = new Intl.NumberFormat('es');

export function BillingPage() {
  const { state, reload } = useRequest(api.getBilling);
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState(false);

  if (state.status === 'loading') {
    return <Loading />;
  }
  if (state.status === 'error') {
    return <ErrorState onRetry={reload} />;
  }

  const billing = state.data;
  const isActive = billing.status === 'active' || billing.status === 'trialing';
  const usedPercent =
    billing.notificationLimit === 0
      ? 0
      : Math.min(100, Math.round((billing.notificationsThisMonth / billing.notificationLimit) * 100));

  // Free plan: Stripe checkout to subscribe. Paid plan: Stripe portal to change plan or cancel.
  // Stripe pages cannot be shown inside the admin, so they open in the browser
  const openStripe = async () => {
    setOpening(true);
    setOpenError(false);
    try {
      const session = await api.createBillingSession();
      openInDefaultBrowser(nexo, session.url);
    } catch {
      setOpenError(true);
    } finally {
      setOpening(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="2">
          <Text fontSize="highlight" fontWeight="bold">
            Plan {billing.plan === 'PRO' ? 'Pro' : 'Gratis'}
          </Text>
          <Tag appearance={isActive ? 'success' : 'danger'}>{STATUS_LABELS[billing.status] ?? billing.status}</Tag>
        </Box>
      </Card.Header>
      <Card.Body>
        <Box display="flex" flexDirection="column" gap="2">
          <Text>
            <strong>{numberFormat.format(billing.notificationsThisMonth)}</strong> de{' '}
            {numberFormat.format(billing.notificationLimit)} avisos este mes
          </Text>
          <ProgressBar value={usedPercent} appearance={usedPercent >= 100 ? 'warning' : 'primary'} />
          <Text fontSize="caption" color="neutral-textLow">
            Si llegas al límite, los avisos se siguen enviando, pero solo por email.
          </Text>
          {openError && <Alert appearance="danger">No pudimos abrir la página de pago. Inténtalo de nuevo.</Alert>}
        </Box>
      </Card.Body>
      <Card.Footer>
        {config.billingEnabled ? (
          <Button appearance="primary" onClick={openStripe} disabled={opening}>
            {opening ? 'Abriendo...' : billing.plan === 'FREE' ? 'Pasar al plan Pro' : 'Gestionar plan'}
          </Button>
        ) : (
          <Text color="neutral-textLow">El plan Pro estará disponible muy pronto.</Text>
        )}
      </Card.Footer>
    </Card>
  );
}
