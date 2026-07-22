# discovery-agentico Plugin

Plugin de Claude para el proceso de UX Discovery + Diseño agéntico (S1–S6 + DS1–DS3).

## Estructura del repo

```
Plugins-Discoverydisenoagentico/
├── .github/
│   └── workflows/
│       └── notify-teams.yml    ← Notifica a Teams en cada release
├── discovery-agentico/         ← Fuente del plugin
│   ├── .claude-plugin/
│   │   └── plugin.json         ← Nombre, versión, descripción
│   └── skills/
│       ├── discovery-inicio/
│       ├── s1-product-strategy/
│       ├── s2-market-trends/
│       ├── s3-user-needs/
│       ├── s4-user-journey/
│       ├── s5-business-value/
│       ├── s6-pdr-synthesizer/
│       ├── diseno-inicio/
│       ├── ds1-wireframe-viability/
│       ├── ds2-wireframe-generator/
│       └── ds3-design-directions/
├── releases/                   ← Archivos .plugin empaquetados
├── version.json                ← Versión actual (consultado por el plugin para updates)
├── build.sh                    ← Script para empaquetar
└── .gitignore
```

## Publicar una nueva versión

```bash
# 1. Edita los skills en discovery-agentico/skills/
# 2. Empaqueta:
./build.sh 2.9.0

# 3. Commitea y tagea:
git add -A
git commit -m "release: v2.9.0"
git tag v2.9.0
git push && git push --tags

# 4. En GitHub: crea un Release desde el tag v2.9.0
#    - Adjunta releases/discovery-agentico-v2.9.0.plugin
#    - Escribe el changelog en la descripción
#    - Publica → GitHub Actions enviará la notificación a Teams ✅
```

## Configurar Teams (primera vez)

1. En Microsoft Teams, ve al canal donde quieres recibir notificaciones.
2. `···` → Connectors (o Flujos) → Busca **"Incoming Webhook"** → Configurar.
3. Copia la URL del webhook.
4. En GitHub → repo → Settings → Secrets and variables → Actions → New secret:
   - Nombre: `TEAMS_WEBHOOK_URL`
   - Valor: la URL copiada del paso 3.

## Configurar URL del repo en el plugin (chequeo de versiones)

En `discovery-agentico/skills/discovery-inicio/SKILL.md`, reemplaza:

```
https://raw.githubusercontent.com/erickbaeza-coder/Plugins-Discoverydisenoagentico/main/version.json
```

con la URL real de tu repo, por ejemplo:

```
https://raw.githubusercontent.com/erickbaeza-coder/Plugins-Discoverydisenoagentico/main/version.json
```

## Instalar el plugin en Claude

1. Descarga el `.plugin` desde la sección **Releases** de este repo.
2. En Claude Desktop: `Configuración → Plugins → Instalar plugin`.
3. Selecciona el archivo `.plugin` descargado.
