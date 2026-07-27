# Prisma Designer — JSON Spec (DS3 → Figma)
**Para el equipo de desarrollo del plugin Figma**

---

## Problema actual

Prisma Designer (code.js actual) crea frames con auto-layout vertical y apila componentes, pero:

- No aplica padding al frame
- No define gap entre componentes (`itemSpacing = 0`)
- No ajusta el sizing de los componentes (`layoutSizingHorizontal` nunca se setea)
- No togglea boolean props de las instancias
- Solo inyecta texto en el primer text node (no por nombre de capa)
- `clipsContent = false` permite overflow

El resultado: los componentes llegan pero el layout no se ve como una pantalla real.

---

## Schema DS3 JSON v2.0 — campos nuevos

### Nivel pantalla (cada objeto en `pantallas[]`)

```jsonc
{
  "id": "P01",
  "nombre": "Home",
  "descripcion": "Pantalla principal del feed",
  "layout": {
    "direction": "vertical",        // "vertical" | "horizontal"
    "gap": 0,                        // itemSpacing en px (gap default entre componentes)
    "padding": {                     // padding del frame
      "top": 0,
      "right": 0,
      "bottom": 0,
      "left": 0
    },
    "clipContent": true,             // clipsContent
    "primaryAxisSizing": "auto",     // "auto" (hug) | "fixed"
    "counterAxisSizing": "fixed",    // "auto" | "fixed"
    "width": 390,                    // ancho del frame (default 390)
    "height": 844,                   // alto del frame (solo si primaryAxisSizing=fixed)
    "backgroundColor": "#FFFFFF"     // hex del fondo
  },
  "componentes": [...]
}
```

### Nivel componente (cada objeto en `componentes[]`)

```jsonc
{
  "orden": 1,
  "componente": "Nav Bar > Header · Color=White · Type=Home · State=Default",
  "rol": "Header principal",
  "contenido": "Hello [NAME]!",
  
  // ── CAMPOS NUEVOS v2.0 ──────────────────────────────

  "sizing": {
    "horizontal": "fill",            // "fill" | "hug" | "fixed"
    "vertical": "hug",               // "fill" | "hug" | "fixed"
    "width": null,                    // px — solo si horizontal="fixed"
    "height": null                    // px — solo si vertical="fixed"
  },
  
  "spacing": {
    "before": 0,                     // margen superior adicional (spacer frame antes)
    "after": 0                       // margen inferior adicional (spacer frame después)
  },

  "booleanProps": {                  // togglear propiedades booleanas del componente
    "CTA": true,
    "Skeleton": false,
    "Badge": true
  },

  "textOverrides": {                 // inyectar texto por nombre de capa (path)
    "Title": "Eventos de hoy",
    "Subtitle": "7 Jul · Tu tienda",
    "CTA/Label": "Ver más"
  },

  "nestedSwaps": {                   // swap de instancias nested por nombre de capa
    "Icon": "Icons > calendar · Size=Md"
  }
}
```

### Nivel composición (cuando `tipo: "composicion"`)

```jsonc
{
  "orden": 5,
  "tipo": "composicion",
  "nombre_intencional": "EventCard",
  "rol": "Tarjeta de evento en feed",
  
  "layout": {                        // auto-layout del sub-frame
    "direction": "vertical",
    "gap": 8,
    "padding": { "top": 0, "right": 0, "bottom": 12, "left": 0 }
  },
  "sizing": {
    "horizontal": "fill",
    "vertical": "hug"
  },

  "composicion": [
    {
      "componente": "Banners Cards > _Banners terciarios (Carruseles) · Size=Md · Skeleton=False",
      "rol": "imagen-evento",
      "sizing": { "horizontal": "fill", "vertical": "fixed", "height": 180 },
      "booleanProps": {},
      "textOverrides": {}
    }
  ]
}
```

---

## Cambios requeridos en code.js

### 1. Aplicar layout del frame

En `buildScreens()`, después de crear el frame, aplicar los campos de layout:

```javascript
// ANTES (v5):
frame.resize(FRAME_WIDTH, FRAME_HEIGHT);
frame.layoutMode = 'VERTICAL';
frame.primaryAxisSizingMode = 'AUTO';
frame.counterAxisSizingMode = 'FIXED';

// DESPUÉS (v2.0):
const layout = pantalla.layout || {};
const dir = (layout.direction || 'vertical').toUpperCase();
const pad = layout.padding || {};

frame.resize(layout.width || FRAME_WIDTH, layout.height || FRAME_HEIGHT);
frame.layoutMode = dir === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL';
frame.primaryAxisSizingMode = (layout.primaryAxisSizing === 'fixed') ? 'FIXED' : 'AUTO';
frame.counterAxisSizingMode = (layout.counterAxisSizing === 'auto') ? 'AUTO' : 'FIXED';
frame.itemSpacing = layout.gap ?? 0;
frame.paddingTop = pad.top ?? 0;
frame.paddingRight = pad.right ?? 0;
frame.paddingBottom = pad.bottom ?? 0;
frame.paddingLeft = pad.left ?? 0;
frame.clipsContent = layout.clipContent !== false;  // default true

if (layout.backgroundColor) {
  const rgb = hexToRgb(layout.backgroundColor);
  if (rgb) frame.fills = [{ type: 'SOLID', color: rgb }];
}
```

### 2. Aplicar sizing por componente

Después de `frame.appendChild(instance)`:

```javascript
// Aplicar sizing
const sizing = comp.sizing || {};

if (sizing.horizontal === 'fill') {
  instance.layoutSizingHorizontal = 'FILL';
} else if (sizing.horizontal === 'hug') {
  instance.layoutSizingHorizontal = 'HUG';
} else if (sizing.horizontal === 'fixed' && sizing.width) {
  instance.layoutSizingHorizontal = 'FIXED';
  instance.resize(sizing.width, instance.height);
}

if (sizing.vertical === 'fill') {
  instance.layoutSizingVertical = 'FILL';
} else if (sizing.vertical === 'hug') {
  instance.layoutSizingVertical = 'HUG';
} else if (sizing.vertical === 'fixed' && sizing.height) {
  instance.layoutSizingVertical = 'FIXED';
  instance.resize(instance.width, sizing.height);
}
```

### 3. Aplicar spacing (before/after)

Para crear márgenes entre componentes específicos, insertar spacer frames:

```javascript
const spacing = comp.spacing || {};

// Spacer ANTES del componente
if (spacing.before > 0) {
  const spacer = figma.createFrame();
  spacer.name = `spacer-${spacing.before}px`;
  spacer.resize(1, spacing.before);
  spacer.fills = [];
  spacer.layoutSizingHorizontal = 'FILL';
  spacer.layoutSizingVertical = 'FIXED';
  frame.insertChild(frame.children.length, spacer);
}

frame.appendChild(instance);

// Spacer DESPUÉS del componente
if (spacing.after > 0) {
  const spacer = figma.createFrame();
  spacer.name = `spacer-${spacing.after}px`;
  spacer.resize(1, spacing.after);
  spacer.fills = [];
  spacer.layoutSizingHorizontal = 'FILL';
  spacer.layoutSizingVertical = 'FIXED';
  frame.appendChild(spacer);
}
```

### 4. Aplicar boolean props

Después de crear la instancia, togglear las propiedades booleanas:

```javascript
if (comp.booleanProps && typeof comp.booleanProps === 'object') {
  for (const [propName, value] of Object.entries(comp.booleanProps)) {
    try {
      // Buscar la propiedad en el component set
      // Las boolean props en Figma se setean con setProperties()
      const props = instance.componentProperties;
      for (const [key, prop] of Object.entries(props)) {
        // El key puede ser "CTA#1234" — comparar sin el hash
        const cleanKey = key.split('#')[0];
        if (cleanKey.toLowerCase() === propName.toLowerCase() && prop.type === 'BOOLEAN') {
          instance.setProperties({ [key]: value });
          break;
        }
      }
    } catch (_) {}
  }
}
```

### 5. Mejorar text overrides (por nombre de capa)

Reemplazar la función `injectText` actual con una versión que soporte paths:

```javascript
async function injectTextOverrides(instance, textOverrides) {
  if (!textOverrides || typeof textOverrides !== 'object') return;
  
  for (const [layerPath, text] of Object.entries(textOverrides)) {
    if (!text) continue;
    
    // Buscar el text node por path (ej: "Title", "CTA/Label", "Subtitle")
    const parts = layerPath.split('/');
    let target = instance;
    
    for (const part of parts) {
      const found = target.findOne(n => {
        const nameNorm = n.name.toLowerCase().replace(/[_\-\s]/g, '');
        const partNorm = part.toLowerCase().replace(/[_\-\s]/g, '');
        return nameNorm === partNorm || nameNorm.includes(partNorm);
      });
      if (found) target = found;
      else break;
    }
    
    if (target && target.type === 'TEXT') {
      try {
        await figma.loadFontAsync(target.fontName);
        target.characters = text.substring(0, 500);
      } catch (_) {}
    }
  }
}

// En el loop de componentes, reemplazar:
// if (comp.contenido) { injectText(instance, comp.contenido); }
// por:
if (comp.textOverrides && Object.keys(comp.textOverrides).length > 0) {
  await injectTextOverrides(instance, comp.textOverrides);
} else if (comp.contenido) {
  await injectText(instance, comp.contenido);  // fallback legacy
}
```

### 6. Aplicar layout a composiciones

Actualizar el bloque de `tipo === 'composicion'` para usar los campos de layout:

```javascript
if (comp.tipo === 'composicion' && Array.isArray(comp.composicion)) {
  const compLayout = comp.layout || {};
  const compPad = compLayout.padding || {};
  const compSizing = comp.sizing || {};

  const subFrame = figma.createFrame();
  subFrame.name = `[⚠️ NUEVO] ${comp.nombre_intencional || 'Componente nuevo'}`;
  
  const dir = (compLayout.direction || 'vertical').toUpperCase();
  subFrame.layoutMode = dir === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL';
  subFrame.primaryAxisSizingMode = 'AUTO';
  subFrame.counterAxisSizingMode = 'FIXED';
  subFrame.resize(FRAME_WIDTH, 100);
  subFrame.itemSpacing = compLayout.gap ?? 0;
  subFrame.paddingLeft = compPad.left ?? 0;
  subFrame.paddingRight = compPad.right ?? 0;
  subFrame.paddingTop = compPad.top ?? 0;
  subFrame.paddingBottom = compPad.bottom ?? 0;

  // ... (banner label y sub-componentes igual que antes,
  //      pero aplicar sizing/booleanProps/textOverrides a cada sub-componente)
  
  frame.appendChild(subFrame);
  
  // Aplicar sizing del subFrame
  if (compSizing.horizontal === 'fill') subFrame.layoutSizingHorizontal = 'FILL';
  if (compSizing.vertical === 'hug') subFrame.layoutSizingVertical = 'HUG';
}
```

### 7. Helper hexToRgb

```javascript
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}
```

---

## Backward compatibility

Todos los campos nuevos son opcionales. Si el JSON no los tiene, el comportamiento es idéntico al v5 actual:

- `layout` ausente → vertical, gap 0, padding 0, clip false
- `sizing` ausente → sizing default del componente
- `booleanProps` ausente → no se togglea nada
- `textOverrides` ausente → usa `contenido` (legacy)
- `spacing` ausente → sin spacers

Los JSONs generados por DS3 v1.6 siguen funcionando sin cambios.

---

## Ejemplo: Home TFM con schema v2.0

```json
{
  "version": "2.0",
  "proyecto": "TFM Events",
  "marca": "The Fresh Market",
  "plataforma": "iOS",
  "flujo": "Events Discovery",
  "direccion": "B",
  "pantallas": [
    {
      "id": "P01",
      "nombre": "Home",
      "descripcion": "Pantalla principal con módulos de contenido",
      "layout": {
        "direction": "vertical",
        "gap": 0,
        "padding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
        "clipContent": true,
        "primaryAxisSizing": "auto",
        "counterAxisSizing": "fixed",
        "width": 390,
        "backgroundColor": "#FFFFFF"
      },
      "componentes": [
        {
          "orden": 1,
          "componente": "Nav Bar > Header · Color=White · Type=Home · State=Default",
          "rol": "Header principal con saludo y carrito",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "textOverrides": {
            "Title": "Hello [NAME]!",
            "Subtitle": "[Custom message from CMS]"
          }
        },
        {
          "orden": 2,
          "componente": "Banners Cards > Banner_principal · Size=Lg · Skeleton=False",
          "rol": "Banner promocional hero",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "textOverrides": {
            "Title": "ENJOY $10 OFF",
            "Subtitle": "YOUR NEXT ONLINE ORDER OF $60 OR MORE"
          }
        },
        {
          "orden": 3,
          "componente": "Categorys > Category-carousel · State=Default",
          "rol": "Carrusel de categorías de recetas/colecciones",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "spacing": { "before": 16, "after": 0 }
        },
        {
          "orden": 4,
          "componente": "Carrusels > Hero_banner · State=Default",
          "rol": "Hero banner de campaña estacional",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "spacing": { "before": 16, "after": 0 },
          "textOverrides": {
            "Title": "FALL INTO FLAVOR",
            "Subtitle": "Explore our September magazine"
          }
        },
        {
          "orden": 5,
          "componente": "Title_section > Title_section · Skeleton=No · CTA=Yes",
          "rol": "Encabezado de sección Rewards",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "spacing": { "before": 24, "after": 0 },
          "booleanProps": { "CTA": true },
          "textOverrides": {
            "Title": "Enjoy Your Rewards!",
            "CTA": "Go to wallet"
          }
        },
        {
          "orden": 6,
          "componente": "Promo Card > Promo_card · State=Default · Type=Button",
          "rol": "Card de cupón/reward claimable",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "spacing": { "before": 8, "after": 0 },
          "textOverrides": {
            "Title": "Club Hub",
            "Subtitle": "$5.00 OFF\nOn your next Fresh Squeezed Juice Purchase",
            "Button": "Claim"
          }
        },
        {
          "orden": 7,
          "componente": "Title_section > Title_section · Skeleton=No · CTA=No",
          "rol": "Encabezado de sección Inspiration",
          "sizing": { "horizontal": "fill", "vertical": "hug" },
          "spacing": { "before": 24, "after": 8 },
          "textOverrides": {
            "Title": "Fresh Inspiration & Recipes"
          }
        },
        {
          "orden": 8,
          "componente": "Banners Cards > _Banners terciarios (Carruseles) · Size=Md · Skeleton=False",
          "rol": "Carrusel de contenido editorial",
          "sizing": { "horizontal": "fill", "vertical": "hug" }
        },
        {
          "orden": 9,
          "componente": "Nav Bar > NavBar · Color=Color · Type=Home · State=Default",
          "rol": "Navegación inferior",
          "sizing": { "horizontal": "fill", "vertical": "hug" }
        }
      ]
    }
  ]
}
```

---

## Resumen de cambios

| Área | v5 (actual) | v2.0 (propuesta) |
|------|-------------|-------------------|
| Frame padding | Siempre 0 | Configurable por pantalla |
| Gap entre componentes | Siempre 0 | `layout.gap` + `spacing.before/after` |
| Sizing de componentes | Default del componente | `fill` / `hug` / `fixed` configurable |
| Boolean props | No soportado | `booleanProps: { CTA: true }` |
| Text overrides | Solo primer text node | Por nombre de capa con path |
| Clip content | Siempre false | Default true, configurable |
| Composiciones layout | Siempre vertical, gap 0 | Layout configurable por composición |
| Backward compat | — | 100% — todos los campos nuevos son opcionales |
