# Campaña de Google Ads — lista para cargar

Todo sale de `campana.json`. Si cambias un texto, corre `node scripts/build-google-ads.mjs`:
valida los límites de Google (título 30, descripción 90, ruta 15) y regenera los CSV.

## Antes de encender

1. **Medición.** Crea una propiedad GA4 y pasa el ID (`G-…`) para instalarlo en el sitio con las
   conversiones (clic a WhatsApp, a teléfono y a correo). Sin eso se paga a ciegas.
2. **Cuenta de Google Ads** en https://ads.google.com con el correo de la empresa. Cuando pregunte,
   elegir **"Cambiar al modo experto"** y **"Crear una cuenta sin campaña"**: el modo guiado crea
   campañas automáticas que gastan en búsquedas irrelevantes.
3. Moneda **GTQ**, zona horaria **Guatemala**. No se pueden cambiar después.

## Configuración de la campaña

| Ajuste | Valor |
|---|---|
| Objetivo | Clientes potenciales (o "sin objetivo") |
| Tipo | **Búsqueda** — desmarcar *Red de Display* y *Socios de búsqueda* |
| Ubicación | Guatemala → opciones → **"Presencia: personas que están en la ubicación"** |
| Idioma | Español |
| Horario | Todos los días, 7:00–19:00 |
| Presupuesto | **Q65 diarios** (≈ Q1,950 al mes) |
| Puja | Maximizar clics, **CPC máximo Q12**. Pasar a *Maximizar conversiones* con 20–30 conversiones |
| Sufijo de URL final | `utm_source=google&utm_medium=cpc&utm_campaign=busqueda-gt` |

## Cargar el contenido

Con **Google Ads Editor** (gratis, de escritorio): Cuenta → Importar → Desde archivo, en este orden:
`palabras-clave.csv`, `anuncios.csv`, `negativas.csv`. Editor muestra una pantalla para confirmar a qué
columna corresponde cada dato; revisar ahí antes de aceptar y luego "Publicar".

Sin Editor, se copia a mano desde `campana.json`: 6 grupos de anuncios, cada uno con sus palabras,
12 títulos y 4 descripciones.

Recursos (extensiones) a crear en la interfaz, con los textos de `campana.json`:
enlaces de sitio (6), textos destacados (8), fragmento estructurado "Servicios", y **llamada** al
+502 4214 1321. Cuando exista la ficha de Google Business, vincularla como recurso de **ubicación**.

## Decisiones que conviene revisar

- **Negativas residenciales**: se excluyen baños, cocinas, jardines y piscinas porque la empresa
  trabaja comercial e industrial. Si se quiere captar remodelación residencial, quitarlas.
- **Tablayeso** va en su propio grupo y solo con palabras de *instalación*. Las de material
  (plancha, pasta, poste, precio de plancha) están como negativas: es público de ferretería.
- Todos los textos repiten solo lo que el sitio ya afirma (+50 proyectos, horario, un solo
  responsable, presupuesto desglosado). No agregar promesas que la empresa no haya confirmado.

## Rutina semanal (15 minutos)

1. Informe **Términos de búsqueda**: lo irrelevante se agrega como negativa.
2. Pausar palabras con muchos clics y ningún contacto tras ~Q300 gastados.
3. Revisar costo por contacto por grupo y mover presupuesto al que mejor rinde.

## Qué esperar

El mercado es pequeño (~1,300 búsquedas comerciales al mes en todo el rubro), así que es normal que no
se gaste el presupuesto completo. Con clics a ~Q8 y entre 3 % y 6 % de visitantes que escriben o
llaman, el orden de magnitud es de 6 a 18 contactos al mes. Es una estimación con supuestos; el dato
real aparece después de 3–4 semanas con medición.
