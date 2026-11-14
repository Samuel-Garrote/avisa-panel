import { Button } from '@nimbus-ds/components/Button';
import { ExclamationTriangleIcon, RedoIcon } from '@nimbus-ds/icons';
import { EmptyMessage } from '@nimbus-ds/patterns/EmptyMessage';

interface ErrorStateProps {
  onRetry: () => void;
}

// Error page shown when the panel cannot load data from the backend
export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <EmptyMessage
      icon={<ExclamationTriangleIcon size={32} />}
      title="No pudimos cargar la información"
      text="Puede ser un problema momentáneo. Intenta de nuevo en unos segundos."
      actions={
        <Button appearance="primary" onClick={onRetry}>
          <RedoIcon />
          Reintentar
        </Button>
      }
    />
  );
}
