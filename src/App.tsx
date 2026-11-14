import { Box } from '@nimbus-ds/components/Box';
import { Text } from '@nimbus-ds/components/Text';
import { StoreIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns/EmptyMessage';
import { Page } from '@nimbus-ds/patterns/Page';
import { connect, ErrorBoundary } from '@tiendanube/nexo';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Loading } from './components/Loading';
import { Navigation } from './components/Navigation';
import { NexoSync } from './components/NexoSync';
import { nexo } from './nexo';
import { BillingPage } from './pages/BillingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Resumen',
  '/settings': 'Mensaje y canales',
  '/billing': 'Plan',
};

// null: connecting, true: inside the admin, false: opened outside the admin
type Connection = boolean | null;

export function App() {
  const [connected, setConnected] = useState<Connection>(null);

  // Connect with the Tiendanube admin before showing anything (waits up to 3 seconds)
  useEffect(() => {
    connect(nexo)
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  if (connected === null) {
    return <Loading />;
  }

  if (!connected) {
    return (
      <Box padding="8">
        <EmptyMessage
          icon={<StoreIcon size={32} />}
          title="Abre Avisa desde tu administrador"
          text="Este panel funciona dentro del administrador de Tiendanube, en la sección Aplicaciones."
        />
      </Box>
    );
  }

  // ErrorBoundary (from Nexo) reports unexpected errors to the admin and shows a fallback screen
  return (
    <ErrorBoundary nexo={nexo}>
      <BrowserRouter>
        <NexoSync />
        <AvisaPage />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AvisaPage() {
  const { pathname } = useLocation();

  return (
    <Page maxWidth="960px">
      <Page.Header title={PAGE_TITLES[pathname] ?? 'Avisa'} subtitle="Avisos de reposición de stock" />
      <Page.Body>
        <Navigation />
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Box marginTop="6">
          <Text fontSize="caption" color="neutral-textLow">
            ¿Necesitas ayuda? Escríbenos a soporte@saasifylabs.net
          </Text>
        </Box>
      </Page.Body>
    </Page>
  );
}
