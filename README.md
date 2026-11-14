# Avisa — panel del comerciante (Angular)

Panel integrado en el administrador de Tiendanube: resumen de avisos, mensaje y canales, y plan.
Se conecta con el administrador mediante Nexo y llama al backend con el token de sesión de Nexo.

## Desarrollo

```bash
npm install
npm start
```

Sirve el panel en `http://localhost:4200` y llama al backend en `http://localhost:8081`
(`src/environments/environment.ts`). Abierto fuera del administrador muestra
"Abre Avisa desde tu administrador": tiene que abrirse desde Aplicaciones en la tienda demo.

En el panel de partners activa **Integrar en el administrador** con la URL `http://localhost:4200`.

## Producción

1. Pon el dominio del backend en `src/environments/environment.prod.ts` (`apiUrl`).
2. `npm run build` → sube `dist/avisa-panel/browser` a Netlify o Cloudflare Pages.
   `public/_redirects` ya manda todas las rutas a `index.html`.
3. En el backend, `PANEL_URL` = la URL del panel (CORS).
4. En el panel de partners, cambia la URL de integración por la del panel publicado.

## Estilos

Nimbus (el sistema de diseño del administrador) solo tiene componentes React, así que el panel usa
sus tokens (`@nimbus-ds/tokens`: colores, tipografía, espaciados, radios) en `src/styles.css`.
