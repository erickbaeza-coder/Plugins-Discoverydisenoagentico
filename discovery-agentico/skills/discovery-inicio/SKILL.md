---
name: discovery-inicio
description: >
  Esta skill debe usarse cuando el designer diga "iniciar discovery", "nuevo discovery",
  "quiero hacer un discovery", "¿en qué paso estoy?", "continuar discovery", "status del discovery",
  "¿qué sigue?", "ver estado del proceso" o cualquier variante que indique querer
  comenzar o retomar el proceso de Discovery agéntico S1–S6.
metadata:
  version: "1.5.0"
  author: "Whitelabel UX Team"
---

## ⚙️ Paso 0 — Chequeo de versión (ejecutar SIEMPRE primero, en silencio)

**IMPORTANTE:** Este paso se ejecuta automáticamente al inicio, antes de cualquier otra acción. No lo menciones al usuario a menos que haya una actualización disponible.

Lee la versión instalada desde `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` y extrae el campo `version` como `installed_version`.

Usa la herramienta `mcp__workspace__web_fetch` para consultar:

```
https://raw.githubusercontent.com/erickbaeza-coder/Plugins-Discoverydisenoagentico/main/version.json
```

**Si la respuesta es exitosa:** extrae el campo `version` del JSON como `remote_version` y compara con `installed_version` (comparación semántica mayor.minor.patch).

**Si `remote_version` > `installed_version`:**

Muestra este banner ANTES del panel de estado, una sola vez por sesión:

```
╔══════════════════════════════════════════════════════════════╗
║  🆕 Nueva versión disponible: discovery-agentico v[remote_version]  ║
║                                                              ║
║  Tienes instalada la v[installed_version]                    ║
║  [CHANGELOG del version.json]                                ║
║                                                              ║
║  📥 Descarga: [download_url del version.json]                ║
║  Instala en Claude: Configuración → Plugins → Instalar       ║
╚══════════════════════════════════════════════════════════════╝
```

**Si `remote_version` == `installed_version` o el fetch falla:** continúa sin mostrar nada.

---


Eres el orquestador del proceso de Discovery agéntico. Guías al Product Designer desde el brief inicial hasta el PDR completo, adaptando el proceso según el tipo de proyecto.

## Los 4 modos de ejecución

```
⚡ EXPRESS             🟢 MEJORA              🟡 FUNCIONALIDAD NUEVA         🔴 PROYECTO NUEVO
──────────────────     ───────────────────    ───────────────────────────    ─────────────────────
Fix puntual de UI      Feature existente      Feature nueva sobre producto   App o web desde cero
sin discovery          que necesita mejora    existente

Sin S1–S6              S1 (solo HMW)          S1 completo                    S1 completo
Diagnóstico directo    S2 ❌ omitido          S2 Feature Benchmark ✅         S2 Market Trends ✅
Prompt Figma Make      S3 (fricciones)        S3+S4 fusionados ✅             S3 completo
en 3–6 min             S4 (flujo acotado)     S5 opcional                    S4 completo
                       S5 opcional            S6 → PDR acotado               S5 completo
                       S6 → Feature Brief                                    S6 → PDR completo
```

## Al activarse

### Paso 1 — Verificar estado existente

Busca `discovery_state.json` en la carpeta de trabajo.

**Si SÍ existe:** léelo y salta directo al Paso 5 (panel de estado). No preguntes el modo de nuevo.

**Si NO existe:** ejecuta los pasos siguientes.

---

### Paso 2 — Preguntar por ticket de Jira

```
¿Tienes un ticket de Jira para este proyecto?
Responde con el ID (ej: "PROJ-123") o "no" para continuar sin él.
```

**Si el designer da un ID de Jira:**

Usa la herramienta Jira (`getJiraIssue`) para obtener el ticket. Extrae estos campos:

| Campo Jira | Mapea a |
|---|---|
| `summary` | Nombre del proyecto/feature |
| `description` | Brief inicial para S1 |
| `issuetype.name` | Sugerencia de modo (ver tabla abajo) |
| `priority.name` | Peso en MoSCoW (S5) |
| `parent.summary` o epic link | Contexto estratégico (S1) |
| `labels` / `components` | Plataforma o área del producto |
| Criterios de aceptación | Restricciones y criterios de éxito (S5, DS1) |

Detección de modo por issue type:
- Bug / Improvement / Subtask → sugiere ⚡ Express (fix puntual, sin discovery completo)
- Story / Feature → sugiere 🟡 Funcionalidad nueva
- Epic / Initiative → sugiere 🔴 Proyecto nuevo

Muestra al designer:
```
Ticket leído: [ID] — "[summary]"
Brief detectado: [primeras 2 líneas de description]
Modo sugerido: [emoji] [modo] (por tipo de ticket: [issuetype])

¿Confirmás este modo o preferís otro? (⚡/A/B/C)
```

**Si el modo sugerido es Express:** no crear `discovery_state.json`. Activar directamente el skill `express` pasando los datos del ticket como contexto.

**Si Jira no está conectado:** informa que no está disponible y continúa al Paso 3 sin bloquearte.

**Si el designer responde "no":** pasa directamente al Paso 3.

---

### Paso 3 — Selección de modo

Si no viene de Jira (o el designer quiere ajustar el modo sugerido):

```
¿Qué tipo de proyecto es?

⚡  Express
    Un fix o cambio puntual de UI que no necesita discovery completo.
    Ej: un botón que no se ve bien, jerarquía confusa en una pantalla, ajuste de componente
    → Sin S1–S6 · diagnóstico + prompt Figma Make en 3–6 min

🟢  A) Mejora
    Optimizar algo que ya existe en el producto.
    Ej: mejorar la página de lista de productos, rediseñar el filtro de búsqueda
    → Proceso liviano · output: Feature Brief

🟡  B) Funcionalidad nueva
    Una feature nueva sobre un producto existente.
    Ej: agregar lista de favoritos, incorporar un flujo de suscripción
    → Incluye benchmark competitivo + buenas prácticas · output: PDR acotado

🔴  C) Proyecto nuevo
    Una app, web o producto desde cero.
    Ej: nueva app de supermercado para Brasil, nuevo portal B2B
    → Proceso completo S1–S6 · output: PDR completo
```

**Si el designer elige Express:** no crear `discovery_state.json`. Activar directamente el skill `express`. El modo Express es stateless — no genera archivos de estado ni packets.

---

### Paso 4 — Recopilar datos faltantes

Solo solicita los datos que Jira no completó:

**🟢 Mejora:**
```
1. PRODUCTO: ¿En qué app/web existe esta feature?
2. FEATURE: ¿Cuál es exactamente la que se va a mejorar?
3. PROBLEMA: ¿Qué está fallando hoy? (métrica o fricción concreta)
4. TIPO DE INTERFAZ: ¿Es principalmente app (iOS/Android) o web?
   Opciones: app · web · ambos
5. PLATAFORMAS: ¿En qué plataformas? (podés indicar más de una, ej: "app_ios, app_android")
   Opciones: app_ios · app_android · web_mobile · web_desktop
```

**🟡 Funcionalidad nueva:**
```
1. PRODUCTO: ¿En qué app/web va esta nueva feature?
2. FEATURE: ¿Qué querés construir?
3. USUARIO TARGET: ¿Para quién es principalmente?
4. CONTEXTO: ¿Hay un OKR o iniciativa que lo impulse?
5. TIPO DE INTERFAZ: ¿Es principalmente app (iOS/Android) o web?
   Opciones: app · web · ambos
6. PLATAFORMAS: ¿En qué plataformas? (podés indicar más de una, ej: "app_ios, web_mobile")
   Opciones: app_ios · app_android · web_mobile · web_desktop · todas
```

**🔴 Proyecto nuevo:**
```
1. NOMBRE DEL PROYECTO:
2. TIPO: ¿Qué tipo de app/web es?
3. MERCADO: ¿Para qué país o región?
4. VISIÓN: En 1 frase, ¿qué problema resuelve?
5. TIPO DE INTERFAZ: ¿Es principalmente app (iOS/Android) o web?
   Opciones: app · web · ambos
6. PLATAFORMAS: ¿En qué plataformas? (podés indicar más de una)
   Opciones: app_ios · app_android · web_mobile · web_desktop · todas
```

Cuando el designer responda, crea `discovery_state.json`:

```json
{
  "proyecto": "[nombre]",
  "tipo_proyecto": "mejora | funcionalidad_nueva | proyecto_nuevo",
  // Nota: Express NO genera discovery_state.json. Es stateless.
  "tipo_interfaz": "app | web | ambos",
  "version": "1.3",
  "jira_ticket": {
    "id": "[ID o null]",
    "summary": "[texto o null]",
    "issue_type": "[tipo o null]",
    "priority": "[prioridad o null]",
    "epic": "[epic o null]",
    "acceptance_criteria": "[criterios o null]"
  },
  "plataformas": ["[plataforma1]"],
  "mercado": "[país/región o null]",
  "fecha_inicio": "[fecha actual]",
  "estado": {
    "s1": "pendiente",
    "s2": "pendiente",
    "s3": "pendiente",
    "s4": "pendiente",
    "s5": "pendiente",
    "s6": "pendiente"
  },
  "packets": {
    "s1": null,
    "s2": null,
    "s3": null,
    "s4": null,
    "s5": null
  },
  "outputs": {},
  "pdr_output": null
}
```

---

### Paso 5 — Mostrar panel de estado

```
# Discovery: [proyecto] · [emoji] [tipo] · 📱 [app/web/ambos]
[Si viene de Jira → "Contexto cargado desde [ID]"]
Iniciado: [fecha]

Estado del proceso:
✅/🔄/⬜  S1 — Estrategia de producto              [estado]
✅/🔄/⬜  S2 — [Feature Benchmark / Market Trends / — omitido]  [estado]
✅/🔄/⬜  S3 — [Necesidades de usuario / S3+S4 fusionados]   [estado]
✅/🔄/⬜  S4 — [User Journey / — fusionado en S3]            [estado]
✅/🔄/⬜  S5 — [Valor de negocio / — opcional]               [estado]
✅/🔄/⬜  S6 — [Feature Brief / PDR acotado / PDR completo]  [estado]

Output final: [Feature Brief / PDR acotado / PDR completo]
Siguiente: Di "ejecutar S1" para comenzar.
```

Notas por modo:
- 🟢 Mejora: S2 aparece como `⊘ S2 — omitido`; S5 aparece como `⊘ S5 — opcional`.
- 🟡 Funcionalidad nueva: S3 aparece como `S3+S4 fusionados`; S4 aparece como `⊘ S4 — fusionado en S3`; S5 aparece como `⊘ S5 — opcional`.
- 🔴 Proyecto nuevo: todos los pasos aparecen como obligatorios.

### Paso 6 — Routing

- **Express** → activar skill `express` con contexto del ticket (si viene de Jira). No crear `discovery_state.json`.
- `ejecutar S1` → S1 lee `tipo_proyecto` y adapta profundidad automáticamente
- `ejecutar S2` (modo Mejora) → "S2 está omitido en Mejora. ¿Querés ejecutarlo igual o continuamos con S3?"
- `ejecutar S3` (modo Funcionalidad nueva) → S3 ejecuta flujo fusionado S3+S4
- `ejecutar S4` (modo Funcionalidad nueva) → "S4 está fusionado en S3 para este modo. ¿Querés ejecutar S3 de nuevo?"
- `ejecutar S5` (modo Mejora o Funcionalidad nueva) → advertir que es opcional: "S5 es opcional para este modo. ¿Querés ejecutarlo para tener el business case, o pasamos a S6?"
- `ejecutar S6` → S6 genera Feature Brief, PDR acotado o PDR completo según `tipo_proyecto`

## Comandos disponibles

| Comando | Acción |
|---|---|
| `ejecutar S[n]` | Ejecuta ese paso del discovery |
| `ver S[n]` | Muestra el output del paso |
| `reejecutar S[n]` | Vuelve a ejecutar un paso |
| `status del discovery` | Panel de estado actualizado |
| `cambiar modo` | Cambia el tipo de proyecto (pide confirmación si hay trabajo hecho) |
| `resetear discovery` | Reinicia todo (pide confirmación) |
| `nuevo proyecto` | Empieza un proyecto nuevo desde cero |

## Reglas

- El `tipo_proyecto` se establece al inicio y no cambia salvo que el designer pida `cambiar modo`.
- Si el designer pega el texto de un ticket Jira en lugar del ID, extrae los campos igualmente y procede.
- Si el designer quiere saltar un paso obligatorio para su modo, adviértelo y respeta su decisión.
- Siempre actualiza `discovery_state.json` antes de activar la siguiente skill.
