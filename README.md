# Wedding Film Site — React + Framer Motion

Sitio de una sola página para servicios de film de bodas. Vite + React 19 + Framer Motion. Bilingüe (EN/ES, con selector en el menú).

## Arrancar

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción → dist/
```

## Personalizar (todo en `src/content.js`)

- `brand`: nombre, email, redes. **Los textos, precios, estadísticas y testimonios actuales son de ejemplo: reemplázalos.**
- `films`: cada film acepta `vimeo` (ID de Vimeo) o `video` (ruta a MP4) y `still` (imagen de portada).
- `plans` y `builderConfig`: precios de las colecciones y del constructor interactivo (base, precio por hora, extras).
- `content.en` / `content.es`: todos los textos.

## Medios (opcionales)

Sin archivos, el sitio muestra degradados cinematográficos. Para usar los tuyos, ver `public/media/README.txt`:
`hero.mp4`, `hero-poster.jpg` y `films/<id>.jpg`. Los films completos van en Vimeo; nunca subas 4K sin comprimir al sitio.

## Formulario de contacto

El formulario envía un POST a `/api/contact` (`api/contact.js`, función de Vercel) que te manda el correo desde un buzón de Hostinger por SMTP. Variables en Vercel → Settings → Environment Variables:

- `SMTP_USER`: el buzón de Hostinger (p. ej. `hello@tudominio.com`).
- `SMTP_PASS`: la contraseña de ese buzón.
- `CONTACT_TO` (opcional): dónde recibes las consultas; por defecto, el mismo buzón.
- `SMTP_HOST` / `SMTP_PORT` (opcionales): `smtp.hostinger.com` / `465`.

Sin configurar (o en `npm run dev`, donde no existe `/api`) abre el correo del visitante con el mensaje listo. Para usar otro servicio (Formspree, etc.) define `VITE_FORM_ENDPOINT`. Para probar la función en local: `npx vercel dev`.

## Desplegar en Vercel

1. Sube la carpeta a GitHub (o usa `vercel` desde la terminal).
2. En Vercel: *Add New → Project* e importa el repositorio. Detecta Vite solo (`npm run build`, salida `dist`).
3. Opcional: agrega `VITE_FORM_ENDPOINT`.

## Interacciones principales

| Interacción | Archivo |
|---|---|
| Intro con barras de cine y contador | `components/Loader.jsx` |
| Hero: el reel pasa de pantalla completa a marco de cine al hacer scroll | `sections/Hero.jsx` |
| Marquesina que reacciona a la velocidad del scroll | `components/Marquee.jsx` |
| Manifiesto que se ilumina palabra por palabra | `components/Reveal.jsx` |
| Films en tira horizontal guiada por scroll + modo teatro con letterbox | `sections/Films.jsx`, `components/Theater.jsx` |
| Cursor "Play" sobre los films | `components/Cursor.jsx` |
| Constructor de film: horas, equipo y entregables con línea de tiempo del día y precio en vivo | `sections/Collections.jsx` |
