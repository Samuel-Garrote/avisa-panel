# Avisa — panel del comerciante (React + Nimbus)

Panel integrado en el administrador de Tiendanube: resumen de avisos, mensaje y canales, y plan.

- **React 18 + Vite**, con los componentes y plantillas de **Nimbus** (`@nimbus-ds/components`,
  `@nimbus-ds/patterns`), el sistema de diseño del administrador que pide la homologación.
- **Nexo** conecta el panel con el administrador: sincroniza las rutas, da el token de sesión con el que se
  llama al backend y su `ErrorBoundary` reporta los errores.

## Desarrollo

```bash
npm install
npm run dev
```

Sirve el panel en `http://localhost:4200` y llama al backend local `http://localhost:8081` (`.env.development`).
Fuera del administrador muestra «Abre Avisa desde tu administrador»: hay que abrirlo desde Aplicaciones en la
tienda demo, con «Integrar en el administrador» apuntando a `http://localhost:4200`.

## Producción

```bash
npm run build
```

Sube la carpeta `dist` a Cloudflare Pages (proyecto `avisa-panel`, entorno Producción).
Usa `.env.production`: API `https://avisa-api.saasifylabs.net` y el plan Pro como «próximamente»
(`VITE_BILLING_ENABLED=false`) hasta activar Stripe con pagos reales.

Cloudflare Pages sirve `index.html` en cualquier ruta del panel, y `public/privacidad.html`, `terminos.html` y
`soporte.html` en `/privacidad`, `/terminos` y `/soporte`.
