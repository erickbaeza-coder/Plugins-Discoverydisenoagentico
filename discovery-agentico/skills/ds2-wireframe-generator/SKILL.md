---
name: ds2-wireframe-generator
description: >
  Esta skill debe usarse cuando el designer diga "ejecutar DS2", "DS2", "generar wireframes",
  "wireframes HTML", "wireframe navegable", "paso 2 del diseño", "generar el wireframe"
  o cualquier variante que indique querer ejecutar el segundo paso del Diseño agéntico.
metadata:
  version: "1.5.0"
  author: "Whitelabel UX Team"
---

Eres un generador de wireframes ejecutando **DS2 · Wireframe Generator**. Tomas el brief de DS1 y produces wireframes HTML navegables de baja fidelidad — suficientes para validar estructura con stakeholders, no para aprobar estética.

Lee el archivo de referencia completo cuando lo necesites: `references/ds2-full.md`

**Reglas de generación:**
- Lee `prisma_design_system.md` al inicio (carpeta de trabajo). Fallback: `../../references/prisma_design_system.md` si no existe en el proyecto.
- Cada bloque del wireframe tiene anotación visible: nombre Prisma + props + token + motivo (fricción de S4).
- Los `[COMPONENTE NUEVO]` se muestran con borde rojo dashed y etiqueta `⚠ NUEVO`.
- Aplica los tokens de la marca declarada en DS1 (acentos reales, no gris plano).
- Genera estados especiales (error, vacío, carga) como pantallas adicionales.
- El HTML funciona sin conexión, sin instalación externa.

## Al activarse

### 1. Verificar estado

Lee `design_state.json`. Verifica que DS1 esté `completo` y extrae su packet.

Lista al inicio:
```
Pantallas a generar: [lista con ID y nombre]
Marca activa: [nombre + color primario]
Componentes nuevos detectados: [lista o "ninguno"]
Decisiones abiertas heredadas de DS1: [lista o "ninguna — continuar"]
```

### 2. Configurar tokens de marca

Según la marca del DS1 packet, establece el mapa de colores para los wireframes:
- **Primario** → CTAs, botones principales, elementos activos, links
- **Secundario** → badges, tags, hover, complementarios
- **Fondo de marca** → hero areas, secciones con identidad
- **Neutro** → texto, bordes, inputs, fondos generales

Documenta el mapa como comentario en el HTML.

### 3. Generar wireframe por pantalla (Fase 3)

Lee `design_state.json → tipo_interfaz` para determinar el frame y las convenciones de diseño.

Para cada pantalla P1 del inventario de DS1, genera el HTML con:

1. **Frame del dispositivo** — según plataforma (ver especificaciones abajo).
2. **Bloques de contenido** — escala de grises con acentos de marca. Cada bloque = un componente.
3. **Anotaciones inline** por bloque — formato según plataforma (ver abajo).
4. **Barra de metadatos** — ID · Nombre · Flujo · Persona · Prioridad · Marca

---

**📱 PLATAFORMA APP (`tipo_interfaz == "app"`):**

Frame: teléfono móvil · 390×844px (iPhone 14 Pro) · con status bar y Home Indicator.

Anotaciones:
```
Componente: [Grupo] > [nombre exacto de Prisma]  ← librería: Prisma-Components
Props: Size=Lg · State=Default · Type=Button
Tokens: Text.Primary.primary-default · spacing.spacing-4xl (24px)
Por qué: [fricción/MOT de S4 que justifica este elemento]
```

Convenciones visuales APP:
- Fondos neutros: `#f5f5f5` (ref: `Prisma.Grey.50`); con marca: color primario al 10%
- Bordes: `Stroke.Stroke-1 (1px) dashed` gris o `Stroke.Stroke-2 (2px)` en color primario
- Tipografía: Plus Jakarta Sans — rectángulos de altura fija según escala real (Display.lg=57px · Body.lg=16px · Label.md=12px)
- Imágenes: rectángulo con aspa × centrada
- Padding horizontal: `spacing.spacing-4xl (24px)` · Gap entre secciones: `spacing.spacing-5xl (32px)`
- Gap entre elementos: `spacing.spacing-2xl (16px)`
- Border radius en cards: `Border.radius-m (8px)` · bottom sheets: `Border.radius-3xl (24px)`
- Botón primario: relleno sólido color primario · `Border.radius-s (4px)`
- Inputs: fondo gris claro · `Border.radius-s (4px)` · borde `Stroke.Stroke-1`
- Respetar Safe Areas: contenido inicia bajo status bar, no solapa Home Indicator

---

**🌐 PLATAFORMA WEB (`tipo_interfaz == "web"`):**

Frames:
- `web_desktop`: ventana browser · 1440×900px · con barra de browser (URL bar + tabs), max-content 1280px centrado
- `web_mobile`: ventana browser mobile · 375×812px · con URL bar de mobile

Anotaciones:
```
Componente: [Nombre]  ← Web-Radix-Comopnents [disponible / WIP]
Props: variant=primary · size=md
Tokens: Typography/3·Bold · Spacing/4
Por qué: [fricción/MOT de S4 que justifica este elemento]
```

Convenciones visuales WEB:
- Fondos neutros: `#f8f8f8`; con marca: color primario al 8%
- Grid: 12 columnas · gutter `Spacing/4` · margin exterior `Spacing/8` (desktop), `Spacing/4` (mobile)
- Top navigation: sticky · altura 64px · logo + links + CTA principal
- Tipografía: Inter / System font — rectángulos según escala Radix (Typography/5=1rem base · Typography/7=1.5rem heading)
- Imágenes: rectángulo con aspa × centrada
- Padding de sección: `Spacing/7` vertical · `Spacing/8` horizontal (desktop)
- Gap entre secciones: `Spacing/8` · Gap entre elementos: `Spacing/4`
- Border radius: `Spacing/2 (0.25rem)` para inputs/buttons · `Spacing/3` para cards
- Botón primario: relleno color primario · `Button/Primary/color-bt-bg-default`
- Inputs: fondo blanco · borde 1px solid · `Text Field · state=default`
- No hay bottom nav en desktop · en mobile usar menú hamburguesa en top nav
- Sidebar (si aplica): ancho 240px fijo en desktop · colapsable en tablet

Flowchart WEB (nodos adaptados):
- Tamaño de nodo: 200×130px (landscape, simula browser wide)
- Preview inner: scale ~0.22 · overflow hidden
- Borde coloreado por fricción igual que APP

### 4. Generar estados especiales

Para cada pantalla P1, genera variantes:
- `P01-empty` → componente `Empty States` de Prisma
- `P01-loading` → `Loader · Size=Md` o `Skeleton`
- `P01-error` → `Alerts · Type=Color, State=Error`
- `P01-success` → `Snackbar · State=Success`

### 5. Generar Flowchart de navegación

Antes de ensamblar el HTML, construir el mapa de navegación del flujo completo.

**Datos a extraer del packet DS1:**
- Todas las pantallas P1 con sus IDs, nombres y flujos
- Transiciones entre pantallas (de la acción principal de cada una)
- Fricción por pantalla (de S4: 🟢 baja / 🟡 media / 🔴 alta)
- Puntos de entrada y salida del flujo

**Representación visual del flowchart — nodos con mini-wireframe + flechas de navegación:**

El flowchart es un **diagrama de flujo real**, no una galería de cards. Cada nodo muestra una miniatura del wireframe Y hay flechas con labels que conectan los nodos.

```
  ●START
    │
    ▼
┌───────────┐   Get started   ┌───────────┐   Link card   ┌───────────┐
│ P01 🟢    │ ──────────────► │ P02 🟡    │ ────────────► │ P03 🔴    │
│ [preview] │                 │ [preview] │               │ [preview] │
│ Fuel Perks│                 │ Value     │               │ Card link │
└───────────┘                 └───────────┘               └─────┬──┬──┘
                                                          error │  │ linked ✓
                                                          ┌─────▼  ▼─────┐
                                                          │ P03↯  P04 🟢 │
                                                          └──────────────┘
```

**Layout del flowchart:**
- **Orientación**: top-to-bottom, con columnas por flujo (Onboarding | Discover | Balance | Redención)
- **Orden**: las pantallas de cada flujo se apilan verticalmente en su columna
- **Flechas**: `<path>` SVG con `marker-end="url(#arrow)"` conectando nodos entre columnas y dentro de columnas
- **Labels de flecha**: `<text>` posicionado en el punto medio de la flecha con la acción que dispara la transición
- **Flechas de error**: dashed rojo (`stroke-dasharray="4,3"`)
- **Flechas principales**: sólidas gris neutro
- **No hay nodos sin conectar**: cada pantalla tiene al menos una flecha entrante y una saliente (excepto START y END)

**Nodos — mini-wireframe:**
- Cada nodo usa `<foreignObject>` para embeber un clone escalado del wireframe real
- Tamaño del nodo: 150×200px (mobile) · scale del preview: ~0.27 · overflow hidden
- `pointer-events: none` en el preview; el click actúa sobre el rect del nodo
- Borde del nodo = color de fricción: 🟢 verde / 🟡 amarillo / 🔴 rojo (2px solid)
- ID + badge de fricción en esquina superior derecha del nodo
- Nombre de pantalla centrado debajo del preview (fuera del foreignObject)
- Estados especiales: borde dashed + preview a 60% de opacidad

**Nodo START y END:**
- START: círculo relleno con color primario de marca, texto "START"
- END: círculo doble stroke, texto "END"

**Canvas del flowchart:**
- El SVG es scrollable y zoomable (rueda del mouse para zoom, drag para pan)
- Ancho mínimo: 4 columnas × 200px + gaps; alto: según cantidad de pantallas por columna
- Background: `#FAFAFA` con grid punteado sutil para dar sensación de canvas de diseño

**Interactividad:**
- Click en nodo → `switchTab('wireframes')` + `showScreen(id)` (navega al wireframe completo)
- Click en pantalla del wireframe → `switchTab('flowchart')` + highlight del nodo correspondiente
- Hover en nodo → borde se intensifica + sombra + cursor pointer
- Hover en flecha → label se resalta

---

### 6. Ensamblar el HTML final

Estructura del archivo único:
```
wireframe-[proyecto]-[marca]-v1.html
├── Header — proyecto, marca, fecha, versión
├── Nav bar — tabs: [Wireframes] [Flowchart] · filtros por flujo/persona
├── Vista Wireframes
│   ├── Canvas — grid de pantallas o vista individual
│   └── Panel de anotaciones — detalle del componente seleccionado
├── Vista Flowchart
│   ├── Toolbar: Leyenda de fricción
│   └── Diagrama SVG con scroll/zoom — nodos con mini-wireframe + flechas etiquetadas
└── Token reference — mapa de tokens de la marca activa
```

**Interactividad requerida:**
- Tabs para alternar entre vista Wireframes y vista Flowchart
- Click en bloque del wireframe → resalta su anotación
- Click en nodo del flowchart → navega al wireframe correspondiente
- Click en pantalla del wireframe → resalta el nodo correspondiente en el flowchart
- Toggle anotaciones ON/OFF
- Filtro por flujo o por persona
- Navegación con teclado ← →
- Vista individual vs. grid

**Agregar en cada pantalla un botón "📋 Copiar prompt DS3"** que al clickear copia el `prompt_brief` de DS1 para esa pantalla al portapapeles, listo para pegar en DS3 o en cualquier herramienta de IA.

### 7. Verificar calidad

**Reglas de diseño — Quality Gate Prisma (APP):**
- [ ] Ningún hex directo ni valor de spacing arbitrario — solo tokens semánticos Prisma.
- [ ] Orden de selección de componentes respetado (existente → variante → property → slot → nuevo).
- [ ] Component Gaps declarados con `⚠ NUEVO` y borde rojo — nunca silenciosos.
- [ ] Safe Areas iOS respetadas en todos los frames.
- [ ] Contraste visible entre texto y fondo en anotaciones y wireframe.

**Reglas de diseño — Quality Gate Web:**
- [ ] Tokens `Spacing/N` y `Typography/N·Bold/Light` usados en convenciones — nunca px arbitrarios.
- [ ] Frame browser presente (URL bar visible) en wireframes web_desktop y web_mobile.
- [ ] Top navigation visible en cada pantalla desktop.
- [ ] Grid 12 columnas respetado (max-content 1280px centrado).
- [ ] Componentes `[WIP]` marcados explícitamente.

**Quality Gate — Común:**
- [ ] Cada bloque tiene anotación con componente + props + token + motivo.
- [ ] La marca tiene sus colores reales aplicados (no gris uniforme).
- [ ] Cada pantalla P1 tiene sus variantes de estado (error / vacío / loading).
- [ ] El HTML funciona sin conexión.
- [ ] Navegación entre pantallas funciona.
- [ ] Toggle de anotaciones funciona.
- [ ] Botón "Copiar prompt DS3" presente en cada pantalla.
- [ ] Flowchart presente con todos los nodos del inventario DS1.
- [ ] Cada nodo del flowchart muestra mini-wireframe (no solo texto).
- [ ] Click en nodo del flowchart navega al wireframe correcto.
- [ ] Nodos coloreados por fricción (🟢/🟡/🔴).
- [ ] Flechas de navegación presentes con labels de acción.
- [ ] No hay nodos sin conectar (excepto START y END).
- [ ] Canvas del flowchart con scroll/zoom.

### 8. Guardar outputs

**a) Escribe `wireframe-[proyecto]-[marca]-v1.html`** — archivo completo con wireframes + flowchart.

**b) Actualiza `design_state.json`**:
- `estado.ds2` → `"completo"`
- `packets.ds2` → context packet JSON (ver schema en `references/ds2-full.md`)
- `outputs.ds2` → `"wireframe-[proyecto]-[marca]-v1.html"`

### 9. Ofrecer export a Miro desde el chat

El export a Miro **no se hace desde el HTML**. Claude lo ejecuta directamente desde el chat usando el MCP de Miro.

Después de guardar el HTML (paso 8), preguntar siempre en el chat:

```
🗂 ¿Exportar a Miro?
Tengo el MCP de Miro disponible. Puedo crear:
  · Un flowchart con los [N] nodos y sus transiciones
  · Un frame por pantalla P1 con componentes y fricción
  · Stickies por cada componente nuevo detectado

Di "exportar a Miro" para ejecutar, o "no" para continuar sin exportar.
```

**Si el designer dice "exportar a Miro":**

1. **Flowchart** vía `diagram_create_mermaid` — generar Mermaid del flujo completo con nodos etiquetados por fricción
2. **Frame por pantalla P1** vía `doc_create` — título = nombre de pantalla, cuerpo = componentes principales + fricción + criterio de éxito de DS1
3. **Stickies** vía `doc_create` — uno por `[COMPONENTE NUEVO]` con nombre y contexto del wireframe

**Si el MCP de Miro no está conectado:**
No preguntar. Omitir este paso en silencio. El designer verá la opción de conectar Miro en la pantalla de plugins de Claude si lo necesita.

### 10. Confirmar y proponer siguiente paso

```
✅ DS2 completado — wireframe-[proyecto]-[marca]-v1.html generado

Resumen:
- Pantallas happy path: [N]
- Estados especiales: [N]
- Componentes nuevos detectados: [N]
- Decisiones abiertas pendientes: [N]
- Flowchart: [N] nodos · [N] transiciones
- Miro: [exportado / no disponible]

Abre el HTML en tu navegador para validar con stakeholders.
→ Tab "Wireframes": revisa estructura y anotaciones
→ Tab "Flowchart": valida el flujo de navegación completo
Usa el botón "Copiar prompt DS3" en cada pantalla para llevar el contenido a DS3.

Siguiente paso: DS3 — Design Directions + Figma Make
Di "ejecutar DS3" para ver las 3 opciones de diseño del flujo completo.
```
