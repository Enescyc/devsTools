# UUID Generator API Code Examples

This directory contains code examples for interacting with the UUID Generator API in various programming languages and tools. The examples demonstrate how to generate UUIDs, perform bulk generation, and validate UUIDs using the API endpoints.

## API Base URL

All examples use the following base URL:
```
http://localhost:3000/api
```

## Available Endpoints

1. Generate UUID
   - Endpoint: `/uuid/generate`
   - Method: `POST`
   - Parameters:
     - `version` (string): UUID version (v1, v3, v4, v5)
     - `namespace` (string, optional): Required for v3 and v5
     - `name` (string, optional): Required for v3 and v5
   - Response:
     ```json
     {
       "result": "123e4567-e89b-12d3-a456-426614174000"
     }
     ```

2. Generate Multiple UUIDs
   - Endpoint: `/uuid/bulk`
   - Method: `POST`
   - Parameters:
     - `version` (string): UUID version (v1, v3, v4, v5)
     - `count` (number): Number of UUIDs to generate
     - `namespace` (string, optional): Required for v3 and v5
     - `name` (string, optional): Required for v3 and v5
   - Response:
     ```json
     {
       "results": [
         "123e4567-e89b-12d3-a456-426614174000",
         "987fcdeb-51a2-43fe-ba98-765432109876",
         ...
       ]
     }
     ```

3. Validate UUID
   - Endpoint: `/uuid/info`
   - Method: `POST`
   - Parameters:
     - `uuid` (string): UUID to validate
   - Response:
     ```json
     {
       "isValid": true,
       "version": "v4",
       "variant": "RFC4122",
       "isNil": false,
       "timestamp": "2023-11-15T12:34:56.789Z",
       "namespace": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
       "name": "example.com"
     }
     ```

## Response Formats

### Success Responses

All successful responses have a 200 OK status code and return JSON data. The format varies by endpoint:

1. Single UUID Generation
```json
{
  "result": "123e4567-e89b-12d3-a456-426614174000"
}
```

2. Bulk UUID Generation
```json
{
  "results": [
    "123e4567-e89b-12d3-a456-426614174000",
    "987fcdeb-51a2-43fe-ba98-765432109876",
    ...
  ]
}
```

3. UUID Validation
```json
{
  "isValid": true,
  "version": "v4",
  "variant": "RFC4122",
  "isNil": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "namespace": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "name": "example.com"
}
```

### Error Responses

Error responses have appropriate HTTP status codes and include an error message:

```json
{
  "error": {
    "code": "INVALID_UUID",
    "message": "The provided UUID is not valid"
  }
}
```

Common error codes:
- `INVALID_UUID`: The UUID format is invalid
- `INVALID_VERSION`: Unsupported UUID version
- `MISSING_PARAMS`: Required parameters are missing
- `INVALID_NAMESPACE`: Invalid namespace UUID for v3/v5
- `SERVER_ERROR`: Internal server error

## Code Examples

The repository includes examples in the following languages and tools:

1. JavaScript/TypeScript
   - Using Fetch API
   - Using Axios

2. Python
   - Using requests

3. Java
   - Using Spring WebClient

4. Go
   - Using net/http

5. Ruby
   - Using Net::HTTP

6. C#
   - Using HttpClient

7. PHP
   - Using Guzzle

8. Rust
   - Using reqwest

9. Shell Scripts
   - Using curl
   - Using wget
   - Using httpie

## Using the Examples

1. Choose your preferred programming language or tool from the `code-examples.md` file.
2. Copy the relevant code example to your project.
3. Install any required dependencies mentioned in the code.
4. Update the `BASE_URL` constant if your API is hosted at a different location.
5. Use the provided functions to interact with the API.

## Example Usage

Here's a quick example using the JavaScript Fetch API:

```javascript
// Generate a v4 UUID
const uuid = await generateUuid('v4');
console.log('Generated UUID:', uuid);

// Generate 5 v4 UUIDs
const uuids = await generateBulkUuids(5, 'v4');
console.log('Generated UUIDs:', uuids);

// Validate a UUID
const info = await validateUuid('123e4567-e89b-12d3-a456-426614174000');
console.log('UUID Info:', info);
```

## Dependencies

Each code example may require specific dependencies:

1. JavaScript/TypeScript
   - `axios` (for Axios example)

2. Python
   - `requests`

3. Java
   - Spring WebFlux
   - `reactor-core`

4. Ruby
   - No additional dependencies

5. C#
   - `System.Net.Http`
   - `System.Text.Json`

6. PHP
   - `guzzlehttp/guzzle`

7. Rust
   - `reqwest`
   - `serde`
   - `anyhow`

8. Shell Scripts
   - `curl`, `wget`, or `httpie`

## Error Handling

All examples include basic error handling. The API returns appropriate HTTP status codes and error messages in the response body. Make sure to handle potential errors in your implementation:

- 400 Bad Request: Invalid input parameters
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error

## Contributing

Feel free to contribute additional examples in other programming languages or using different libraries. Please follow these guidelines:

1. Use consistent code style with existing examples
2. Include proper error handling
3. Add necessary documentation and comments
4. Update this README with any new dependencies

## License

This code is provided under the MIT License. Feel free to use it in your projects.

## Rate Limiting

The API implements rate limiting to ensure fair usage and prevent abuse. The current limits are:

- Single UUID Generation: 100 requests per minute per IP
- Bulk UUID Generation: 20 requests per minute per IP (max 1000 UUIDs per request)
- UUID Validation: 200 requests per minute per IP

When a rate limit is exceeded, the API returns a 429 Too Many Requests status code with the following response:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 30
  }
}
```

The `retryAfter` field indicates the number of seconds to wait before making another request.

### Rate Limit Headers

The API includes rate limit information in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637000000
```

- `X-RateLimit-Limit`: Maximum number of requests allowed per window
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit window resets

## Security

### API Keys

For production use, the API requires authentication using API keys. Include your API key in the request headers:

```
Authorization: Bearer your-api-key-here
```

To obtain an API key, contact the API administrator.

### CORS

The API supports Cross-Origin Resource Sharing (CORS) for browser-based applications. The following headers are included in responses:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### SSL/TLS

All API endpoints must be accessed over HTTPS in production. HTTP requests will be redirected to HTTPS.

### Data Privacy

The API does not store or log generated UUIDs or validation requests. All operations are performed in memory.

### Best Practices

1. **API Key Security**
   - Keep your API key secure and never expose it in client-side code
   - Use environment variables to store API keys
   - Rotate API keys periodically

2. **Error Handling**
   - Implement proper error handling for all API responses
   - Include retry logic with exponential backoff for rate limit errors
   - Log and monitor API errors in your application

3. **Performance**
   - Use bulk generation instead of multiple single UUID requests
   - Cache frequently used UUIDs when appropriate
   - Implement proper timeout handling

4. **Monitoring**
   - Monitor your API usage and rate limit status
   - Set up alerts for high error rates or rate limit violations
   - Keep track of API response times

## Testing

### Unit Tests

Each code example includes unit tests to verify the functionality. Here's an example using Jest for JavaScript:

```typescript
import { generateUuid, generateBulkUuids, validateUuid } from './uuid-client';

describe('UUID Client', () => {
  it('should generate a v4 UUID', async () => {
    const uuid = await generateUuid('v4');
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate multiple v4 UUIDs', async () => {
    const count = 5;
    const uuids = await generateBulkUuids(count, 'v4');
    expect(uuids).toHaveLength(count);
    uuids.forEach(uuid => {
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  it('should validate a UUID', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const info = await validateUuid(uuid);
    expect(info).toEqual({
      isValid: true,
      version: 'v1',
      variant: 'RFC4122',
      isNil: false,
      timestamp: expect.any(String)
    });
  });

  it('should handle invalid UUID', async () => {
    const uuid = 'invalid-uuid';
    await expect(validateUuid(uuid)).rejects.toThrow();
  });
});

### Integration Tests

Integration tests verify the interaction with the actual API. Here's an example using Python's `pytest`:

```python
import pytest
import uuid
from uuid_client import generate_uuid, generate_bulk_uuids, validate_uuid

def test_generate_v4_uuid():
    result = generate_uuid('v4')
    assert uuid.UUID(result)  # Validates UUID format

def test_generate_bulk_v4_uuids():
    count = 5
    results = generate_bulk_uuids(count, 'v4')
    assert len(results) == count
    for result in results:
        assert uuid.UUID(result)  # Validates UUID format

def test_generate_v5_uuid():
    namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'  # DNS namespace
    name = 'example.com'
    result = generate_uuid('v5', namespace=namespace, name=name)
    assert uuid.UUID(result)  # Validates UUID format

def test_validate_uuid():
    test_uuid = '123e4567-e89b-12d3-a456-426614174000'
    info = validate_uuid(test_uuid)
    assert info['isValid']
    assert info['version'] == 'v1'
    assert info['variant'] == 'RFC4122'
    assert not info['isNil']

def test_validate_invalid_uuid():
    with pytest.raises(Exception):
        validate_uuid('invalid-uuid')

## Complete Examples

### Generate and Validate UUIDs

Here's a complete example that demonstrates generating and validating UUIDs:

```typescript
import { generateUuid, generateBulkUuids, validateUuid } from './uuid-client';

async function main() {
  try {
    // Generate a v4 UUID
    console.log('Generating v4 UUID...');
    const uuid = await generateUuid('v4');
    console.log('Generated UUID:', uuid);

    // Generate multiple v4 UUIDs
    console.log('\nGenerating 5 v4 UUIDs...');
    const uuids = await generateBulkUuids(5, 'v4');
    console.log('Generated UUIDs:');
    uuids.forEach((uuid, index) => {
      console.log(`${index + 1}. ${uuid}`);
    });

    // Generate a v5 UUID with namespace
    console.log('\nGenerating v5 UUID with namespace...');
    const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';  // DNS namespace
    const name = 'example.com';
    const v5Uuid = await generateUuid('v5', namespace, name);
    console.log('Generated v5 UUID:', v5Uuid);

    // Validate UUIDs
    console.log('\nValidating UUIDs...');
    const validations = await Promise.all([
      validateUuid(uuid),
      validateUuid(v5Uuid)
    ]);

    console.log('\nValidation Results:');
    console.log('v4 UUID:', validations[0]);
    console.log('v5 UUID:', validations[1]);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Handle Rate Limiting

Example showing how to handle rate limits with exponential backoff:

```typescript
import { generateBulkUuids } from './uuid-client';

async function generateWithRetry(count: number, version: string, maxRetries = 3) {
  let retries = 0;
  let delay = 1000; // Start with 1 second delay

  while (retries < maxRetries) {
    try {
      return await generateBulkUuids(count, version);
    } catch (error) {
      if (error.response?.status === 429) {
        retries++;
        if (retries === maxRetries) {
          throw new Error('Max retries exceeded');
        }

        const retryAfter = error.response.data.error.retryAfter || 1;
        const waitTime = Math.min(delay * Math.pow(2, retries - 1), retryAfter * 1000);
        
        console.log(`Rate limit exceeded. Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
}

async function main() {
  try {
    const uuids = await generateWithRetry(1000, 'v4');
    console.log(`Successfully generated ${uuids.length} UUIDs`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Batch Processing

Example of processing UUIDs in batches:

```typescript
import { generateBulkUuids, validateUuid } from './uuid-client';

async function processBatch(uuids: string[]) {
  const results = [];
  for (const uuid of uuids) {
    try {
      const info = await validateUuid(uuid);
      results.push({ uuid, valid: true, info });
    } catch (error) {
      results.push({ uuid, valid: false, error: error.message });
    }
  }
  return results;
}

async function main() {
  try {
    // Generate a large number of UUIDs
    const totalCount = 1000;
    const batchSize = 100;
    const uuids = await generateBulkUuids(totalCount, 'v4');

    // Process in batches
    const results = [];
    for (let i = 0; i < uuids.length; i += batchSize) {
      const batch = uuids.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}...`);
      const batchResults = await processBatch(batch);
      results.push(...batchResults);
    }

    // Analyze results
    const validCount = results.filter(r => r.valid).length;
    console.log(`\nResults:`);
    console.log(`Total UUIDs: ${results.length}`);
    console.log(`Valid UUIDs: ${validCount}`);
    console.log(`Invalid UUIDs: ${results.length - validCount}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## Deployment and Hosting

### Self-Hosting

The UUID Generator API can be self-hosted on your own infrastructure. Here are the recommended deployment options:

#### Docker

1. Build the Docker image:
```bash
docker build -t uuid-generator-api .
```

2. Run the container:
```bash
docker run -d -p 3000:3000 \
  --name uuid-generator \
  -e NODE_ENV=production \
  -e API_KEY=your-api-key \
  uuid-generator-api
```

3. Docker Compose configuration:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_KEY=your-api-key
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Kubernetes

1. Deployment configuration:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uuid-generator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: uuid-generator
  template:
    metadata:
      labels:
        app: uuid-generator
    spec:
      containers:
      - name: uuid-generator
        image: uuid-generator-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: api-key
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
```

2. Service configuration:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: uuid-generator
spec:
  selector:
    app: uuid-generator
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Cloud Hosting

The API can be deployed to various cloud platforms:

#### AWS

1. **Elastic Beanstalk**
   - Upload the application as a ZIP file
   - Configure environment variables
   - Set up auto-scaling rules
   - Enable load balancing

2. **ECS/Fargate**
   - Push Docker image to ECR
   - Create ECS cluster
   - Define task definition
   - Configure service with desired count

#### Google Cloud

1. **Cloud Run**
   ```bash
   # Build and push to Container Registry
   gcloud builds submit --tag gcr.io/your-project/uuid-generator

   # Deploy to Cloud Run
   gcloud run deploy uuid-generator \
     --image gcr.io/your-project/uuid-generator \
     --platform managed \
     --allow-unauthenticated \
     --region us-central1
   ```

2. **GKE**
   ```bash
   # Create GKE cluster
   gcloud container clusters create uuid-generator \
     --num-nodes 3 \
     --machine-type e2-medium

   # Deploy application
   kubectl apply -f k8s/
   ```

#### Azure

1. **App Service**
   ```bash
   # Create App Service plan
   az appservice plan create \
     --name uuid-generator-plan \
     --resource-group your-rg \
     --sku B1

   # Create web app
   az webapp create \
     --name uuid-generator \
     --resource-group your-rg \
     --plan uuid-generator-plan
   ```

2. **AKS**
   ```bash
   # Create AKS cluster
   az aks create \
     --resource-group your-rg \
     --name uuid-generator \
     --node-count 3 \
     --enable-addons monitoring

   # Deploy application
   kubectl apply -f k8s/
   ```

### Monitoring and Logging

1. **Prometheus Metrics**
   ```yaml
   # prometheus.yml
   scrape_configs:
     - job_name: 'uuid-generator'
       static_configs:
         - targets: ['localhost:3000']
       metrics_path: '/metrics'
   ```

2. **Grafana Dashboard**
   ```json
   {
     "dashboard": {
       "panels": [
         {
           "title": "Request Rate",
           "type": "graph",
           "targets": [
             {
               "expr": "rate(uuid_generator_requests_total[5m])"
             }
           ]
         },
         {
           "title": "Error Rate",
           "type": "graph",
           "targets": [
             {
               "expr": "rate(uuid_generator_errors_total[5m])"
             }
           ]
         }
       ]
     }
   }
   ```

3. **ELK Stack Configuration**
   ```yaml
   # logstash.conf
   input {
     beats {
       port => 5044
     }
   }

   filter {
     json {
       source => "message"
     }
   }

   output {
     elasticsearch {
       hosts => ["elasticsearch:9200"]
       index => "uuid-generator-%{+YYYY.MM.dd}"
     }
   }
   ```

### Production Checklist

1. **Security**
   - Enable HTTPS with valid SSL certificate
   - Configure API key authentication
   - Set up WAF rules
   - Enable DDoS protection

2. **Performance**
   - Configure caching headers
   - Enable compression
   - Set up CDN for static assets
   - Configure auto-scaling

3. **Reliability**
   - Set up health checks
   - Configure automated backups
   - Implement circuit breakers
   - Set up alerting

4. **Monitoring**
   - Configure application metrics
   - Set up error tracking
   - Enable request tracing
   - Monitor system resources

## Code Examples

// ... rest of existing code ... 