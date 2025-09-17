# BigQuery Setup Guide

## Paso 1: Configurar Google Cloud Project

### 1.1 Crear/Verificar Proyecto
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto o seleccionar existente
3. Anota el **Project ID** (no el nombre, el ID único)

### 1.2 Habilitar BigQuery API
1. Ve a APIs & Services → Library
2. Busca "BigQuery API"
3. Click "Enable"

## Paso 2: Crear Service Account

### 2.1 Crear Service Account
1. Ve a IAM & Admin → Service Accounts
2. Click "Create Service Account"
3. Nombre: `hybe-analytics-service`
4. Description: `Service account for HYBE analytics dashboard`

### 2.2 Asignar Roles
Agregar estos roles:
- `BigQuery Data Viewer`
- `BigQuery Job User`

### 2.3 Crear Key
1. Click en el service account creado
2. Ve a "Keys" tab
3. Click "Add Key" → "Create new key"
4. Selecciona JSON
5. Descarga el archivo JSON

## Paso 3: Configurar Variables de Entorno

### 3.1 Extraer Información del JSON
Del archivo JSON descargado, necesitas:
- `client_email`
- `private_key`

### 3.2 Configurar .env
```bash
BIGQUERY_PROJECT_ID=tu-project-id-aqui
BIGQUERY_DATASET_ID=analytics
BIGQUERY_TABLE_ID=social_metrics
BIGQUERY_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
BIGQUERY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----"
```

## Paso 4: Estructura de Datos Esperada

### 4.1 Tabla en BigQuery
```sql
CREATE TABLE `tu-project.analytics.social_metrics` (
  project STRING,           -- 'palf', 'stbv', 'bts', etc.
  platform STRING,         -- 'facebook', 'instagram', 'twitter', etc.
  total_followers INT64,
  engagement_rate FLOAT64,
  reach INT64,
  impressions INT64,
  created_at TIMESTAMP
);
```

### 4.2 Datos de Ejemplo
```sql
INSERT INTO `tu-project.analytics.social_metrics` VALUES
('palf', 'facebook', 2400000, 4.8, 18200000, 45600000, CURRENT_TIMESTAMP()),
('palf', 'instagram', 1800000, 6.2, 12500000, 32100000, CURRENT_TIMESTAMP()),
('bts', 'twitter', 45600000, 3.2, 89200000, 156700000, CURRENT_TIMESTAMP());
```

## Paso 5: Testing

### 5.1 Verificar Conexión
1. Instalar dependencias: `npm install @google-cloud/bigquery`
2. Configurar variables de entorno
3. Probar endpoint: `/api/bigquery/kpis?project=palf&platform=facebook`

### 5.2 Troubleshooting
- Verificar que el service account tenga permisos
- Verificar que las variables de entorno estén correctas
- Verificar que la tabla exista y tenga datos