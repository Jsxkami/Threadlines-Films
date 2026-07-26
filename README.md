# Threadlines Films

Sitio web para un filmmaker de bodas, construido con **React + Vite + GSAP**.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para producción:

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  App.jsx                  → ensambla todas las secciones
  styles.css                → todos los estilos (tokens de diseño arriba del archivo)
  data/projects.js          → contenido del portafolio (edítalo con tus proyectos reales)
  components/
    CustomCursor.jsx        → cursor tipo "diafragma de cámara"
    Navbar.jsx
    Hero.jsx
    About.jsx
    Portfolio.jsx           → grid + abre el modal
    ProjectModal.jsx        → lightbox cinematográfico con reproductor custom
    Pricing.jsx             → cards + add-ons + CTA final
    Contact.jsx
    Footer.jsx
```

## Lo primero que vas a querer editar

1. **Videos reales:** en `src/data/projects.js`, cada proyecto tiene un campo
   `videoUrl` vacío. Pon ahí la URL de tu archivo `.mp4` (puede ser local en
   `/public/videos/...` o alojado en un CDN/Cloudinary/Mux). Mientras esté
   vacío, el modal muestra un placeholder con el nombre del proyecto.

2. **Imágenes de portada:** las tarjetas del portafolio usan gradientes
   (`TONES` en `Portfolio.jsx`) como placeholder. Reemplázalos por
   `background-image: url('/images/tu-foto.jpg')` cuando tengas los stills.

3. **Copy:** todos los textos (Hero, About, descripciones de proyectos,
   pricing) están escritos como ejemplo editorial — reemplázalos con tu
   contenido real directamente en cada componente o en `projects.js`.

4. **Formulario de contacto:** `Contact.jsx` solo simula el envío
   (`setStatus('sent')`). Conéctalo a tu backend/servicio de formularios
   preferido (Formspree, Resend, una función serverless, etc.) dentro de
   `handleSubmit`.

5. **Colores/tipografía:** todo vive en `:root` al inicio de `src/styles.css`
   — cambia `--paper`, `--ink`, `--accent` o las variables de fuente ahí y
   se propaga a todo el sitio.

## Notas técnicas

- El modal cumple con el spec: 70/30 en desktop, video arriba en
  tablet/mobile, animación GSAP fade+scale, navegación anterior/siguiente sin
  cambiar de ruta, cierre con ESC/click-fuera/botón X.
- Las animaciones de scroll usan `ScrollTrigger` de GSAP (ya incluido en la
  dependencia `gsap`, no necesitas instalar nada aparte).
- El cursor custom se oculta automáticamente en touch/mobile.
- `prefers-reduced-motion` está respetado a nivel global en `styles.css`.
