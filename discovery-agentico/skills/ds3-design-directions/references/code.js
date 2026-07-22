// ============================================================
// Prisma Builder — Figma Plugin v7.0
// Whitelabel UX Team · Cencosud · 2026
// ============================================================
// Modo 1: Sync Library — ejecutar en Prisma-Components
//   Escanea todos los componentes Y las Variable Collections (brand modes)
//   Guarda mapa nombre→key + collectionId + modeIds en clientStorage.
//
// Modo 2: Build Screens — ejecutar en archivo de trabajo
//   Toma el DS3 JSON (packets.ds3), genera frames con componentes reales
//   y aplica el modo de marca correcto (TFM verde, Jumbo morado, etc.)
// ============================================================

const FRAME_WIDTH = 390;   // iPhone 14 / estándar mobile
const FRAME_HEIGHT = 844;
const FRAME_GAP = 64;
const STORAGE_KEY_MAP    = 'prisma_component_map';
const STORAGE_KEY_DATE   = 'prisma_sync_date';
const STORAGE_KEY_COUNT  = 'prisma_sync_count';
const STORAGE_KEY_BRANDS = 'prisma_brand_modes';   // { collectionId, modes: [{name, modeId}] }

// Mapeo de nombres de marca en DS3 → nombre del modo en Figma Variables
const BRAND_NAME_MAP = {
  'the fresh market': 'The Fresh Market',
  'thefreshmarket': 'The Fresh Market',
  'tfm': 'The Fresh Market',
  'jumbo': 'Jumbo',
  'disco': 'Disco',
  'metro': 'Metro',
  'prezunic': 'Prezunic',
  'vea': 'Vea',
  'gbarbosa': 'Gbarbosa',
  'g barbosa': 'Gbarbosa',
  'prisma': 'Prisma',
};

// ----------------------------------------------------------
// Mostrar UI
// ----------------------------------------------------------
figma.showUI(__html__, {
  width: 340,
  height: 520,
  title: 'Prisma Builder'
});

// ----------------------------------------------------------
// sendInit — envía el estado inicial a la UI
// Se llama cuando la UI avisa que está lista (UI_READY)
// Esto evita el race condition donde INIT llega antes de que
// window.onmessage esté activo en el iframe.
// ----------------------------------------------------------
async function sendInit() {
  const mapStr    = await figma.clientStorage.getAsync(STORAGE_KEY_MAP);
  const date      = await figma.clientStorage.getAsync(STORAGE_KEY_DATE);
  const count     = await figma.clientStorage.getAsync(STORAGE_KEY_COUNT);
  const brandsStr = await figma.clientStorage.getAsync(STORAGE_KEY_BRANDS);

  let brandNames = [];
  if (brandsStr) {
    try {
      const collections = JSON.parse(brandsStr);
      const arr = Array.isArray(collections) ? collections : [collections];
      brandNames = [...new Set(arr.flatMap(c => (c.modes || []).map(m => m.name)))];
    } catch (_) {}
  }

  figma.ui.postMessage({
    type: 'INIT',
    hasMap: !!mapStr,
    count: count || 0,
    syncDate: date || null,
    currentFile: figma.root.name,
    hasBrands: brandNames.length > 0,
    brands: brandNames
  });
}

// ----------------------------------------------------------
// Mensajes desde la UI
// ----------------------------------------------------------
figma.ui.onmessage = async (msg) => {

  // ── UI_READY — la UI está lista para recibir mensajes ───
  if (msg.type === 'UI_READY') {
    sendInit();
    return;
  }

  // ── SYNC LIBRARY ────────────────────────────────────────
  if (msg.type === 'SYNC_LIBRARY') {
    figma.ui.postMessage({ type: 'SYNC_PROGRESS', text: 'Escaneando componentes…' });

    // 1. Escanear componentes
    const allNodes = figma.root.findAll(n =>
      n.type === 'COMPONENT' || n.type === 'COMPONENT_SET'
    );

    const mapping = {};

    allNodes.forEach(node => {
      if (node.type === 'COMPONENT') {
        const entry = buildComponentEntry(node);
        if (entry) {
          mapping[entry.name] = entry.key;
          if (entry.aliases) {
            entry.aliases.forEach(alias => {
              if (!mapping[alias]) mapping[alias] = entry.key;
            });
          }
        }
      }
    });

    const count = Object.keys(mapping).length;

    // 2. Escanear TODAS las Variable Collections (para no depender del nombre)
    figma.ui.postMessage({ type: 'SYNC_PROGRESS', text: 'Escaneando brand modes…' });
    let allCollections = [];
    try {
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      // Guardar todas las colecciones con sus modos
      allCollections = collections.map(c => ({
        collectionId: c.id,
        collectionName: c.name,
        modes: c.modes.map(m => ({ name: m.name, modeId: m.modeId }))
      }));
    } catch (e) {
      // Variables API puede no estar disponible — no es bloqueante
    }

    await figma.clientStorage.setAsync(STORAGE_KEY_MAP, JSON.stringify(mapping));
    await figma.clientStorage.setAsync(STORAGE_KEY_DATE, new Date().toISOString());
    await figma.clientStorage.setAsync(STORAGE_KEY_COUNT, count);
    if (allCollections.length > 0) {
      await figma.clientStorage.setAsync(STORAGE_KEY_BRANDS, JSON.stringify(allCollections));
    }

    // Encontrar qué modos de marca existen (para mostrar en el mensaje)
    const allModeNames = [...new Set(allCollections.flatMap(c => c.modes.map(m => m.name)))];
    const brandModeNames = allModeNames.filter(n =>
      Object.values(BRAND_NAME_MAP).map(v => v.toLowerCase()).includes(n.toLowerCase()) ||
      ['jumbo','disco','metro','prisma','vea','gbarbosa'].some(b => n.toLowerCase().includes(b))
    );

    figma.ui.postMessage({
      type: 'SYNC_COMPLETE',
      count,
      brands: brandModeNames,
      collectionsFound: allCollections.length,
      sample: Object.entries(mapping).slice(0, 8).map(([k, v]) => ({ name: k, key: v.substring(0, 8) + '…' }))
    });
  }

  // ── BUILD SCREENS ────────────────────────────────────────
  if (msg.type === 'BUILD_SCREENS') {
    const mapStr    = await figma.clientStorage.getAsync(STORAGE_KEY_MAP);
    const brandsStr = await figma.clientStorage.getAsync(STORAGE_KEY_BRANDS);

    if (!mapStr) {
      figma.ui.postMessage({ type: 'ERROR', message: 'No hay mapa de componentes. Ejecutá "Sync Library" primero desde el archivo Prisma-Components.' });
      return;
    }

    let ds3Data;
    try {
      ds3Data = JSON.parse(msg.ds3Json);
    } catch (e) {
      figma.ui.postMessage({ type: 'ERROR', message: 'JSON inválido. Verificá que pegaste el contenido completo de packets.ds3.' });
      return;
    }

    const componentMap = JSON.parse(mapStr);

    // brandModeData del Sync (puede estar vacío si las variables son externas al Prisma-Components file)
    let brandModeData = brandsStr ? JSON.parse(brandsStr) : [];
    if (!Array.isArray(brandModeData)) brandModeData = [brandModeData];

    // Paso A: colecciones locales del archivo de trabajo
    figma.ui.postMessage({ type: 'BUILD_PROGRESS', text: 'Buscando brand tokens…' });
    try {
      const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
      if (localCollections && localCollections.length > 0) {
        const existingIds = new Set(brandModeData.map(c => c.collectionId));
        for (const col of localCollections) {
          if (!existingIds.has(col.id)) {
            brandModeData.push({
              collectionId: col.id,
              collectionName: col.name,
              modes: col.modes.map(m => ({ name: m.name, modeId: m.modeId }))
            });
          }
        }
      }
    } catch (_) {}

    // Paso B: librerías publicadas habilitadas en este archivo
    // Los brand tokens (2-Style Tokens con TFM/Jumbo/etc.) suelen estar en un archivo de tokens separado
    // getAvailableLibraryVariableCollectionsAsync() los encuentra via team library
    const marcaToSearch = (ds3Data.marca || ds3Data.brand || '').toLowerCase();
    const brandAlreadyFound = marcaToSearch && resolveBrandMode(ds3Data.marca || '', brandModeData);

    if (!brandAlreadyFound && marcaToSearch) {
      figma.ui.postMessage({ type: 'BUILD_PROGRESS', text: 'Buscando en librerías publicadas…' });
      try {
        const libCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
        for (const libCol of libCollections) {
          try {
            // Importar una sola variable para acceder a los modos de la colección
            const libVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCol.key);
            if (libVars.length === 0) continue;

            const imported = await figma.variables.importVariableByKeyAsync(libVars[0].key);
            if (!imported || !imported.variableCollectionId) continue;

            const col = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId);
            if (!col || !col.modes || col.modes.length < 2) continue;

            const existingIds = new Set(brandModeData.map(c => c.collectionId));
            if (!existingIds.has(col.id)) {
              brandModeData.push({
                collectionId: col.id,
                collectionName: `[lib] ${libCol.libraryName} · ${col.name}`,
                modes: col.modes.map(m => ({ name: m.name, modeId: m.modeId }))
              });
            }

            // Si ya encontramos la marca, parar
            if (resolveBrandMode(ds3Data.marca || '', brandModeData)) break;
          } catch (_) {}
        }
      } catch (_) {}
    }

    figma.ui.postMessage({ type: 'BUILD_PROGRESS', text: 'Generando pantallas…' });

    try {
      const result = await buildScreens(ds3Data, componentMap, brandModeData);
      if (result.frames.length > 0) {
        figma.viewport.scrollAndZoomIntoView(result.frames);
      }
      figma.ui.postMessage({
        type: 'BUILD_COMPLETE',
        framesCount: result.frames.length,
        brandApplied: result.brandApplied,
        collectionsSearched: brandModeData.map(c => `${c.collectionName} (${c.modes.map(m=>m.name).join(', ')})`),
        warnings: result.warnings
      });
    } catch (err) {
      figma.ui.postMessage({ type: 'ERROR', message: `Error al generar: ${err.message}` });
    }
  }

  // ── EXPORT MAP ───────────────────────────────────────────
  if (msg.type === 'EXPORT_MAP') {
    const mapStr = await figma.clientStorage.getAsync(STORAGE_KEY_MAP);
    figma.ui.postMessage({ type: 'MAP_DATA', data: mapStr || '{}' });
  }

  // ── CLEAR STORAGE ────────────────────────────────────────
  if (msg.type === 'CLEAR_STORAGE') {
    await figma.clientStorage.deleteAsync(STORAGE_KEY_MAP);
    await figma.clientStorage.deleteAsync(STORAGE_KEY_DATE);
    await figma.clientStorage.deleteAsync(STORAGE_KEY_COUNT);
    await figma.clientStorage.deleteAsync(STORAGE_KEY_BRANDS);
    figma.ui.postMessage({ type: 'STORAGE_CLEARED' });
  }

  // ── CLOSE ────────────────────────────────────────────────
  if (msg.type === 'CLOSE') {
    figma.closePlugin();
  }
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Construye el nombre canónico para un nodo COMPONENT.
 * Formato objetivo: "Grupo > NombreSet · Prop1=Val1 · Prop2=Val2"
 */
function buildComponentEntry(node) {
  if (!node || !node.key) return null;

  let groupName = '';
  let setName = '';
  let variantStr = '';

  const parent = node.parent;

  if (parent && parent.type === 'COMPONENT_SET') {
    setName = parent.name;
    variantStr = node.name; // "Size=Lg, State=Default"

    const gp = parent.parent;
    if (gp && gp.type !== 'PAGE' && gp.name) {
      groupName = gp.name;
    }
  } else {
    setName = node.name;
    if (parent && parent.type !== 'PAGE' && parent.name) {
      groupName = parent.name;
    }
  }

  // Normalizar variantes: "Size=Lg, State=Default" → "Size=Lg · State=Default"
  let variantPart = '';
  if (variantStr) {
    variantPart = variantStr
      .split(',')
      .map(v => v.trim())
      .join(' · ');
  }

  const canonical = buildName(groupName, setName, variantPart);
  const aliases = buildAliases(groupName, setName, variantPart);

  return { name: canonical, key: node.key, aliases };
}

function buildName(group, set, variant) {
  let name = group ? `${group} > ${set}` : set;
  if (variant) name += ` · ${variant}`;
  return name;
}

function buildAliases(group, set, variant) {
  const aliases = [];
  // Sin grupo
  if (group) {
    aliases.push(variant ? `${set} · ${variant}` : set);
  }
  // Con "s" al final del set name (Button/Buttons)
  const setPlural = set.endsWith('s') ? set.slice(0, -1) : set + 's';
  aliases.push(buildName(group, setPlural, variant));
  aliases.push(buildName('', setPlural, variant));
  return aliases;
}

// ============================================================
// BUILD SCREENS
// ============================================================

async function buildScreens(ds3Data, componentMap, brandModeData) {
  const warnings = [];
  const createdFrames = [];

  // Detectar estructura del JSON
  let pantallas = [];
  if (Array.isArray(ds3Data.pantallas)) {
    pantallas = ds3Data.pantallas;
  } else if (Array.isArray(ds3Data.direcciones)) {
    const dir = ds3Data.direcciones[0];
    pantallas = dir.pantallas || [];
  } else if (Array.isArray(ds3Data.screens)) {
    pantallas = ds3Data.screens;
  }

  if (pantallas.length === 0) {
    warnings.push('No se encontraron pantallas en el JSON. Verificá la estructura.');
    return { frames: [], warnings, brandApplied: null };
  }

  const marca = ds3Data.marca || ds3Data.brand || '';
  const pageName = marca ? `Prisma Builder · ${marca}` : 'Prisma Builder';

  // Resolver brand mode
  const brandMode = resolveBrandMode(marca, brandModeData);
  if (marca && !brandMode) {
    warnings.push(`⚠️ Marca "${marca}" no encontrada en brand modes. Aplicando tema default (Prisma). Re-sincronizá desde Prisma-Components si los modos no aparecen.`);
  }

  // Crear nueva página para los frames
  const newPage = figma.createPage();
  newPage.name = pageName;
  figma.currentPage = newPage;

  let xOffset = 0;

  for (const pantalla of pantallas) {
    const pantallaName = pantalla.nombre || pantalla.name || 'Pantalla';
    const componentes = pantalla.componentes || pantalla.components || [];

    figma.ui.postMessage({ type: 'BUILD_PROGRESS', text: `Generando: ${pantallaName}…` });

    // ── Layout v2.0 — leer campos de layout del JSON ─────────
    const layout = (pantalla.layout && typeof pantalla.layout === 'object') ? pantalla.layout : {};
    const pad = layout.padding || {};
    const layoutDir = ((layout.direction || 'vertical').toUpperCase() === 'HORIZONTAL') ? 'HORIZONTAL' : 'VERTICAL';

    const frame = figma.createFrame();
    frame.name = pantallaName;
    frame.resize(layout.width || FRAME_WIDTH, layout.height || FRAME_HEIGHT);
    frame.x = xOffset;
    frame.y = 0;

    // Background color
    if (layout.backgroundColor) {
      const rgb = hexToRgb(layout.backgroundColor);
      if (rgb) frame.fills = [{ type: 'SOLID', color: rgb }];
      else frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    } else {
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    }

    // Clip content — default true en v2.0
    frame.clipsContent = layout.clipContent !== false;

    // Auto-layout
    frame.layoutMode = layoutDir;
    frame.primaryAxisSizingMode = (layout.primaryAxisSizing === 'fixed') ? 'FIXED' : 'AUTO';
    frame.counterAxisSizingMode = (layout.counterAxisSizing === 'auto') ? 'AUTO' : 'FIXED';

    // Gap entre componentes
    frame.itemSpacing = layout.gap ?? 0;

    // Padding del frame
    frame.paddingTop = pad.top ?? 0;
    frame.paddingRight = pad.right ?? 0;
    frame.paddingBottom = pad.bottom ?? 0;
    frame.paddingLeft = pad.left ?? 0;

    // ── Aplicar brand mode al frame ──────────────────────────
    if (brandMode) {
      try {
        frame.setExplicitVariableModeForCollection(
          brandMode.collectionId,
          brandMode.modeId
        );
      } catch (_) {
        // El working file puede no tener la library habilitada — no es bloqueante
      }
    }

    newPage.appendChild(frame);
    createdFrames.push(frame);
    xOffset += FRAME_WIDTH + FRAME_GAP;

    for (const comp of componentes) {

      // ── CASO A: Composición de sub-componentes ─────────────
      // Cuando el componente no existe en la librería, DS3 genera
      // { tipo: "composicion", nombre_intencional: "X", composicion: [...] }
      if (comp.tipo === 'composicion' && Array.isArray(comp.composicion)) {
        const nombreIntencional = comp.nombre_intencional || 'Componente nuevo';

        // Layout v2.0 para composiciones
        const compLayout = (comp.layout && typeof comp.layout === 'object') ? comp.layout : {};
        const compPad = compLayout.padding || {};
        const compDir = ((compLayout.direction || 'vertical').toUpperCase() === 'HORIZONTAL') ? 'HORIZONTAL' : 'VERTICAL';

        const subFrame = figma.createFrame();
        subFrame.name = `[⚠️ NUEVO] ${nombreIntencional}`;
        subFrame.layoutMode = compDir;
        subFrame.primaryAxisSizingMode = 'AUTO';
        subFrame.counterAxisSizingMode = 'FIXED';
        subFrame.resize(FRAME_WIDTH, 100);
        subFrame.itemSpacing = compLayout.gap ?? 0;
        subFrame.paddingLeft = compPad.left ?? 0;
        subFrame.paddingRight = compPad.right ?? 0;
        subFrame.paddingTop = compPad.top ?? 0;
        subFrame.paddingBottom = compPad.bottom ?? 0;

        // Fondo ámbar muy suave + borde naranja punteado
        subFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 0.97, b: 0.88 }, opacity: 1 }];
        subFrame.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.6, b: 0.1 } }];
        subFrame.strokeWeight = 1.5;
        subFrame.dashPattern = [6, 4];
        subFrame.strokeAlign = 'INSIDE';

        // Label superior — banner naranja con texto del nombre del componente
        const labelBanner = figma.createFrame();
        labelBanner.name = 'label-nuevo-componente';
        labelBanner.layoutMode = 'HORIZONTAL';
        labelBanner.primaryAxisSizingMode = 'FIXED';
        labelBanner.counterAxisSizingMode = 'AUTO';
        labelBanner.resize(FRAME_WIDTH, 10);
        labelBanner.fills = [{ type: 'SOLID', color: { r: 1, g: 0.6, b: 0.1 } }];
        labelBanner.paddingLeft = 10;
        labelBanner.paddingRight = 10;
        labelBanner.paddingTop = 5;
        labelBanner.paddingBottom = 5;

        try {
          await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
          const labelText = figma.createText();
          labelText.fontName = { family: 'Inter', style: 'Bold' };
          labelText.fontSize = 10;
          labelText.characters = `⚠️ COMPONENTE NUEVO — ${nombreIntencional} · No existe en Prisma-Components`;
          labelText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
          labelText.layoutSizingHorizontal = 'FILL';
          labelBanner.appendChild(labelText);
        } catch (_) {}

        subFrame.appendChild(labelBanner);

        // Sub-componentes
        let subPlaceholders = 0;
        for (const sub of comp.composicion) {
          const subName = sub.componente || '';
          if (!subName) continue;
          const subKey = findKey(subName, componentMap, sub.booleanProps);
          if (subKey) {
            try {
              const subComp = await figma.importComponentByKeyAsync(subKey);
              const subInstance = subComp.createInstance();

              // v2.0: text overrides por capa (prioridad) o contenido legacy
              if (sub.textOverrides && Object.keys(sub.textOverrides).length > 0) {
                try { await injectTextOverrides(subInstance, sub.textOverrides); } catch (_) {}
              } else if (sub.contenido) {
                try { injectText(subInstance, sub.contenido); } catch (_) {}
              }

              subFrame.appendChild(subInstance);

              // v2.0: sizing, boolean props, nested swaps
              applySizing(subInstance, sub.sizing);
              applyBooleanProps(subInstance, sub.booleanProps);
              if (sub.nestedSwaps) await applyNestedSwaps(subInstance, sub.nestedSwaps, componentMap);
            } catch (_) {
              subPlaceholders++;
              addPlaceholder(subFrame, subName, FRAME_WIDTH);
            }
          } else {
            subPlaceholders++;
            addPlaceholder(subFrame, subName, FRAME_WIDTH);
          }
        }

        // v2.0: aplicar sizing al subFrame de la composición
        frame.appendChild(subFrame);
        applySizing(subFrame, comp.sizing);

        warnings.push(`🔧 Componente nuevo: "${nombreIntencional}" — no existe en Prisma-Components. Crear con Figma Make usando el prompt en output_ds3.md`);
        if (subPlaceholders > 0) {
          warnings.push(`   └─ ${subPlaceholders} sub-componente(s) no encontrado(s) dentro de "${nombreIntencional}"`);
        }
        continue;
      }

      // ── CASO NORMAL: componente individual ──────────────────
      const compName = comp.componente || comp.component || comp.nombre || comp.name || '';
      if (!compName) continue;

      const key = findKey(compName, componentMap, comp.booleanProps);

      if (key) {
        try {
          const component = await figma.importComponentByKeyAsync(key);
          const instance = component.createInstance();

          // v2.0: spacing.before — spacer antes del componente
          const spacing = comp.spacing || {};
          if (spacing.before > 0) {
            insertSpacer(frame, spacing.before);
          }

          // v2.0: text overrides por capa (prioridad) o contenido legacy
          if (comp.textOverrides && Object.keys(comp.textOverrides).length > 0) {
            try {
              await injectTextOverrides(instance, comp.textOverrides);
            } catch (_) {}
          } else if (comp.contenido) {
            try {
              injectText(instance, comp.contenido);
            } catch (_) {}
          }

          frame.appendChild(instance);

          // v2.0: sizing, boolean props, nested swaps
          applySizing(instance, comp.sizing);
          applyBooleanProps(instance, comp.booleanProps);
          if (comp.nestedSwaps) await applyNestedSwaps(instance, comp.nestedSwaps, componentMap);

          // v2.0: spacing.after — spacer después del componente
          if (spacing.after > 0) {
            insertSpacer(frame, spacing.after);
          }
        } catch (err) {
          warnings.push(`⚠️ No se pudo importar: ${compName}`);
          addPlaceholder(frame, compName, FRAME_WIDTH);
        }
      } else {
        warnings.push(`❓ No encontrado en mapa: ${compName}`);
        addPlaceholder(frame, compName, FRAME_WIDTH);
      }
    }

    // Si quedó en modo NONE, ajustar altura
    if (frame.layoutMode === 'NONE') {
      frame.resize(FRAME_WIDTH, Math.max(FRAME_HEIGHT, frame.height));
    }
  }

  return { frames: createdFrames, warnings, brandApplied: brandMode ? brandMode.modeName : null };
}

/**
 * Resuelve el brand mode a aplicar según el nombre de marca del DS3 JSON.
 * Busca en TODAS las colecciones guardadas durante el Sync.
 * Retorna { collectionId, modeId, modeName } o null.
 */
function resolveBrandMode(marca, brandModeData) {
  if (!marca || !brandModeData) return null;

  const marcaNorm = marca.toLowerCase().trim();
  // Resolver alias: "the fresh market" → "The Fresh Market"
  const figmaBrandName = (BRAND_NAME_MAP[marcaNorm] || marca).toLowerCase();

  // brandModeData es un array de colecciones
  const collections = Array.isArray(brandModeData) ? brandModeData : [brandModeData];

  for (const collection of collections) {
    const mode = (collection.modes || []).find(m => {
      const modeLower = m.name.toLowerCase();
      return modeLower === figmaBrandName || modeLower === marcaNorm;
    });
    if (mode) {
      return {
        collectionId: collection.collectionId,
        modeId: mode.modeId,
        modeName: mode.name
      };
    }
  }

  return null;
}

/**
 * Inyecta el texto del campo "contenido" en el primer TextNode editable
 * de una instancia. Best-effort — no falla si no encuentra text nodes.
 */
async function injectText(instance, contenido) {
  if (!contenido || typeof contenido !== 'string') return;
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).catch(() => {});
  const textNodes = instance.findAll(n => n.type === 'TEXT');
  // Inyectar en el primer text node que no sea un label corto (< 3 chars)
  const target = textNodes.find(n => n.characters && n.characters.length >= 1) || textNodes[0];
  if (target) {
    try {
      await figma.loadFontAsync(target.fontName);
      target.characters = contenido.substring(0, 200); // cap de seguridad
    } catch (_) {}
  }
}

// Prefijos de diseño atómico que DS3 puede generar pero NO existen en Figma
const ATOMIC_PREFIXES = ['atoms', 'molecules', 'organisms', 'headers', 'cards', 'nav'];

/**
 * Busca el key de un componente en el mapa.
 * Estrategia en cascada — de más específico a más permisivo:
 * 0. Strip atomic prefix si DS3 generó Atoms >/Molecules >/etc. (no existen en Figma)
 * 0b. Merge booleanProps en el nombre para completar props faltantes
 * 1. Exacto (con nombre mergeado)
 * 2. Normalizado (sin espacios, sin mayúsculas, sin guiones bajos, sin paréntesis)
 * 3. Partial props — mismo base name, mayor cantidad de props en común
 * 4. Sin variantes (solo grupo + nombre del componente) — SOLO variantes, no COMPONENT_SETs
 * 5. Solo nombre del componente (sin grupo ni variantes)
 * 6. Nombre del componente como substring en el mapa
 *
 * @param {string} name - Nombre del componente desde DS3 JSON
 * @param {Object} map - Mapa nombre→key del Sync
 * @param {Object} [booleanProps] - Props booleanas del campo booleanProps del JSON v2.0
 */
function findKey(name, map, booleanProps) {
  if (!name) return null;

  // 0. Strip atomic design prefixes que DS3 puede generar incorrectamente
  const firstGroupNorm = normalizeStr((name.split('>')[0] || '').trim());
  if (name.includes('>') && ATOMIC_PREFIXES.some(p => firstGroupNorm === p || firstGroupNorm.startsWith(p))) {
    const withoutAtomicGroup = name.split('>').slice(1).join('>').trim();
    if (withoutAtomicGroup) {
      const result = findKey(withoutAtomicGroup, map, booleanProps);
      if (result) return result;
    }
  }

  // 0b. Merge booleanProps en el nombre
  //     Si DS3 genera "Title_section > Title_section · Skeleton=No"
  //     y booleanProps = { "CTA": false }, construir:
  //     "Title_section > Title_section · Skeleton=No · CTA=No"
  const mergedName = mergeBooleanPropsIntoName(name, booleanProps);

  // 1. Exacto (primero mergedName, luego original)
  if (mergedName !== name && map[mergedName]) return map[mergedName];
  if (map[name]) return map[name];

  // 2. Normalizado completo (mergedName primero)
  const normMerged = normalizeStr(mergedName);
  const norm = normalizeStr(name);

  if (normMerged !== norm) {
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(k) === normMerged) return v;
    }
  }
  for (const [k, v] of Object.entries(map)) {
    if (normalizeStr(k) === norm) return v;
  }

  // 3. Partial props match — buscar entradas con mismo base name y mayor overlap de props
  //    Esto resuelve el caso donde DS3 tiene 2 props y el mapa tiene 3 o viceversa
  const baseNameNorm = normalizeStr(stripProps(name));
  if (baseNameNorm) {
    const candidates = [];
    for (const [k, v] of Object.entries(map)) {
      const kBase = normalizeStr(stripProps(k));
      if (kBase === baseNameNorm) {
        // Contar cuántas props del nombre están en esta entrada del mapa
        const nameProps = extractProps(mergedName);
        const mapProps = extractProps(k);
        if (mapProps.length === 0) continue; // Skip COMPONENT_SET entries (sin props)
        const overlap = nameProps.filter(np =>
          mapProps.some(mp => normalizeStr(mp) === normalizeStr(np))
        ).length;
        candidates.push({ key: v, mapName: k, overlap, totalProps: mapProps.length });
      }
    }
    if (candidates.length > 0) {
      // Ordenar: mayor overlap primero, menor total de props como desempate
      candidates.sort((a, b) => b.overlap - a.overlap || a.totalProps - b.totalProps);
      // Solo retornar si la mejor opción tiene al menos 1 prop en común (evitar false positives)
      if (candidates[0].overlap > 0) return candidates[0].key;
      // Si ninguna tiene overlap pero tenemos candidatos con props, tomar la primera variante
      if (candidates.length > 0) return candidates[0].key;
    }
  }

  // 4. Sin variantes — solo "Grupo > Nombre" — buscar una VARIANTE (con props), no un COMPONENT_SET
  const nameWithoutProps = stripProps(name);
  const normWithoutProps = normalizeStr(nameWithoutProps);
  if (normWithoutProps) {
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(stripProps(k)) === normWithoutProps && k.includes('·')) return v;
    }
    // Fallback: si no hay variantes, aceptar sin props (puede ser componente sin variantes)
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(stripProps(k)) === normWithoutProps) return v;
    }
  }

  // 5. Solo el core name (sin grupo ni variantes)
  const coreName = extractCoreName(name);
  const coreNorm = normalizeStr(coreName);

  if (coreNorm.length >= 3) {
    // 5a. Exact core match — preferir entradas CON props (variantes importables)
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(extractCoreName(k)) === coreNorm && k.includes('·')) return v;
    }
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(extractCoreName(k)) === coreNorm) return v;
    }

    // 5b. Core como substring
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(k).includes(coreNorm) && k.includes('·')) return v;
    }
    for (const [k, v] of Object.entries(map)) {
      if (normalizeStr(k).includes(coreNorm)) return v;
    }
  }

  return null;
}

/**
 * Merge booleanProps del JSON v2.0 en el nombre del componente.
 * Si el nombre ya contiene la prop, no la duplica.
 * Ej: name="Title · Skeleton=No", booleanProps={"CTA": false}
 *     → "Title · Skeleton=No · CTA=No"
 */
function mergeBooleanPropsIntoName(name, booleanProps) {
  if (!booleanProps || typeof booleanProps !== 'object') return name;
  const existingProps = extractProps(name).map(p => p.split('=')[0].trim().toLowerCase());
  let merged = name;
  for (const [prop, value] of Object.entries(booleanProps)) {
    if (!existingProps.includes(prop.toLowerCase())) {
      merged += ` · ${prop}=${value ? 'Yes' : 'No'}`;
    }
  }
  return merged;
}

/**
 * Extrae las props de un nombre de componente.
 * "Title > Title · Skeleton=No · CTA=Yes" → ["Skeleton=No", "CTA=Yes"]
 */
function extractProps(name) {
  const parts = name.split('·').map(p => p.trim());
  // La primera parte es el nombre base, el resto son props
  return parts.slice(1).filter(p => p.includes('='));
}

/**
 * Normalización agresiva para matching:
 * - minúsculas
 * - elimina guiones bajos y guiones medios
 * - elimina contenido entre paréntesis
 * - elimina espacios
 * - elimina separadores · y >
 * - normaliza plurales antes de = (Sizes= → Size=)
 */
function normalizeStr(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')        // quitar (Cards), (Deprecated), etc.
    .replace(/[_\-]/g, ' ')         // guiones y underscores → espacio
    .replace(/\s+/g, '')            // eliminar todos los espacios
    .replace(/[·>]/g, '')           // eliminar separadores
    .replace(/ies=/g, 'y=')         // Categories= → Category= (plural irregular)
    .replace(/s=/g, '=')            // Sizes=, States= → Size=, State=
    .trim();
}

/**
 * Extrae solo el nombre del componente (sin grupo ni variantes/props).
 * "Atoms > Buttons · Size=Lg · State=Default" → "Buttons"
 * "Nav Bar · Type=Focus" → "Nav Bar"
 */
function extractCoreName(name) {
  const afterGroup = name.includes('>') ? name.split('>')[1] : name;
  return (afterGroup || name).split('·')[0].trim();
}

/**
 * Elimina las variantes/props de un nombre, dejando solo "Grupo > Nombre".
 * "Atoms > Button · Size=Lg · State=Default" → "Atoms > Button"
 */
function stripProps(name) {
  const parts = name.split('·');
  return parts[0].trim();
}

function addPlaceholder(frame, label, width) {
  const rect = figma.createRectangle();
  rect.resize(width, 56);
  rect.fills = [{
    type: 'SOLID',
    color: { r: 0.95, g: 0.94, b: 0.99 }
  }];
  rect.strokes = [{
    type: 'SOLID',
    color: { r: 0.6, g: 0.55, b: 0.95 }
  }];
  rect.strokeWeight = 1;
  rect.dashPattern = [4, 4];
  rect.name = `[PLACEHOLDER] ${label}`;
  frame.appendChild(rect);
}

/**
 * Convierte hex (#RRGGBB) a {r, g, b} normalizado (0–1) para Figma.
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

/**
 * Aplica sizing v2.0 a una instancia de componente.
 * sizing: { horizontal: "fill"|"hug"|"fixed", vertical: "fill"|"hug"|"fixed", width: px, height: px }
 */
function applySizing(instance, sizing) {
  if (!sizing || typeof sizing !== 'object') return;

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
}

/**
 * Aplica boolean props v2.0 a una instancia.
 * booleanProps: { "CTA": true, "Skeleton": false, ... }
 */
function applyBooleanProps(instance, booleanProps) {
  if (!booleanProps || typeof booleanProps !== 'object') return;
  try {
    const props = instance.componentProperties;
    for (const [propName, value] of Object.entries(booleanProps)) {
      for (const [key, prop] of Object.entries(props)) {
        const cleanKey = key.split('#')[0];
        if (cleanKey.toLowerCase() === propName.toLowerCase() && prop.type === 'BOOLEAN') {
          instance.setProperties({ [key]: value });
          break;
        }
      }
    }
  } catch (_) {}
}

/**
 * Inyecta texto por nombre de capa (v2.0).
 * textOverrides: { "Title": "Texto", "CTA/Label": "Ver más", ... }
 */
async function injectTextOverrides(instance, textOverrides) {
  if (!textOverrides || typeof textOverrides !== 'object') return;

  for (const [layerPath, text] of Object.entries(textOverrides)) {
    if (!text) continue;

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

/**
 * Aplica nestedSwaps v2.0 — intercambia instancias anidadas dentro de un componente.
 * Útil para logos de marca, iconos, etc. que son instance swaps y NO se controlan por variables.
 * nestedSwaps: { "Logo": "nombre-del-componente-en-mapa", "Icon": "otro-componente" }
 * Busca la prop de tipo INSTANCE_SWAP cuyo nombre coincida, luego importa el componente destino.
 */
async function applyNestedSwaps(instance, nestedSwaps, componentMap) {
  if (!nestedSwaps || typeof nestedSwaps !== 'object') return;
  try {
    const props = instance.componentProperties;
    for (const [swapPropName, targetComponentName] of Object.entries(nestedSwaps)) {
      // Buscar la prop INSTANCE_SWAP que matchee
      for (const [key, prop] of Object.entries(props)) {
        const cleanKey = key.split('#')[0];
        if (cleanKey.toLowerCase() === swapPropName.toLowerCase() && prop.type === 'INSTANCE_SWAP') {
          // Buscar el key del componente destino en el mapa
          const targetKey = findKey(targetComponentName, componentMap);
          if (targetKey) {
            try {
              const targetComp = await figma.importComponentByKeyAsync(targetKey);
              instance.setProperties({ [key]: targetComp.id });
            } catch (_) {}
          }
          break;
        }
      }
    }
  } catch (_) {}
}

/**
 * Inserta un spacer frame transparente para crear margen entre componentes.
 * Se usa con spacing.before / spacing.after del JSON v2.0.
 */
function insertSpacer(parentFrame, heightPx) {
  if (!heightPx || heightPx <= 0) return;
  const spacer = figma.createFrame();
  spacer.name = 'spacer-' + heightPx + 'px';
  spacer.resize(1, heightPx);
  spacer.fills = [];
  spacer.layoutSizingHorizontal = 'FILL';
  spacer.layoutSizingVertical = 'FIXED';
  parentFrame.appendChild(spacer);
}
