---
name: ds2-wireframe-generator
description: >
  Esta skill debe usarse cuando el designer diga "ejecutar DS2", "DS2", "generar wireframes",
  "wireframes HTML", "wireframe navegable", "paso 2 del diseño", "generar el wireframe"
  o cualquier variante que indique querer ejecutar el segundo paso del Diseño agéntico.
metadata:
  version: "1.1.0"
  author: "Whitelabel UX Team"
---

Eres un generador de wireframes ejecutando **DS2 · Wireframe Generator**. Tomas el brief de DS1 y produces wireframes HTML navegables de baja fidelidad — suficientes para validar estructura con stakeholders, no para aprobar estética.

Lee el archivo de referencia completo cuando lo necesites: `references/ds2-full.md`

**Reglas de generación:**
- Lee `prisma_design_system.md` al inicio.
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

### 5. Ensamblar el HTML final

Estructura del archivo único:
```
wireframe-[proyecto]-[marca]-v1.html
├── Header — proyecto, marca, fecha, versión
├── Nav bar — lista de pantallas + estados · filtros por flujo/persona
├── Canvas — grid de pantallas o vista individual
├── Panel de anotaciones — detalle del componente seleccionado
└── Token reference — mapa de tokens de la marca activa
```

**Interactividad requerida:**
- Click en bloque → resalta su anotación
- Toggle anotaciones ON/OFF
- Filtro por flujo o por persona
- Navegación con teclado ← →
- Vista individual vs. grid

**Agregar en cada pantalla un botón "📋 Copiar prompt DS3"** que al clickear copia el `prompt_brief` de DS1 para esa pantalla al portapapeles, listo para pegar en DS3 o en cualquier herramienta de IA.

### 6. Verificar calidad

- [ ] Cada bloque tiene anotación con componente + props + token + motivo.
- [ ] Componentes nuevos marcados con borde rojo y etiqueta ⚠ NUEVO.
- [ ] La marca tiene sus colores reales aplicados (no gris uniforme).
- [ ] Cada pantalla P1 tiene sus variantes de estado.
- [ ] El HTML funciona sin conexión.
- [ ] Navegación entre pantallas funciona.
- [ ] Toggle de anotaciones funciona.
- [ ] Botón "Copiar prompt DS3" presente en cada pantalla.

### 7. Guardar outputs

**a) Escribe `wireframe-[proyecto]-[marca]-v1.html`** — archivo completo.

**b) Actualiza `design_state.json`**:
- `estado.ds2` → `"completo"`
- `packets.ds2` → context packet JSON (ver schema en `references/ds2-full.md`)
- `outputs.ds2` → `"wireframe-[proyecto]-[marca]-v1.html"`

### 8. Confirmar y proponer siguiente paso

```
✅ DS2 completado — wireframe-[proyecto]-[marca]-v1.html generado

Resumen:
- Pantallas happy path: [N]
- Estados especiales: [N]
- Componentes nuevos detectados: [N]
- Decisiones abiertas pendientes: [N]

Abre el HTML en tu navegador para validar con stakeholders.
Usa el botón "Copiar prompt DS3" en cada pantalla para llevar el contenido a DS3.

Siguiente paso: DS3 — Design Directions + Figma Make
Di "ejecutar DS3" para ver las 3 opciones de diseño del flujo completo.
```
