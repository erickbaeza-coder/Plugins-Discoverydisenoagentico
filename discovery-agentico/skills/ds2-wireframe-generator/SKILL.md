---
name: ds2-wireframe-generator
description: >
  Esta skill debe usarse cuando el designer diga "ejecutar DS2", "DS2", "generar wireframes",
  "wireframes HTML", "wireframe navegable", "paso 2 del diseño", "generar el wireframe"
  o cualquier variante que indique querer ejecutar el segundo paso del Diseño agéntico.
metadata:
  version: "1.3.0"
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

Para cada pantalla P1 del inventario de DS1, genera el HTML con:

1. **Frame del dispositivo** — teléfono o browser según plataforma, con status bar.
2. **Bloques de contenido** — escala de grises con acentos de marca. Cada bloque = un componente Prisma.
3. **Anotaciones inline** por bloque:
   ```
   Componente: [Grupo] > [nombre exacto de Prisma]  ← librería: Prisma-Components
   Props: Size=Lg · State=Default · Type=Button
   Tokens: Text.Primary.primary-default · spacing.spacing-4xl (24px)
   Por qué: [fricción/MOT de S4 que justifica este elemento]
   ```
4. **Barra de metadatos** — ID · Nombre · Flujo · Persona · Prioridad · Marca

**Convenciones visuales:**
- Fondos neutros: `#f5f5f5` (ref: `Prisma.Grey.50`); con marca: color primario al 10%
- Bordes: `Stroke.Stroke-1 (1px) dashed` gris o `Stroke.Stroke-2 (2px)` en color primario
- Tipografía: Plus Jakarta Sans — rectángulos de altura fija según escala real (Display.lg=57px · Body.lg=16px · Label.md=12px)
- Imágenes: rectángulo con aspa × centrada
- Padding de pantalla: `spacing.spacing-4xl (24px)` horizontal
- Gap entre secciones: `spacing.spacing-5xl (32px)`
- Gap entre elementos: `spacing.spacing-2xl (16px)`
- Border radius en cards: `Border.radius-m (8px)`; bottom sheets: `Border.radius-3xl (24px)`
- Botón primario: relleno sólido con color primario · `Border.radius-s (4px)`
- Botón secundario: borde `Stroke.Stroke-2` color primario, fondo transparente
- Inputs: fondo gris claro · `Border.radius-s (4px)` · borde `Stroke.Stroke-1`

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

**Representación visual del flowchart — nodos con mini-wireframe:**

Cada nodo NO es solo un rectángulo con texto. Es una tarjeta que muestra una miniatura real del wireframe de esa pantalla:

```
┌─────────────────────┐
│  P01 · 🟢           │  ← ID + fricción (esquina sup)
│ ┌─────────────────┐ │
│ │ [mini-wireframe]│ │  ← Preview escalado de la pantalla (CSS transform)
│ │  navbar         │ │     escala ~0.28 · overflow hidden · pointer-events none
│ │  hero-card      │ │
│ │  CTA button     │ │
│ └─────────────────┘ │
│  Fuel Perks Hub     │  ← nombre debajo del preview
└─────────────────────┘
```

**Implementación técnica del mini-wireframe:**
- Cada nodo del flowchart es un `<foreignObject>` en el SVG con dimensiones del nodo (ej. 160×220px)
- Dentro del `<foreignObject>`, clonar el contenido HTML de `.phone-content` de esa pantalla usando `innerHTML`
- Aplicar `transform: scale(0.27); transform-origin: top left` al contenedor clonado + `overflow: hidden` al wrapper
- `pointer-events: none` en el contenido del preview — el click actúa sobre el nodo contenedor, no el contenido
- El color del borde del nodo indica fricción: 🟢 verde / 🟡 amarillo / 🔴 rojo

**Tamaño de nodos con mini-wireframe:**
- Mobile: nodo 160×220px (preview interno ~65×95px a scale 0.27 sobre frame 390px)
- Web: nodo 200×140px (preview proporcional)
- Estados especiales (error/vacío): nodo con borde dashed, preview a 70% de opacidad

**Nodo de inicio y fin:**
- START: círculo relleno con color primario de marca
- END: círculo doble (stroke + relleno al 20%)

**Flechas:**
- Flechas con etiqueta de la acción que dispara la transición
- Flechas de error: dashed rojo
- Flechas principales: sólidas en gris neutro

**Interactividad del flowchart:**
- Click en nodo → navega automáticamente a esa pantalla en la vista de wireframes (switchTab + showScreen)
- Hover en nodo → borde se intensifica + cursor pointer
- Highlight del nodo activo cuando se navega en la vista wireframes (sincronización bidireccional)

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
│   ├── Toolbar: Leyenda de fricción · botón "Exportar a Miro" (siempre visible)
│   ├── Diagrama SVG navegable — nodos con mini-wireframe + flechas etiquetadas
│   └── Estado de conexión Miro (badge inline en el botón)
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

- [ ] Cada bloque tiene anotación con componente + props + token + motivo.
- [ ] Componentes nuevos marcados con borde rojo y etiqueta ⚠ NUEVO.
- [ ] La marca tiene sus colores reales aplicados (no gris uniforme).
- [ ] Cada pantalla P1 tiene sus variantes de estado.
- [ ] El HTML funciona sin conexión.
- [ ] Navegación entre pantallas funciona.
- [ ] Toggle de anotaciones funciona.
- [ ] Botón "Copiar prompt DS3" presente en cada pantalla.
- [ ] Flowchart presente con todos los nodos del inventario DS1.
- [ ] Cada nodo del flowchart muestra mini-wireframe (no solo texto).
- [ ] Click en nodo del flowchart navega al wireframe correcto.
- [ ] Nodos coloreados por fricción (🟢/🟡/🔴).
- [ ] Botón "Exportar a Miro" visible en toolbar del flowchart (siempre, independiente de conexión).
- [ ] Si Miro no está conectado: botón muestra instrucciones en lugar de ejecutar silenciosamente.

### 8. Guardar outputs

**a) Escribe `wireframe-[proyecto]-[marca]-v1.html`** — archivo completo con wireframes + flowchart.

**b) Actualiza `design_state.json`**:
- `estado.ds2` → `"completo"`
- `packets.ds2` → context packet JSON (ver schema en `references/ds2-full.md`)
- `outputs.ds2` → `"wireframe-[proyecto]-[marca]-v1.html"`

### 9. Export a Miro

**El botón "🗂 Exportar a Miro" siempre aparece en la toolbar del tab Flowchart.** El estado de conexión determina el comportamiento, no la visibilidad del botón.

**Lógica del botón:**

```
Al hacer click en "Exportar a Miro":
  SI Miro MCP está conectado:
    → ejecutar export (pasos 1-3 abajo)
    → mostrar "✅ Exportado a Miro — [enlace al board]"
  SI Miro NO está conectado:
    → mostrar panel de instrucciones inline:
      "Para exportar a Miro necesitás conectar el plugin:
       1. Abre Claude → Configuración → Plugins
       2. Instala el plugin de Miro
       3. Volvé a esta pestaña y hacé click en Exportar"
    → NO silencio, NO exportar sin feedback
```

**Contenido del export (cuando Miro está disponible):**

1. **Flowchart del flujo** vía `diagram_create` (tipo `flowchart`) — nodos con colores de fricción, flechas con etiquetas de acción, mismo layout que el SVG del HTML
2. **Frame por pantalla P1** vía `doc_create` — nombre de la pantalla como título, descripción con componentes principales y fricción
3. **Sticky notes de anotaciones** — un sticky por componente nuevo (`[COMPONENTE NUEVO]`) con el nombre y contexto

**Badge de estado en el botón:**
- Miro conectado: `🗂 Exportar a Miro` (botón habilitado, color primario)
- Miro no conectado: `🗂 Exportar a Miro ·  Conectar plugin` (botón con badge gris)

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
