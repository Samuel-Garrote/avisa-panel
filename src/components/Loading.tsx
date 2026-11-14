import { Box } from '@nimbus-ds/components/Box';
import { Spinner } from '@nimbus-ds/components/Spinner';

// Shown while a page waits for the backend
export function Loading() {
  return (
    <Box display="flex" justifyContent="center" padding="8">
      <Spinner size="large" />
    </Box>
  );
}
