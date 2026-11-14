import { Box } from '@nimbus-ds/components/Box';
import { Button } from '@nimbus-ds/components/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const SECTIONS = [
  { path: '/dashboard', label: 'Resumen' },
  { path: '/settings', label: 'Mensaje y canales' },
  { path: '/billing', label: 'Plan' },
];

// Links between the three panel pages; the current one is highlighted
export function Navigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box display="flex" gap="2" flexWrap="wrap" marginBottom="4">
      {SECTIONS.map((section) => (
        <Button
          key={section.path}
          appearance={pathname === section.path ? 'primary' : 'neutral'}
          onClick={() => navigate(section.path)}
        >
          {section.label}
        </Button>
      ))}
    </Box>
  );
}
