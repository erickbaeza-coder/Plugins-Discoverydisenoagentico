#!/usr/bin/env bash
# ─────────────────────────────────────────────
# build.sh — Empaqueta discovery-agentico como .plugin
# Uso: ./build.sh [version]
# Ejemplo: ./build.sh 2.9.0
# ─────────────────────────────────────────────
set -e

VERSION=${1:-$(python3 -c "import json; print(json.load(open('version.json'))['version'])")}
PLUGIN_NAME="discovery-agentico"
OUTPUT_FILE="${PLUGIN_NAME}-v${VERSION}.plugin"

echo "📦 Empaquetando ${PLUGIN_NAME} v${VERSION}..."

# Verificar que existe la carpeta fuente
if [ ! -d "./${PLUGIN_NAME}" ]; then
  echo "❌ Error: No se encontró la carpeta ./${PLUGIN_NAME}/"
  echo "   Asegúrate de ejecutar este script desde la raíz del repo."
  exit 1
fi

# Actualizar versión en plugin.json
python3 -c "
import json
path = './${PLUGIN_NAME}/.claude-plugin/plugin.json'
with open(path, 'r') as f:
    data = json.load(f)
data['version'] = '${VERSION}'
with open(path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print(f'✅ plugin.json actualizado a v${VERSION}')
"

# Crear directorio de releases si no existe
mkdir -p releases

# Empaquetar
cd ..
zip -r "Plugins-Discoverydisenoagentico/releases/${OUTPUT_FILE}" \
    "Plugins-Discoverydisenoagentico/${PLUGIN_NAME}/" \
    --exclude "*/.DS_Store" \
    --exclude "*/node_modules/*" \
    --exclude "*/.git/*"

cd Plugins-Discoverydisenoagentico

echo ""
echo "✅ Plugin empaquetado: releases/${OUTPUT_FILE}"
echo ""
echo "Próximos pasos:"
echo "  1. git add -A"
echo "  2. git commit -m 'release: v${VERSION}'"
echo "  3. git tag v${VERSION}"
echo "  4. git push && git push --tags"
echo "  5. En GitHub → Releases → Draft a new release → Selecciona el tag v${VERSION}"
echo "  6. Sube releases/${OUTPUT_FILE} como archivo adjunto"
echo "  7. Publica el release → GitHub Actions notificará a Teams automáticamente 🚀"
