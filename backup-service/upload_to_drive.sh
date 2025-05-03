
#!/bin/bash

# Subir el respaldo a Google Drive usando la API
# Se asume que tienes un token de acceso válido para Google Drive API
ACCESS_TOKEN=$(curl -s -X POST -d "client_id=your-client-id&client_secret=your-client-secret&refresh_token=your-refresh-token&grant_type=refresh_token" https://oauth2.googleapis.com/token)

# Subir el archivo de respaldo
curl -X POST -L   -H "Authorization: Bearer $ACCESS_TOKEN"   -F "file=@/backup/all_databases_$(date +%F).sql"   "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
