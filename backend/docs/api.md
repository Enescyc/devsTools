# DevToolbox API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All API endpoints are currently public. Rate limiting is applied to prevent abuse.

## Common Headers
```
Content-Type: application/json
Accept: application/json
```

## Rate Limiting
- Default: 100 requests per minute per IP
- Bulk operations: 20 requests per minute per IP
- Headers returned:
  ```
  X-RateLimit-Limit: [requests_per_window]
  X-RateLimit-Remaining: [remaining_requests]
  X-RateLimit-Reset: [unix_timestamp]
  ```

## Error Responses
All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Detailed error message"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 30
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error"
  }
}
```

## Endpoints

### JSON Tools

#### Format JSON
Format and validate JSON input.

**Endpoint:** `POST /json/format`

**Request Body:**
```json
{
  "input": "string",
  "indentSize": number,
  "sortKeys": boolean
}
```

**Response:**
```json
{
  "result": "string",
  "isValid": boolean,
  "errors": [
    {
      "line": number,
      "column": number,
      "message": "string"
    }
  ]
}
```

#### Minify JSON
Minify JSON by removing whitespace and comments.

**Endpoint:** `POST /json/minify`

**Request Body:**
```json
{
  "input": "string"
}
```

**Response:**
```json
{
  "result": "string"
}
```

### Text Tools

#### Convert Case
Convert text between different case formats.

**Endpoint:** `POST /text/convert-case`

**Request Body:**
```json
{
  "input": "string",
  "format": "camel" | "snake" | "kebab" | "pascal" | "constant"
}
```

**Response:**
```json
{
  "result": "string"
}
```

#### Escape/Unescape String
Escape or unescape strings for different formats.

**Endpoint:** `POST /text/escape`

**Request Body:**
```json
{
  "input": "string",
  "mode": "html" | "javascript" | "url" | "base64",
  "operation": "encode" | "decode"
}
```

**Response:**
```json
{
  "result": "string"
}
```

### UUID Tools

#### Generate UUID
Generate a single UUID with specified version.

**Endpoint:** `POST /uuid/generate`

**Request Body:**
```json
{
  "version": "v1" | "v4" | "v5" | "nil",
  "namespace": "string",  // Required for v5
  "name": "string",      // Required for v5
  "startTime": "string"  // Optional for v1, ISO date string
}
```

**Response:**
```json
{
  "result": "string"  // The generated UUID
}
```

#### Generate Bulk UUIDs
Generate multiple UUIDs at once.

**Endpoint:** `POST /uuid/bulk`

**Request Body:**
```json
{
  "version": "v1" | "v4" | "v5" | "nil",
  "count": number,       // Number of UUIDs to generate
  "namespace": "string", // Required for v5
  "name": "string"      // Required for v5
}
```

**Response:**
```json
{
  "results": string[]  // Array of generated UUIDs
}
```

#### Generate Sequential UUIDs
Generate multiple v1 UUIDs with sequential timestamps.

**Endpoint:** `POST /uuid/sequential`

**Request Body:**
```json
{
  "count": number,       // Number of UUIDs to generate
  "startTime": "string"  // Optional, ISO date string
}
```

**Response:**
```json
{
  "results": string[]  // Array of sequential v1 UUIDs
}
```

#### Validate UUID
Validate and get information about a UUID.

**Endpoint:** `POST /uuid/info`

**Request Body:**
```json
{
  "uuid": "string"  // The UUID to validate
}
```

**Response:**
```json
{
  "isValid": boolean,
  "version": number | null,
  "variant": string | null,
  "timestamp": string | null,  // For v1 UUIDs
  "isNil": boolean
}
```

### Timestamp Tools

#### Convert Timestamp
Convert between different timestamp formats.

**Endpoint:** `POST /timestamp/convert`

**Request Body:**
```json
{
  "input": "string",
  "inputFormat": "unix" | "iso" | "custom",
  "outputFormat": "unix" | "iso" | "custom",
  "customFormat": "string"  // Required if format is "custom"
}
```

**Response:**
```json
{
  "result": "string",
  "unix": number,
  "iso": "string"
}
```

## Code Examples

### JavaScript/TypeScript
```typescript
// Format JSON
const formatJSON = async (input: string) => {
  const response = await fetch('http://localhost:3000/api/json/format', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });
  return response.json();
};

// Generate UUID
const generateUUID = async (version = 'v4') => {
  const response = await fetch('http://localhost:3000/api/uuid/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version }),
  });
  return response.json();
};
```

### Python
```python
import requests

def format_json(input_str: str) -> dict:
    response = requests.post(
        'http://localhost:3000/api/json/format',
        json={'input': input_str}
    )
    return response.json()

def generate_uuid(version: str = 'v4') -> dict:
    response = requests.post(
        'http://localhost:3000/api/uuid/generate',
        json={'version': version}
    )
    return response.json()
```

### cURL
```bash
# Format JSON
curl -X POST http://localhost:3000/api/json/format \
  -H "Content-Type: application/json" \
  -d '{"input": "{\"key\": \"value\"}"}'

# Generate UUID
curl -X POST http://localhost:3000/api/uuid/generate \
  -H "Content-Type: application/json" \
  -d '{"version": "v4"}'
``` 