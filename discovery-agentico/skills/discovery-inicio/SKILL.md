---
name: discovery-inicio
description: >
  Esta skill debe usarse cuando el designer diga "iniciar discovery", "nuevo discovery",
  "quiero hacer un discovery", "¿en qué paso estoy?", "continuar discovery", "status del discovery",
  "¿qué sigue?", "ver estado del proceso" o cualquier variante que indique querer
  comenzar o retomar el proceso de Discovery agéntico S1–S6.
metadata:
  version: "1.2.0"
  author: "Whitelabel UX Team"
---

## ⚙️ Paso 0 — Chequeo de versión (ejecutar SIEMPRE primero, en silencio)

**IMPORTANTE:** Este paso se ejecuta automáticamente al inicio, antes de cualquier otra acción. No lo menciones al usuario a menos que haya una actualización disponible.

Usa la herramienta `mcp__workspace__web_fetch` para consultar:

```
https://raw.githubusercontent.com/erickbaeza-coder/Plugins-Discoverydisenoagentico/main/version.json
```

> ⚠️ Reemplaza `GITHUB_ORG/GITHUB_REPO` con el valor real del repositorio configurado.

**Si la respuesta es exitosa:** extrae el campo `version` del JSON y compáralo con la versión instalada del plugin: `2.8.0`

**Si `remote_version` > `2.8.0`** (comparación semántica mayor.minor.patch):

Muestra este banner ANTES del panel de estado, una sola vez por sesión:

```
╔══════════════════════════════════════════════════════════════╗
║  🆕 Nueva versión disponible: discovery-agentico v[VERSION]  ║
║                                                              ║
║  Tienes instalada la v2.8.0                                  ║
║  [CHANGELOG del version.json]                                ║
║                                                              ║
║  📥 Descarga: [download_url del version.json]                ║
║  Instala en Claude: Configuración → Plugins → Instalar       ║
╚══════════════════════════════════════════════════════════════╝
```

**Si `remote_version` == `2.8.0` o el fetch falla:** continúa sin mostrar nada.

---


Eres el orquestador del proceso de Discovery agéntico. Guías al Product Designer desde el brief inicial hasta el PDR completo, adaptando el proceso según el tipo de proyecto.

## Los 3 modos de ejecución

```
🟢 MEJORA              🟡 FUNCIONALIDAD NUEVA         🔴 PROYECTO NUEVO
───────────────────    ───────────────────────────    ─────────────────────
Feature existente      Feature nueva sobre producto   App o web desde cero
que necesita           existente

S1 (solo HMW)          S1 completo                    S1 completo
S2 ❌ omitido          S2 Feature Benchmark ✅         S2 Market Trends ✅
S3 (fricciones)        S3 completo                    S3 completo
S4 (flujo acotado)     S4 completo                    S4 completo
S5 (impacto solo)      S5 completo                    S5 completo
S6 → Feature Brief     S6 → PDR acotado               S6 → PDR completo
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
- Story / Feature → sugiere 🟡 Funcionalidad nueva
- Bug / Improvement / Subtask → sugiere 🟢 Mejora
- Epic / Initiative → sugiere 🔴 Proyecto nuevo

Muestra al designer:
```
Ticket leído: [ID] — "[summary]"
Brief detectado: [primeras 2 líneas de description]
Modo sugerido: [emoji] [modo] (por tipo de ticket: [issuetype])

¿Confirmás este modo o preferís otro? (A/B/C)
```

**Si Jira no está conectado:** informa que no está disponible y continúa al Paso 3 sin bloquearte.

**Si el designer responde "no":** pasa directamente al Paso 3.

---

### Paso 3 — Selección de modo

Si no viene de Jira (o el designer quiere ajustar el modo sugerido):

```
¿Qué tipo de proyecto es?

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

---

### Paso 4 — Recopilar datos faltantes

Solo solicita los datos que Jira no completó:

**🟢 Mejora:**
```
1. PRODUCTO: ¿En qué app/web existe esta feature?
2. FEATURE: ¿Cuál es exactamente la que se va a mejorar?
3. PROBLEMA: ¿Qué está fallando hoy? (métrica o fricción concreta)
4. PLATAFORMA: [app_ios | app_android | web_mobile | web_desktop]
```

**🟡 Funcionalidad nueva:**
```
1. PRODUCTO: ¿En qué app/web va esta nueva feature?
2. FEATURE: ¿Qué querés construir?
3. USUARIO TARGET: ¿Para quién es principalmente?
4. CONTEXTO: ¿Hay un OKR o iniciativa que lo impulse?
5. PLATAFORMA: [app_ios | app_android | web_mobile | web_desktop | todas]
```

**🔴 Proyecto nuevo:**
```
1. NOMBRE DEL PROYECTO:
2. TIPO: ¿Qué tipo de app/web es?
3. MERCADO: ¿Para qué país o región?
4. VISIÓN: En 1 frase, ¿qué problema resuelve?
5. PLATAFORMA: [app_ios | app_android | web | todas]
```

Cuando el designer responda, crea `discovery_state.json`:

```json
{
  "proyecto": "[nombre]",
  "tipo_proyecto": "mejora | funcionalidad_nueva | proyecto_nuevo",
  "version": "1.2",
  "jira_ticket": {
    "id": "[ID o null]",
    "summary": "[texto o null]",
    "issue_type": "[tipo o null]",
    "priority": "[prioridad o null]",
    "epic": "[epic o null]",
    "acceptance_criteria": "[criterios o null]"
  },
  "plataforma": "[plataforma]",
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
# Discovery: [proyecto] · [emoji] [tipo]
[Si viene de Jira → "Contexto cargado desde [ID]"]
Iniciado: [fecha]

Estado del proceso:
✅/🔄/⬜  S1 — Estrategia de producto              [estado]
✅/🔄/⬜  S2 — [Feature Benchmark / Market Trends / — omitido]  [estado]
✅/🔄/⬜  S3 — Necesidades de usuario              [estado]
✅/🔄/⬜  S4 — User Journey                        [estado]
✅/🔄/⬜  S5 — Valor de negocio                    [estado]
✅/🔄/⬜  S6 — [Feature Brief / PDR acotado / PDR completo]  [estado]

Output final: [Feature Brief / PDR acotado / PDR completo]
Siguiente: Di "ejecutar S1" para comenzar.
```

En modo 🟢 Mejora, S2 aparece como `⊘ S2 — omitido en modo Mejora`.

### Paso 6 — Routing

- `ejecutar S1` → S1 lee `tipo_proyecto` y adapta profundidad automáticamente
- `ejecutar S2` (modo Mejora) → "S2 está omitido en Mejora. ¿Querés ejecutarlo igual o continuamos con S3?"
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
