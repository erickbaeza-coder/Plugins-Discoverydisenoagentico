# Prisma Design System — Referencia para agentes DS1+
**v2.0 · 2026-06-25 — Tokens reales de Tokens Studio + jerarquía de componentes Figma validada**

> Este archivo es el input de sistema de diseño para DS1 y stages siguientes. El agente lo lee al inicio de cada ejecución. No requiere que el designer lo adjunte manualmente.
> Para actualizar: reemplaza los valores con los del export más reciente de Tokens Studio.

---

## 1. Colores primitivos (Paleta Prisma)

### Purple — Color primario de marca
| Token | Valor hex |
|-------|-----------|
| `Prisma.Purple.50` | `#faf4fb` |
| `Prisma.Purple.100` | `#e1bee7` |
| `Prisma.Purple.200` | `#ce93d8` |
| `Prisma.Purple.300` | `#ba68c8` |
| `Prisma.Purple.400` | `#ab47bc` |
| `Prisma.Purple.500` | `#9c27b0` |
| `Prisma.Purple.600` | `#7b1fa2` |
| `Prisma.Purple.700` | `#6a1b9a` |
| `Prisma.Purple.800` | `#4a148c` |
| `Prisma.Purple.900` | `#250a46` |

### Teal — Color secundario
| Token | Valor hex |
|-------|-----------|
| `Prisma.Teal.50` | `#edfafa` |
| `Prisma.Teal.100` | `#d5f5f6` |
| `Prisma.Teal.200` | `#afecef` |
| `Prisma.Teal.300` | `#7edce2` |
| `Prisma.Teal.400` | `#16bdca` |
| `Prisma.Teal.500` | `#0694a2` |
| `Prisma.Teal.600` | `#047481` |
| `Prisma.Teal.700` | `#036672` |
| `Prisma.Teal.800` | `#014451` |
| `Prisma.Teal.900` | `#012c28` |

### Grey — Neutros
| Token | Valor hex |
|-------|-----------|
| `Prisma.Grey.50` | `#f6f7f8` |
| `Prisma.Grey.100` | `#eff1f4` |
| `Prisma.Grey.200` | `#d7dae0` |
| `Prisma.Grey.300` | `#bcc2cc` |
| `Prisma.Grey.400` | `#97a0b0` |
| `Prisma.Grey.500` | `#7c879b` |
| `Prisma.Grey.600` | `#616c7f` |
| `Prisma.Grey.700` | `#49515f` |
| `Prisma.Grey.800` | `#333a46` |
| `Prisma.Grey.900` | `#1e232b` |

---

## 2. Tokens semánticos de color

### Texto
| Token | Referencia | Uso |
|-------|-----------|-----|
| `Text.Primary.primary-default` | `Prisma.Purple.700` | Texto primario de marca |
| `Text.Primary.primary-subtle` | `Prisma.Purple.50` | Texto primario muy sutil |
| `Text.Primary.primary-alternative` | `Prisma.Purple.500` | Texto primario alternativo |
| `Text.Secondary.secondary-default` | `Prisma.Teal.700` | Texto secundario |
| `Text.Secondary.secondary-subtle` | `Prisma.Teal.50` | Texto secundario sutil |
| `Text.Neutrals.neutral-display` | `Prisma.Grey.900` | Texto display / hero |
| `Text.Neutrals.neutral-headline` | `Prisma.Grey.900` | Encabezados |
| `Text.Neutrals.neutral-title` | `Prisma.Grey.900` | Títulos de sección |
| `Text.Neutrals.neutral-body` | `Prisma.Grey.800` | Cuerpo de texto |
| `Text.Neutrals.neutral-label` | `Prisma.Grey.600` | Labels de formulario |
| `Text.Neutrals.neutral-caption` | `Prisma.Grey.400` | Captions y metadata |
| `Text.Neutrals.neutral-disabled` | `Prisma.Grey.400` | Texto deshabilitado |
| `Text.Warning.warning-default` | `Prisma.Yellow.700` | Mensajes de advertencia |
| `Text.Info.info-default` | `Prisma.Blue.700` | Mensajes informativos |
| `Text.Success.success-default` | *(Prisma.Green)* | Mensajes de éxito |
| `Text.Error.error-default` | *(Prisma.Red)* | Mensajes de error |

---

## 3. Tipografía

### Familias
| Rol | Fuente | Fuente Flutter |
|-----|--------|----------------|
| Todos los textos | **Plus Jakarta Sans** | `PlusJakartaSans` |

> Fuente única para heading y body. En Flutter, importar desde Google Fonts o assets locales.

### Escala tipográfica (de `TextStyles/Prisma.json`)
| Nivel | Token | Size | Weight | Line Height | Uso |
|-------|-------|------|--------|-------------|-----|
| Display Large | `Display.lg.semibold` | 57px | 600 | 64px | Hero / pantalla de inicio |
| Display Medium | `Display.md.semibold` | 45px | 600 | 52px | Títulos destacados |
| Display Small | `Display.sm.semibold` | 36px | 600 | 44px | Encabezado de sección |
| Headline Large | `Headline.lg.semibold` | 32px | 600 | 40px | Título principal de pantalla |
| Headline Medium | `Headline.md.semibold` | 28px | 600 | 36px | Subtítulo de sección |
| Headline Small | `Headline.sm.semibold` | 24px | 600 | 32px | Título de card / módulo |
| Title Large | `Title.lg.regular` | 22px | 400 | 28px | Títulos de lista |
| Title Medium | `Title.md.medium` | 16px | 500 | 24px | Labels de formulario |
| Title Small | `Title.sm.medium` | 14px | 500 | 20px | Labels secundarios |
| Body Large | `Body.lg.regular` | 16px | 400 | 24px | Texto cuerpo principal |
| Body Medium | `Body.md.regular` | 14px | 400 | 20px | Texto secundario |
| Body Small | `Body.sm.regular` | 12px | 400 | 16px | Captions, metadata |
| Label Large | `Label.lg.medium` | 14px | 500 | 20px | Botones, chips |
| Label Medium | `Label.md.medium` | 12px | 500 | 16px | Tags, badges |
| Label Small | `Label.sm.medium` | 11px | 500 | 16px | Badges pequeños |

---

## 4. Espaciado

Valores reales de `Spacing/Mode 1.json`.

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `spacing.spacing-none` | 0px | Sin espaciado |
| `spacing.spacing-xs` | 2px | Micro-gaps entre íconos e inline labels |
| `spacing.spacing-s` | 4px | Gap mínimo entre elementos inline |
| `spacing.spacing-m` | 6px | Espaciado interno de chips pequeños |
| `spacing.spacing-l` | 8px | Padding interno de badges, chips, tags |
| `spacing.spacing-xl` | 12px | Gap entre label e input |
| `spacing.spacing-2xl` | 16px | Padding horizontal de cards y listas |
| `spacing.spacing-3xl` | 20px | Padding interno de cards medianas |
| `spacing.spacing-4xl` | 24px | Padding de secciones y modales |
| `spacing.spacing-5xl` | 32px | Separación entre secciones de pantalla |
| `spacing.spacing-6xl` | 40px | Separación entre bloques mayores |
| `spacing.spacing-7xl` | 48px | Márgenes de pantalla en tablet |
| `spacing.spacing-8xl` | 56px | Espaciado de layout grande |
| `spacing.spacing-9xl` | 64px | Hero sections, separación de módulos |

> **Uso frecuente en DS2:** padding de cards = `spacing-4xl (24px)`, gap entre items = `spacing-2xl (16px)`, padding horizontal de pantalla = `spacing-4xl (24px)`.

---

## 5. Border Radius

Valores reales de `Border radius/Mode 1.json`.

| Token | Valor | Uso |
|-------|-------|-----|
| `Border.radius-none` | 0px | Contenedores estructurales, layout |
| `Border.radius-xs` | 2px | Sutiles redondeos en elementos muy pequeños |
| `Border.radius-s` | 4px | Inputs, botones, chips, tags |
| `Border.radius-m` | 8px | Cards medianas, tarjetas de producto |
| `Border.radius-l` | 12px | Modales, cards destacadas |
| `Border.radius-xl` | 16px | Contenedores de imagen, banners |
| `Border.radius-2xl` | 20px | Elementos con diseño suave y moderno |
| `Border.radius-3xl` | 24px | Bottom sheets, contenedores grandes |
| `Border.radius-full` | 999px | Avatares, botones circulares, pills |

---

## 6. Opacidades

| Token | Valor | Uso |
|-------|-------|-----|
| `opacity.low` | 10% | Overlays sutiles, fondos de hover |
| `opacity.md` | 50% | Elementos deshabilitados |
| `opacity.high` | 90% | Overlays de modal / backdrop |

---

## 7. Strokes

Valores reales de `Strokes/Mode 1.json`.

| Token | Valor | Uso |
|-------|-------|-----|
| `Stroke.Stroke-1` | 1px | Bordes sutiles, divisores, separadores livianos |
| `Stroke.Stroke-2` | 2px | Contornos de botones, tarjetas y componentes destacados |
| `Stroke.Stroke-3` | 3px | Bordes prominentes en modales y alertas |
| `Stroke.stroke-dash-1` | 1px (dash) | Indicadores de sección, detalles gráficos sutiles |
| `Stroke.stroke-dash-2` | 2px (dash) | Separadores medianamente visibles |
| `Stroke.stroke-dash-3` | 3px (dash) | Elementos interactivos con alto contraste |

---

## 8. Temas (Light / Dark)

Prisma soporta dos modos. Por defecto DS1 trabaja en **Light mode**.

- **Light:** referencia `Primitives/Light.json` — colores base sobre fondo blanco/gris claro.
- **Dark:** referencia `Primitives/Dark Mode.json` — colores base sobre fondo oscuro.

Los tokens semánticos (`Text.*`, `Background.*`, `Border.*`) resuelven automáticamente al color correcto según el tema activo.

---

## 9. Style tokens por marca (multi-brand)

Prisma tiene tokens específicos por marca dentro de `Style Tokens/`:

| Marca | Archivo |
|-------|---------|
| Prisma (default) | `Style Tokens/Prisma.json` |
| Disco | `Style Tokens/Disco.json` |
| Jumbo | `Style Tokens/Jumbo.json` |
| Metro | `Style Tokens/Metro.json` |
| Prezunic | `Style Tokens/Prezunic.json` |
| The Fresh Market | `Style Tokens/The Fresh Market.json` |

**Al ejecutar DS1:** especificar qué marca está en scope. El agente usará los tokens de esa marca para el brief de wireframe.

---

## 10. Jerarquía de componentes en Figma (Prisma-Components)

> **v3.0 · 2026-06-25 — Validado desde el mapa real de Prisma Builder (6222 componentes)**
> **Nombre exacto de la librería en Figma:** `Prisma-Components`
> IMPORTANTE: Los grupos NO son Atoms/Molecules/Organisms. Son los nombres reales de Figma listados abajo.

### Regla de naming para DS1 y DS3
```
[Grupo Figma] > [Nombre componente] · [Prop=Valor] · [Prop=Valor]

Ejemplos reales:
Buttons > Button-Primary · Size=Lg · State=Default
Nav Bar > Header · Color=White · Type=Home · State=Default
Nav Bar > NavBar · Color=Color · Type=Home · State=Default
Product Card > Product_card · Size=Md · State=Default
Top bar > TopBar · State=Default · Type=Icon action_no title
Title_section > Title_section · Skeleton=No · CTA=Yes
Banners Cards > Banner_principal · Size=Lg · Skeleton=False
Totalizer > Totalizer · State=Default
```

---

### Navegación superior (Top)

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Nav Bar` | `Header` | `Color=White/Color` · `Type=Home/Brand/Brand v2` · `State=Default/Volver` | Header principal de la app (logo + búsqueda + carrito) |
| `Nav Bar` | `Search_bar` | `State=Default/Active` | Barra de búsqueda expandida |
| `Nav Bar` | `Search_header` | `State=Default` | Header en modo búsqueda |
| `Nav Bar` | `Search_flow` | `State=Default` | Flujo completo de búsqueda |
| `Top bar` | `TopBar` | `State=Default/Whit elevation` · `Type=Icon action_no title` | Barra de retroceso con íconos (PLP, PDP, checkout) |
| `Top bar` | `TopBar_title` | `Type=Default/Whit elevation` | Barra de retroceso con título de pantalla |

### Navegación inferior (Bottom)

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Nav Bar` | `NavBar` | `Color=White/Color` · `Type=Home/Brand` · `State=Default` | Barra de navegación inferior (tabs) |

### Headers de marca

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Header` | `_Header_State` | `State=Default` | Header genérico base |
| `Header Ofertas` | `Header_oferta` | `State=Default/With elevation` | Header sección de ofertas |
| `Header promo` | `Promo_header` | `Size=Sm/Md/Lg` · `Variant=Surface/White/Skeleton` | Header con banner promocional integrado |
| `Header puntos` | `Header_punto` | `State=Default` | Header con balance de puntos/cashback |

### Botones y acciones

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Buttons` | `Button-Primary` | `Size=Xs/Sm/Md/Lg` · `State=Default/Disabled/Loading/Skeleton` | CTA principal: compra, confirmación |
| `Buttons` | `Button-Secondary` | `Size=Xs/Sm/Md/Lg` · `State=Default/Disabled` | Acción secundaria |
| `Buttons` | `Button-Tertiary` | `Size=Xs/Sm/Md/Lg` · `State=Default/Disabled` | Acción terciaria o link |
| `Buttons` | `Button-icon-tonal` | `Size=Sm/Md` · `State=Default/Disabled` | Botón solo con ícono |
| `Quantity selector` | `Quantity Selector` | `Size=Sm/Md/Lg` · `State=Default/Disabled` | Selector +/- de cantidad de producto |
| `Sticky Button` | `Sticky-button` | `Type=Horizontal/Vertical` | Botón fijo al pie de pantalla |
| `Floating buttom` | `Fab_crear_lista` | `State=Default` | FAB para crear lista de compras |
| `FavoriteButton` | `Favorite-button` | `State=Default/Active` | Favorito en product card |

### Banners y carruseles

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Banners Cards` | `Banner_principal` | `Size=Sm/Md/Lg` · `Skeleton=False/True` | Banner hero principal (full width) |
| `Banners Cards` | `Banners_secundarios_(promocionales)` | `Size=Sm/Md/Lg` · `Skeleton=False/True` | Banner secundario promocional |
| `Banners Cards` | `_Banners terciarios (Carruseles)` | `Size=Xs/Sm/Md/Lg` · `Skeleton=False/True` | Carrusel de banners pequeños |
| `Carrusels` | `Hero_banner` | `State=Default` | Banner hero de pantalla completa |
| `Carrusels` | `Carrusel_promocionale` | `State=Default` | Carrusel de promociones |
| `CategoryBanner` | `CategoryBanner` | `State=Default` | Banner de categoría (Full/Half) |
| `Banner Overlay` | `Banner_overlay` | `State=Default` | Overlay sobre banner con contenido |
| `Dynamic_section` | `Dynamic_section` | `State=Default/Skeleton` | Sección de contenido dinámico desde CMS |
| `Módulos` | `Modulo` | `State=Default` | Módulo de contenido configurable |

### Product Cards

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Product Card` | `Product_card` | `Size=Sm/Md/Lg` · `State=Default/Skeleton` | Product card PLP, carrusel (mercados hispanos) |
| `Product Card` | `Product card_list` | `State=Default/Skeleton` | Product card en vista lista |
| `Product Card` | `Product card_cart` | `State=Default/Skeleton` | Product card en carrito |
| `Product Card` | `Offer_card` | `State=Default/Skeleton` | Card de oferta especial |
| `Product Card Brasil` | `Product_card_prezunic` | `State=Default` | Product card Prezunic (Brasil) |
| `Product Card Brasil` | `Product_card_cart-bra` | `State=Default` | Product card carrito Brasil |
| `ProductCard_Details` | `ProductCard_Detail` | `Size=Md/Lg` · `State=Default/No image/Skeleton` | Detalle de producto en carrito/pedido |
| `OffersCard-PDP` | `Product card_pdp` | `State=Default` | Card de oferta dentro de PDP |

### Títulos y secciones

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Title_section` | `Title_section` | `Skeleton=No/Yes` · `CTA=Yes/No` | Encabezado de sección con CTA opcional |
| `Info Copy` | `Info_copy` | `State=Default/Disabled` | Línea de información con ícono |

### Categorías

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Categorys` | `Category-carousel` | `State=Default/Skeleton` | Carrusel horizontal de categorías |
| `Categorys` | `Category_item` | `State=Default/Active/Skeleton` | Ítem individual de categoría |

### Inputs y formularios

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Inputs` | `Input` | `State=Default/Focus/Error/Complete/Disabled/Skeleton` | Campo de texto (text field, email, etc.) |
| `Inputs` | `Input_password` | `State=Default/Focus/Error` | Campo de contraseña |
| `Dropdown` | `Dropdown` | `State=Default/Open/Disabled` | Selector de opción única |
| `Select list` | `Select_list` | `Type=Check/Checkbox/RadioButton/Toggle/Dirección` | Lista de selección |
| `CheckBox` | `Checkbox group` | `State=Default/Disabled` | Grupo de checkboxes |
| `RadioButton` | `RadioButton` | `State=Default/Disabled/Selected` | Radio button individual |
| `Toggle` | `Toggle` | `State=On/Off/Disabled` | Switch on/off |
| `Text área` | `Text area` | `State=Default/Focus/Error/Complete` | Campo de texto multilínea |

### Feedback y notificaciones

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Alerts` | `Alert` | `Type=Error/Info/Success/Warning` · `Border=True/False` | Mensaje de sistema inline |
| `Snackbar` | `Snackbar` | `Type=Error/Info/Success/Warning` · `State=Default` | Notificación temporal flotante |
| `Dialog` | `Dialog` | `State=Default` | Modal de confirmación o error |
| `Popup` | `Popup` | `State=Default` | Modal con imagen y contenido |
| `Empty States` | `Empty state` | `Type=Empty/Error/Success/Message` | Pantalla vacía o estado de error |
| `NotificationCard` | `Notification` | `Type=Icono/Image/Message` · `State=Leido/Nuevo` | Card de notificación |

### Totales y resumen

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Totalizer` | `Totalizer` | `State=Default/Open/Skeleton` | Resumen de totales del carrito |
| `Totalizer` | `Totalizer_PDP` | `State=Default` | Resumen en pantalla de detalle de producto |
| `Totalizer` | `Totalizer_arg` | `State=Default` | Totalizer específico Argentina |

### Navegación y ubicación

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Location` | `location` | `Type=Ofertas/Recibe/Retira/Brand` | Selector de dirección/tienda |
| `Menú` | `Menu` | `State=Default/Active` | Ítem de menú lateral |
| `Tabs` | `_Base / Tab Item` | `State=Default/Active` | Tab de navegación entre vistas |
| `Accordion` | `Accordion_v2` | `State=Open/Close` | Sección expandible (FAQs, detalles) |

### Elementos base

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Tags` | `Tag` | `Color=Black/Blue/Green/Orange/Pink/Purple/Red/Teal/Neutral` | Etiqueta de estado o categoría |
| `Badge` | `Badge` | `State=Default` | Contador numérico (notificaciones, carrito) |
| `Chips` | `pds-chip` | `State=Active/Default/Disabled/Skeleton` | Filtro seleccionable |
| `Avatar` | `Avatar` | `Size=Sm/Md/Lg/Xl` · `Type=Text/Icon` · `Variant=Solid` | Avatar de usuario |
| `Brand` | `BrandLogo` | `Brand=Disco/Jumbo/Metro/Prezunic/TFM` | Logo de marca |
| `Loader` | `Loader` | `Size=Sm/Md/Lg` | Indicador de carga |
| `ProgressBar` | `ProgressBar` | `State=Default` | Barra de progreso |
| `Payments` | `Payment` | `Type=VISA/Master/Cencopay/...` | Logo de método de pago |
| `Imagen` | `Image_product` | `State=Image/No image/Skeleton` | Imagen de producto |

### Componentes de fidelización y pagos

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `LevelsCards` | `CardNivele` | `Type=Plus/Top/Vip/Unic` | Card de nivel de fidelización |
| `Balance Card` | `Balance Card` | `Type=Cartera/Cashback/Dolar` | Card de saldo digital |
| `Cupones/Giftcard` | `Cupón/Giftcard` | `State=Default/Disabled/Skeleton` | Cupón o giftcard |
| `Promo Card` | `Promo_card` | `State=Default/Skeleton` · `Type=Arrow/Button` | Card de promoción |
| `ResumenCard` | `ResumenCard` | `State=Default` | Resumen de compra |

### Componentes especiales

| Grupo Figma | Componente | Props principales | Cuándo usarlo |
|-------------|-----------|-------------------|---------------|
| `Bottom sheet` | `Bottom_Sheet` | `State=Collapsed/Half screen/Expanded` | Panel deslizable desde abajo |
| `Listas` | `Lista` | `State=Default/Eliminar/Crear/Skeleton` | Gestor de listas de compras |
| `LiveTracking` | `Live_tracking` | `State=Default/Lineal/Steps` | Seguimiento en tiempo real de pedido |
| `Smart banner` | `Smart_banner` | `Type=Prime/Sustitución` | Banner contextual inteligente |
| `Minimum Order` | `MinimumOrder` | `State=Default` | Aviso de monto mínimo |
| `Snackbar` | `SelectionCard` | `State=Default` | Card de selección con feedback |
| `Ubication map` | `_Ubication map` | `State=Default` | Selector de ubicación con mapa |

---

### ⛔ No usar
- Componentes con prefijo `_Base/` — son internos del DS, no para layouts
- Componentes con prefijo `_Story` — son solo para documentación
- `Local Componentes > Componentes Deprecados` — deprecated

---

### Guía rápida por tipo de pantalla

| Pantalla | Componentes recomendados — formato `[Grupo] > [Nombre] · Props` |
|----------|-------------------------------|
| **Home** | `Nav Bar > Header · Color=White · Type=Home · State=Default` + `Banners Cards > Banner_principal · Size=Lg · Skeleton=False` + `Categorys > Category-carousel · State=Default` + `Title_section > Title_section · Skeleton=No · CTA=Yes` + `Product Card > Product_card · Size=Md · State=Default` + `Nav Bar > NavBar · Color=Color · Type=Home · State=Default` |
| **PLP (listado)** | `Top bar > TopBar · State=Default · Type=Icon action_no title` + `Chips > pds-chip · State=Default` + `Product Card > Product_card · Size=Md · State=Default` + `Sticky Button > Sticky-button · Type=Horizontal` + `Nav Bar > NavBar · Color=Color · Type=Home · State=Default` |
| **PDP (detalle)** | `Top bar > TopBar · State=Default · Type=Icon action_no title` + `Imagen > Image_product · State=Image` + `Tags > Tag · Color=Green` + `Quantity selector > Quantity Selector · Size=Md · State=Default` + `Buttons > Button-Primary · Size=Lg · State=Default` + `Bottom sheet > Bottom_Sheet · State=Collapsed` |
| **Carrito** | `Top bar > TopBar_title · Type=Default` + `ProductCard_Details > ProductCard_Detail · Size=Md · State=Default` + `Totalizer > Totalizer · State=Default` + `Sticky Button > Sticky-button · Type=Horizontal` |
| **Checkout** | `Top bar > TopBar_title · Type=Default` + `Alerts > Alert · Type=Info · Border=False` + `Select list > Select_list · Type=Dirección` + `Payments > Payment · Type=VISA` + `ResumenCard > ResumenCard · State=Default` |
| **Perfil/Cuenta** | `Nav Bar > Header · Color=White · Type=Home · State=Default` + `LevelsCards > CardNivele · Type=Plus` + `Balance Card > Balance Card · Type=Cashback` + `Select list > Select_list · Type=Check` + `Nav Bar > NavBar · Color=Color · Type=Home · State=Default` |
| **Confirmación** | `Empty States > Empty state · Type=Success` + `Buttons > Button-Primary · Size=Lg · State=Default` |
| **Búsqueda** | `Nav Bar > Search_header · State=Default` + `Chips > pds-chip · State=Default` + `Product Card > Product_card · Size=Md · State=Default` + `Empty States > Empty state · Type=Empty` |

---

## 11. Componentes de Prisma — Detalle completo con variantes

> Extraído automáticamente desde Figma API · 1279 variantes · 82 componentes · actualizado 2026-06-25


### Accordion
- **Variantes:** 3
- **Props:**
  - `Open`: False · Skeleton · True

### Alerts
- **Variantes:** 15
- **Props:**
  - `Border`: False · True
  - `Property`: Botón · Chevron
  - `Skeleton`: False · True
  - `Type`: Color · Correo · Dirección · White
  - `State`: Error · Information · Success · Warning

### Avatar
- **Variantes:** 8
- **Props:**
  - `Size`: Lg · Md · Sm · Xl
  - `Type`: Icon · Text
  - `Variant`: Solid

### Badge
- **Variantes:** 5
- **Props:**
  - `Type`: Backdrop_Dark · Backdrop_light
  - `Size`: Small · large · medium
  - `Variant`: Solid

### Balance Card
- **Variantes:** 20
- **Props:**
  - `Type`: CardCarteraDigital · CardCashBack · Dolar · Reales · TopCardCasback
  - `State`: Saldo disponible · Saldo oculto · Sin saldo · Skeleton
  - `Skeleton`: False · True
  - `Variant`: Front · Left · Right
  - `Coin`: Pesos/Dolar · Reales

### Banner Overlay
- **Variantes:** 4
- **Props:**
  - `Type`: Dark · Light
  - `SIze`: Md · Xl

### Banner_soporte
- **Variantes:** 2
- **Props:**
  - `Skeleton`: No · Yes

### Banners Cards
- **Variantes:** 10
- **Props:**
  - `Size`: Lg · Md · Sm
  - `Skeleton`: False · True · true
  - `Type`: Landscape · Portrait

### Bottom sheet
- **Variantes:** 3
- **Props:**
  - `Type`: Collapsed · Expanded · Half screen

### Brand
- **Variantes:** 68
- **Props:**
  - `Type`: Disco · Gbarbosa · Jumbo_iso · Jumbo_text · Prezunic · Prisma · TFM_logo · Vea
  - `Size`: 2Xl · 2xl · 3Xl · Lg · Md · Sm · Xl · Xs
  - `Country`: Argentina · Colombia

### Buttons
- **Variantes:** 280
- **Props:**
  - `Size`: Lg · MD · Md · Sm · Xs
  - `State`: Default · Disabled · Loading · Pressed · Skeleton
  - `Type`: Button · Button-icon · Default · Tonal · White
  - `Variant`: Solid

### Carrusels
- **Variantes:** 13
- **Props:**
  - `Size`: Carrusel_lg · Carrusel_md · Carrusel_sm · Carrusel_xl · Carrusel_xs · Lg · Md · Mg · Sm
  - `State`: 1 · 2 · 3

### CategoryBanner
- **Variantes:** 2
- **Props:**
  - `Type`: Full · Half

### Categorys
- **Variantes:** 12
- **Props:**
  - `Size`: Md · Sm
  - `Skeleton`: False · No · True · Yes
  - `Variant`: Md · Sm
  - `Type`: Active · Default

### CheckBox
- **Variantes:** 7
- **Props:**
  - `State`: Activated · Default · Disabled · Disabled check · Error · Indeterminate · Skeleton
  - `Variant`: Solid

### Chips
- **Variantes:** 8
- **Props:**
  - `State`: Active · Default · Disabled · Skeleton
  - `Size`: Md · Sm

### Componente grafico
- **Variantes:** 5
- **Props:**
  - `State`: Active · Default · Error · Skeleton

### Cupones/Giftcard
- **Variantes:** 8
- **Props:**
  - `State`: Copiado · Default · Disabled · Skeleton
  - `Skeleton`: False · True
  - `Type`: Cupon · Giftcard

### Datos de usuario
- **Variantes:** 4
- **Props:**
  - `Banner promo`: False · True
  - `Country`: Argentina · Colombia

### Detalles del pedido
- **Variantes:** 17
- **Props:**
  - `State`: Despacho · Retiro en tienda · Skeleton
  - `In/Out`: Both · In · Out
  - `Variante`: Despacho · Presencial · Retiro en tienda · Skeleton

### Dialog
- **Variantes:** 1

### Dropdown
- **Variantes:** 7
- **Props:**
  - `State`: Default · Disabled · Error clean · Error select · Focus · Selected · Skeleton

### Dynamic_section
- **Variantes:** 2
- **Props:**
  - `State`: Default · Skeleton

### Empty States
- **Variantes:** 15
- **Props:**
  - `SIze`: Bottom sheet · Page
  - `Type`: Alternative · Empty State · Error/empty · Message · Success
  - `Variant`: Custom · Default · Image-animation

### FavoriteButton
- **Variantes:** 4
- **Props:**
  - `State`: Active · Default · Disabled · Motion

### Floating buttom
- **Variantes:** 4
- **Props:**
  - `Type`: Close · Default · Feedback · Loading

### Header Ofertas
- **Variantes:** 2
- **Props:**
  - `State`: Default · With elevation

### Header puntos
- **Variantes:** 8
- **Props:**
  - `Color`: Grey · White
  - `Skeleton`: False · True
  - `Type`: Balance · Cashback · Points

### Imagen
- **Variantes:** 15
- **Props:**
  - `Size`: Lg · Md · Sm · Xl · Xs
  - `Type`: Image · No image · Skeleton

### Imagenes
- **Variantes:** 4
- **Props:**
  - `Size`: Lg · Md · Sm

### Info Copy
- **Variantes:** 2
- **Props:**
  - `State`: Default · Disabled

### Information Card
- **Variantes:** 10
- **Props:**
  - `State`: Brand · Default · Error · Info · Neutral · Skeleton · Succes
  - `Skeleton`: False · True

### Inputs
- **Variantes:** 28
- **Props:**
  - `Type`: Input PIN · Phone number · Text field
  - `State`: Complete · Default · Disabled · Error · Error clean · Error text · Focus · Skeleton · Success

### Keyboard
- **Variantes:** 4
- **Props:**
  - `Main Action`: Done · Return
  - `Home Indicator`: False · True

### LevelsCards
- **Variantes:** 17
- **Props:**
  - `Type`: Plus · Skeleton · Top · Unic · Vip
  - `State`: 0% · 25% · 50% · 75%

### Listas
- **Variantes:** 7
- **Props:**
  - `Type`: Crear lista nueva · Crear lista nueva PDP · Default · Eliminar lista · Lista nueva · Lista sin productos · Skeleton

### LiveTracking
- **Variantes:** 5
- **Props:**
  - `Address`: Both · Close · Open
  - `State`: False · True
  - `Type`: Default · Lineal · Steps

### Loader
- **Variantes:** 3
- **Props:**
  - `Size`: Lg · Md · Sm

### Location
- **Variantes:** 6
- **Props:**
  - `Type`: Bran-2lines · Brand · Ofertas · Recibe · Retira

### Menú
- **Variantes:** 1

### Minimum Order
- **Variantes:** 1

### MoneyCards
- **Variantes:** 12
- **Props:**
  - `Type`: Beneficios · Cashback · Puntos
  - `Skeleton`: False · True
  - `State`: Canjeados · Default · Disabled · Ganados · Icon · Image

### Módulos
- **Variantes:** 5
- **Props:**
  - `Type`: 1-1-1 · 1-2 · 1-2-1-2 · 1-2-2 · 2-2-2

### Nav Bar
- **Variantes:** 27
- **Props:**
  - `State`: Default · Focus · Sin resultados · Tiempo de carga · Typing · Volver
  - `Color`: Color · White
  - `Type`: Brand · Brand v2 · Default · Default-PLP · Focus · Focus search · Focus-PLP · Home · Typing · Typing-PLP

### NotificationCard
- **Variantes:** 7
- **Props:**
  - `Type`: Icono · Image · Message · Skeleton
  - `State`: Leido · Nuevo
  - `Skeleton`: False · True

### Numeric indicator
- **Variantes:** 1

### OffersCard-PDP
- **Variantes:** 3
- **Props:**
  - `Card`: Border · Default
  - `Skeleton`: False · True

### Overlay
- **Variantes:** 4
- **Props:**
  - `Type`: Dark · Light
  - `Skeleton`: No · Yes

### Page control
- **Variantes:** 9
- **Props:**
  - `Dots`: 2 · 3 · 4
  - `Selection`: 1 · 2 · 3 · 4

### Payments
- **Variantes:** 149
- **Props:**
  - `Type`: AmericaE · BBVA · Banco Popular · Banco de bogotá · Banco de occidente · Bancolombia · Cabal · Cenco_scotiabank · Cencopay · Colpatria · Colpatria+scotiabank · Daviplata · Davivienda · Dinners-club · Disco · Giftcard_cencosud · Itaú · Jumbo · Master · Master-grey · Naranja · NaranjaX · Nativa · Otro · PayPal · PrezUnic · Prime · Prime-grey · Prime_bookmark · Tarjeta_Aval · Tarjeta_banco_avillas · Tarjeta_cencosud · Tarjeta_codensa · Venmo · Visa · Visa-grey · banco_falabella · cuotas-card
  - `Size`: Lg · Md · Sm · Xl

### Popup
- **Variantes:** 2
- **Props:**
  - `Type`: Img + contenido · Solo img

### Product Card 
- **Variantes:** 50
- **Props:**
  - `Size`: Md · Sm
  - `State`: Active · Default · Price-strike · Skeleton · Skeleton Border
  - `Type`: Carrusel Card · Carrusel Card Border · Default · Favoritos · Lista · PLP · PLP Select · PLP Selected · PLP_check_active · PLP_check_selected · Porduct_card_active · Porduct_card_active_active · Porduct_card_radio · Porduct_card_select · Skeleton · Swipe_delete
  - `Estate`: Default · Eliminar · No disponible · Seleccionado · Skeleton

### Product Card Brasil 
- **Variantes:** 11
- **Props:**
  - `Type`: Carrusel Card · Carrusel Card Border · Default · PLP · Product_card_bra · Skeleton · Swipe_delete
  - `State`: Default · Porduct_card_active · Porduct_card_select · Skeleton · Skeleton Border

### ProductCard_Details
- **Variantes:** 6
- **Props:**
  - `Type`: Default · No image · Skeleton
  - `Size`: Lg · Md

### ProgressBar
- **Variantes:** 60
- **Props:**
  - `Size`: Lg · Mg · Sm
  - `Type`: Bar · Step
  - `Porcentaje`: 0% · 100% · 25% · 50% · 75%
  - `Border`: Rounded · Square

### Promo Card
- **Variantes:** 8
- **Props:**
  - `Type`: Arrow · Button
  - `State`: Default · Skeleton

### Promotional-Ribbon
- **Variantes:** 1

### Quantity selector
- **Variantes:** 50
- **Props:**
  - `State`: Buttom-Primary · Default · Disabled · Eliminar · Quantity Selector · Quantiy · Selector · Unity
  - `Property`: Round · Rounded
  - `Type`: Default · Delete · Disabled · Minus disabled · Plus disabled · Skeleton
  - `Size`: Lg · Md · Sm
  - `Variant`: Round · Rounded

### RadioButton
- **Variantes:** 6
- **Props:**
  - `State`: Activated · Default · Disabled · Disabled selected · Error · Skeleton
  - `Variant`: Solid

### ResumeCard Cashback
- **Variantes:** 9
- **Props:**
  - `Type`: Detail grey · Detail white · Grey · Skeleton · Top-resume · White
  - `Skeleton`: False · True

### ResumenCard 
- **Variantes:** 4
- **Props:**
  - `Actions`: 2 · 3
  - `Skeleton`: False · True

### Ribbon de descuento
- **Variantes:** 4
- **Props:**
  - `Size`: Md · Sm
  - `State`: Default · Skeleton

### Select list
- **Variantes:** 30
- **Props:**
  - `State`: Default · Disabled · Selected · Skeleton
  - `Type`: Check · Checkbox · Dirección · RadioButton · Toggle
  - `Variant`: 1 line · 2 Lines

### Select promo
- **Variantes:** 3
- **Props:**
  - `State`: Default · Select · Skeleton

### ShareButton
- **Variantes:** 4
- **Props:**
  - `Property 1`: Default · Disabled
  - `Instance`: Default · Disabled

### Skeleton
- **Variantes:** 2
- **Props:**
  - `Type`: Brick · Circle

### Slots
- **Variantes:** 3
- **Props:**
  - `Size`: 24x24 · 32x32 · 40x40

### Smart banner
- **Variantes:** 4
- **Props:**
  - `Type`: Consideraciones · Prime · Sustitución

### Snackbar
- **Variantes:** 4
- **Props:**
  - `State`: Error · Information · Success · Warning

### Spectral
- **Variantes:** 14
- **Props:**
  - `Color`: White
  - `Type`: Home
  - `State`: Default

### Steppers
- **Variantes:** 4
- **Props:**
  - `Steps`: 2 steps · 3 steps · 4 steps · 5 steps

### Sticky Button
- **Variantes:** 2
- **Props:**
  - `Type`: Horizontal · Vertical

### Store
- **Variantes:** 26
- **Props:**
  - `Type`: AppStore · PlayStore
  - `Variant`: Disco · Jumbo_isologo · Jumbo_logo · Prezunic · Staging-tfm · Staging_Disco-Arg · Staging_Jumbo-Arg · Staging_Jumbo-Co · Staging_Vea-Arg · Stg-Prezunic · TFM · Ve · Vea
  - `Event`: Jumbo al 100
  - `Store`: AppStore · PlayStore

### Tabs
- **Variantes:** 4
- **Props:**
  - `Size`: Md · Sm
  - `Type`: Segmented control · Swipe

### Tags
- **Variantes:** 48
- **Props:**
  - `Type`: Solid · Subtle
  - `Size`: Md · Sm
  - `Color`: Black · Blue · Green · Neutral · Orange · Pink · Prime-Jumbo · Prime-Prez · Purple · Red · Skeleton · Teal

### Talla/color
- **Variantes:** 3
- **Props:**
  - `Type`: Color · Giftcard · Talla

### Text área
- **Variantes:** 5
- **Props:**
  - `State`: Complete · Content_clean · Content_error · Default · Focus

### Title_section
- **Variantes:** 2
- **Props:**
  - `Skeleton`: No · Yes

### Toggle
- **Variantes:** 4
- **Props:**
  - `State`: Off · On
  - `Tipo`: Default · Disabled

### Top bar
- **Variantes:** 16
- **Props:**
  - `State`: Default · Whit elevation
  - `Type`: Back + slot center · Default · Ghost · Icon action_no title · Icon actions · Text link · Whit elevation · back+ slot center + icon actions

### Totalizer
- **Variantes:** 11
- **Props:**
  - `Type`: Combo · Default · Open · Skeleton
  - `State`: Default · Expand · Open · Skeleton · skeleton

### Ubication map
- **Variantes:** 2
- **Props:**
  - `State`: Agregar manualmente · Mi ubicación