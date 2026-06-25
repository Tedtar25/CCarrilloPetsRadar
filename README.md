# PetRadar API

API desarrollada con NestJS para registrar mascotas perdidas y mascotas vistas/encontradas. La aplicación guarda coordenadas en PostgreSQL/PostGIS y puede enviar una notificación por correo cuando una mascota vista está cerca de una mascota perdida activa.

## Tecnologías

- NestJS
- PostgreSQL con PostGIS
- TypeORM
- Redis para caché
- Nodemailer para notificaciones opcionales
- Docker

## Endpoints Principales

### Salud de la API

```http
GET /health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "pet-radar-api",
  "timestamp": "2026-06-24T00:00:00.000Z"
}
```

### Listar mascotas perdidas activas

```http
GET /lost-pets
```

### Registrar mascota perdida

```http
POST /lost-pets
Content-Type: application/json
```

```json
{
  "name": "Max",
  "latitude": 21.123,
  "longitude": -101.684
}
```

### Listar mascotas vistas/encontradas

```http
GET /found-pets
```

### Registrar mascota vista/encontrada

```http
POST /found-pets
Content-Type: application/json
```

```json
{
  "latitude": 21.1231,
  "longitude": -101.6841,
  "notes": "Mascota vista cerca del parque"
}
```

Si la ubicación está cerca de una mascota perdida activa, la API devuelve las posibles coincidencias y, si el correo está configurado, envía una notificación.

## Variables De Entorno

Variables obligatorias para base de datos:

```env
PORT=3000
DB_HOST=tu-host-postgres
DB_PORT=5432
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=tu-base
DB_SSL=true
```

Redis puede configurarse con URL completa, recomendado para Upstash:

```env
REDIS_URL=rediss://default:password@host:6379
```

O con host, puerto y password:

```env
REDIS_HOST=tu-host-redis
REDIS_PORT=6379
REDIS_PASSWORD=tu-password
```

Correo opcional:

```env
MAILER_EMAIL=correo@gmail.com
MAILER_PASSWORD=password-o-app-password
MAILER_SERVICE=gmail
```

Mapbox es opcional en esta versión:

```env
MAPBOX_TOKEN=token
```

## Desarrollo Local

Instalar dependencias:

```bash
npm install
```

Levantar servicios locales con Docker:

```bash
docker compose up --build
```

Ejecutar en modo desarrollo:

```bash
npm run start:dev
```

## Despliegue Recomendado

Para la entrega del curso se puede usar:

- API en Render
- Base de datos PostgreSQL en Supabase
- Redis en Upstash

### Supabase

Crear un proyecto PostgreSQL y activar PostGIS desde el SQL editor:

```sql
create extension if not exists postgis;
```

Copiar los datos de conexión y configurar en Render las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_SSL=true`.

### Upstash

Crear una base Redis y copiar la conexión `REDIS_URL`. Usar la URL con protocolo `rediss://`.

### Render

Crear un Web Service conectado al repositorio de GitHub.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start:prod
```

Agregar las variables de entorno de Supabase, Upstash y, si se desea, correo.

## Verificación Para Entrega

Una vez desplegada la API, probar:

```http
GET https://tu-api.onrender.com/health
```

Después registrar un dato real:

```http
POST https://tu-api.onrender.com/lost-pets
```

Y comprobar que viene desde la base de datos en línea:

```http
GET https://tu-api.onrender.com/lost-pets
```

Este último endpoint sirve como endpoint público de lectura para el entregable.

## Scripts

```bash
npm run build
npm run start:prod
npm run test
```
