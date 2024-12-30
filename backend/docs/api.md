# DevToolbox API Documentation

## UUID Generator API

### Generate UUID
Generate a single UUID with specified version.

**Endpoint:** `POST /api/uuid/generate`

**Request Body:**
```json
{
  "version": "v1" | "v4" | "v5" | "nil",
  "namespace": "string", // Required for v5
  "name": "string",     // Required for v5
  "startTime": "string" // Optional for v1, ISO date string
}
```

**Response:**
```json
{
  "result": "string" // The generated UUID
}
```

### Generate Bulk UUIDs
Generate multiple UUIDs at once.

**Endpoint:** `POST /api/uuid/bulk`

**Request Body:**
```json
{
  "version": "v1" | "v4" | "v5" | "nil",
  "count": number,      // Number of UUIDs to generate
  "namespace": "string", // Required for v5
  "name": "string"      // Required for v5
}
```

**Response:**
```json
{
  "results": string[] // Array of generated UUIDs
}
```

### Generate Sequential UUIDs
Generate multiple v1 UUIDs with sequential timestamps.

**Endpoint:** `POST /api/uuid/sequential`

**Request Body:**
```json
{
  "count": number,      // Number of UUIDs to generate
  "startTime": "string" // Optional, ISO date string
}
```

**Response:**
```json
{
  "results": string[] // Array of sequential v1 UUIDs
}
```

### Get UUID Information
Validate and get information about a UUID.

**Endpoint:** `POST /api/uuid/info`

**Request Body:**
```json
{
  "uuid": "string" // The UUID to validate
}
```

**Response:**
```json
{
  "isValid": boolean,
  "version": number | null,
  "variant": string | null,
  "timestamp": string | null, // For v1 UUIDs
  "isNil": boolean
}
```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Error message describing the issue"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Usage Examples

### Generate a v4 UUID
```bash
curl -X POST http://localhost:3000/api/uuid/generate \
  -H "Content-Type: application/json" \
  -d '{"version": "v4"}'
```

### Generate a v5 UUID
```bash
curl -X POST http://localhost:3000/api/uuid/generate \
  -H "Content-Type: application/json" \
  -d '{
    "version": "v5",
    "namespace": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "example.com"
  }'
```

### Generate Multiple v4 UUIDs
```bash
curl -X POST http://localhost:3000/api/uuid/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "version": "v4",
    "count": 5
  }'
```

### Validate a UUID
```bash
curl -X POST http://localhost:3000/api/uuid/info \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "550e8400-e29b-41d4-a716-446655440000"
  }'
``` 