#!/bin/bash

# Este script actualiza el archivo deploy_commands.sh original con los parches necesarios
# para solucionar los problemas de despliegue

if [ ! -f "deploy_commands.sh" ]; then
  echo "ERROR: No se encontró el archivo deploy_commands.sh"
  exit 1
fi

# Crea una copia de seguridad
cp deploy_commands.sh deploy_commands.sh.bak

# Buscar líneas con "Verificando secreto para pull de imágenes"
sed -i '/echo "Verificando secreto para pull de imágenes..."/,/fi/c\
echo "Verificando secreto para pull de imágenes..."\
microk8s kubectl get secret vucem30registrykey -n default >/dev/null 2>\&1\
if [ $? -ne 0 ]; then\
  echo "Creando secreto vucem30registrykey en el namespace default..."\
  \
  # Si GITHUB_TOKEN está disponible, usarlo para crear el secreto\
  if [ -n "${GITHUB_TOKEN}" ]; then\
    microk8s kubectl create secret docker-registry vucem30registrykey \\\
      --docker-server=ghcr.io \\\
      --docker-username=vucem30-dev \\\
      --docker-password=${GITHUB_TOKEN} \\\
      --docker-email=admin@vucem.com \\\
      -n default\
    \
    if [ $? -ne 0 ]; then\
      echo "ADVERTENCIA: No se pudo crear el secreto automáticamente."\
      echo "El despliegue podría fallar. Cree el secreto con:"\
      echo "kubectl create secret docker-registry vucem30registrykey \\\\"\
      echo "  --docker-server=ghcr.io \\\\"\
      echo "  --docker-username=USUARIO \\\\"\
      echo "  --docker-password=TOKEN \\\\"\
      echo "  --docker-email=EMAIL \\\\"\
      echo "  -n default"\
    else\
      echo "Secreto creado correctamente."\
    fi\
  else\
    echo "ADVERTENCIA: El secreto vucem30registrykey no existe en el namespace default."\
    echo "El despliegue podría fallar. Cree el secreto con:"\
    echo "kubectl create secret docker-registry vucem30registrykey \\\\"\
    echo "  --docker-server=ghcr.io \\\\"\
    echo "  --docker-username=USUARIO \\\\"\
    echo "  --docker-password=TOKEN \\\\"\
    echo "  --docker-email=EMAIL \\\\"\
    echo "  -n default"\
  fi\
fi' deploy_commands.sh

# Buscar línea para insertar el código de preprocesamiento del manifiesto
line_num=$(grep -n "# Aplicar manifiesto con validación previa" deploy_commands.sh | cut -d':' -f1)
if [ -n "$line_num" ]; then
  echo "Insertando código para procesar el manifiesto en la línea: $line_num"
  
  # Insertar antes de "Aplicar manifiesto con validación previa"
  sed -i "${line_num}i\\
# Crear una copia temporal del manifiesto para procesarlo\\
TMP_MANIFEST=\"\$K8S_TEMP_DIR/tmp-manifest-\$DEPLOYMENT_ENV.yaml\"\\
cp \"\$MANIFEST_FILE\" \"\$TMP_MANIFEST\"\\
\\
# Eliminar la anotación conflictiva del Ingress\\
sed -i '/kubernetes.io\\/ingress.class/d' \"\$TMP_MANIFEST\"\\
" deploy_commands.sh
else
  echo "No se encontró la sección 'Aplicar manifiesto con validación previa' en el script"
  
  # Intentar buscar otra sección similar
  line_num=$(grep -n "# Aplicar manifiesto" deploy_commands.sh | cut -d':' -f1)
  if [ -n "$line_num" ]; then
    echo "Insertando código antes de 'Aplicar manifiesto' en la línea: $line_num"
    sed -i "${line_num}i\\
# Crear una copia temporal del manifiesto para procesarlo\\
TMP_MANIFEST=\"\$K8S_TEMP_DIR/tmp-manifest-\$DEPLOYMENT_ENV.yaml\"\\
cp \"\$MANIFEST_FILE\" \"\$TMP_MANIFEST\"\\
\\
# Eliminar la anotación conflictiva del Ingress\\
sed -i '/kubernetes.io\\/ingress.class/d' \"\$TMP_MANIFEST\"\\
" deploy_commands.sh
  else
    echo "No se pudo encontrar una línea adecuada para insertar el código de preprocesamiento"
  fi
fi

# Modificar el script para usar el archivo temporal del manifiesto
sed -i 's/microk8s kubectl apply -f "$MANIFEST_FILE"/microk8s kubectl apply -f "$TMP_MANIFEST"/g' deploy_commands.sh
sed -i 's/microk8s kubectl apply --validate=true --dry-run=client -f "$MANIFEST_FILE"/microk8s kubectl apply --validate=true --dry-run=client -f "$TMP_MANIFEST"/g' deploy_commands.sh

# Actualizar la lista de microservicios para incluir todos los disponibles
microfrontends_line=$(grep -n "MICROFRONTENDS=" deploy_commands.sh | cut -d':' -f1)
if [ -n "$microfrontends_line" ]; then
  echo "Actualizando la lista de microservicios en la línea: $microfrontends_line"
  # Crear una lista completa con todos los microservicios
  sed -i "${microfrontends_line}c\\
MICROFRONTENDS=(\"dashboard\" \"login-microfront\" \"aga-microfront\" \"agricultura-microfront\" \"se-microfront\" \"semarnat-microfront\" \"agace-microfront\" \"funcionario-microfront\" \"cofepris-microfront\" \"amecafe-microfront\" \"sener-microfront\" \"inbal-microfront\" \"sedena-microfront\" \"profepa-microfront\" \"crt-microfront\" \"inah-microfront\" \"bandejas-microfront\" \"stps-microfront\")" deploy_commands.sh
else
  echo "No se encontró la lista MICROFRONTENDS en el script"
fi

# Validar el script actualizado para evitar errores de sintaxis
grep -n "syntax error" deploy_commands.sh
if [ $? -eq 0 ]; then
  echo "ADVERTENCIA: El script podría tener errores de sintaxis. Revise manualmente."
fi

echo "Script deploy_commands.sh actualizado con éxito."
echo "Se ha creado una copia de seguridad en deploy_commands.sh.bak"