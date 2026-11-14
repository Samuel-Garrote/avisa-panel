import { Alert } from '@nimbus-ds/components/Alert';
import { Box } from '@nimbus-ds/components/Box';
import { Button } from '@nimbus-ds/components/Button';
import { Card } from '@nimbus-ds/components/Card';
import { Checkbox } from '@nimbus-ds/components/Checkbox';
import { Text } from '@nimbus-ds/components/Text';
import { FormField } from '@nimbus-ds/patterns/FormField';
import { useEffect, useState } from 'react';
import { api } from '../api';
import { ErrorState } from '../components/ErrorState';
import { Loading } from '../components/Loading';
import { MAX_MESSAGE_LENGTH, type StoreSettings } from '../models';
import { useRequest } from '../useRequest';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Example used to preview the message
const EXAMPLE_PRODUCT = 'Camiseta azul';
const EXAMPLE_URL = 'https://tutienda.com/productos/camiseta-azul';

export function SettingsPage() {
  const { state, reload } = useRequest(api.getSettings);
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [touched, setTouched] = useState(false);

  // Fill the form once the settings arrive
  useEffect(() => {
    if (state.status === 'success') {
      setForm(state.data);
    }
  }, [state]);

  if (state.status === 'loading' || (state.status === 'success' && !form)) {
    return <Loading />;
  }
  if (state.status === 'error' || !form) {
    return <ErrorState onRetry={reload} />;
  }

  const messageMissing = form.messageTemplate.trim() === '';
  const preview = form.messageTemplate.replaceAll('{product}', EXAMPLE_PRODUCT).replaceAll('{url}', EXAMPLE_URL);

  const change = (changes: Partial<StoreSettings>) => {
    setForm({ ...form, ...changes });
    setSaveStatus('idle');
  };

  const save = async () => {
    setTouched(true);
    if (messageMissing) {
      return;
    }
    setSaveStatus('saving');
    try {
      setForm(await api.updateSettings(form));
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="4">
      <Card>
        <Card.Header title="Mensaje del aviso" />
        <Card.Body>
          <Box display="flex" flexDirection="column" gap="4">
            <FormField.Textarea
              id="messageTemplate"
              name="messageTemplate"
              label="Texto que recibe el cliente"
              helpText={
                touched && messageMissing
                  ? 'Escribe el mensaje.'
                  : `Usa {product} para el nombre del producto y {url} para el enlace. Máximo ${MAX_MESSAGE_LENGTH} caracteres.`
              }
              showHelpText
              appearance={touched && messageMissing ? 'danger' : 'none'}
              value={form.messageTemplate}
              maxLength={MAX_MESSAGE_LENGTH}
              lines={4}
              onChange={(event) => change({ messageTemplate: (event.target as HTMLTextAreaElement).value })}
            />
            <Box display="flex" flexDirection="column" gap="1">
              <Text fontWeight="bold">Vista previa</Text>
              <Box backgroundColor="neutral-surface" borderRadius="2" padding="3">
                <Text>{preview}</Text>
              </Box>
            </Box>
          </Box>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header title="Canales" />
        <Card.Body>
          <Box display="flex" flexDirection="column" gap="3">
            <Checkbox
              name="emailEnabled"
              label="Email: se envía a los clientes que dejaron su email"
              checked={form.emailEnabled}
              onChange={(event) => change({ emailEnabled: event.target.checked })}
            />
            {/* WhatsApp arrives with the Meta integration */}
            <Checkbox name="whatsappEnabled" label="WhatsApp: próximamente" checked={false} disabled />
          </Box>
        </Card.Body>
      </Card>

      {saveStatus === 'saved' && <Alert appearance="success">Cambios guardados.</Alert>}
      {saveStatus === 'error' && (
        <Alert appearance="danger">No pudimos guardar los cambios. Inténtalo de nuevo.</Alert>
      )}

      <Box display="flex" justifyContent="flex-end">
        <Button appearance="primary" onClick={save} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? 'Guardando...' : 'Guardar'}
        </Button>
      </Box>
    </Box>
  );
}
