# UUID Generator Code Examples

## JavaScript/TypeScript

### Using Fetch API
```typescript
// Generate a single UUID
async function generateUuid(version: string = 'v4') {
  const response = await fetch('http://localhost:3000/api/uuid/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version })
  });
  const data = await response.json();
  return data.result;
}

// Generate multiple UUIDs
async function generateBulkUuids(count: number, version: string = 'v4') {
  const response = await fetch('http://localhost:3000/api/uuid/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version, count })
  });
  const data = await response.json();
  return data.results;
}

// Validate UUID
async function validateUuid(uuid: string) {
  const response = await fetch('http://localhost:3000/api/uuid/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid })
  });
  return await response.json();
}
```

### Using Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Generate a single UUID
const generateUuid = async (version = 'v4') => {
  const { data } = await api.post('/uuid/generate', { version });
  return data.result;
};

// Generate multiple UUIDs
const generateBulkUuids = async (count: number, version = 'v4') => {
  const { data } = await api.post('/uuid/bulk', { version, count });
  return data.results;
};

// Validate UUID
const validateUuid = async (uuid: string) => {
  const { data } = await api.post('/uuid/info', { uuid });
  return data;
};
```

## Python

### Using requests
```python
import requests

BASE_URL = 'http://localhost:3000/api'

def generate_uuid(version='v4', namespace=None, name=None):
    payload = {'version': version}
    if namespace:
        payload['namespace'] = namespace
    if name:
        payload['name'] = name
    
    response = requests.post(f'{BASE_URL}/uuid/generate', json=payload)
    return response.json()['result']

def generate_bulk_uuids(count, version='v4'):
    payload = {'version': version, 'count': count}
    response = requests.post(f'{BASE_URL}/uuid/bulk', json=payload)
    return response.json()['results']

def validate_uuid(uuid):
    response = requests.post(f'{BASE_URL}/uuid/info', json={'uuid': uuid})
    return response.json()
```

## Java

### Using Spring WebClient
```java
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

public class UuidClient {
    private final WebClient webClient;
    private static final String BASE_URL = "http://localhost:3000/api";

    public UuidClient() {
        this.webClient = WebClient.create(BASE_URL);
    }

    public Mono<String> generateUuid(String version) {
        return webClient.post()
            .uri("/uuid/generate")
            .bodyValue(Map.of("version", version))
            .retrieve()
            .bodyToMono(JsonNode.class)
            .map(response -> response.get("result").asText());
    }

    public Mono<List<String>> generateBulkUuids(int count, String version) {
        return webClient.post()
            .uri("/uuid/bulk")
            .bodyValue(Map.of(
                "version", version,
                "count", count
            ))
            .retrieve()
            .bodyToMono(JsonNode.class)
            .map(response -> {
                List<String> results = new ArrayList<>();
                response.get("results").forEach(uuid -> results.add(uuid.asText()));
                return results;
            });
    }

    public Mono<UuidInfo> validateUuid(String uuid) {
        return webClient.post()
            .uri("/uuid/info")
            .bodyValue(Map.of("uuid", uuid))
            .retrieve()
            .bodyToMono(UuidInfo.class);
    }
}
```

## Go

### Using net/http
```go
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

const baseURL = "http://localhost:3000/api"

type UuidResponse struct {
    Result string `json:"result"`
}

type BulkUuidResponse struct {
    Results []string `json:"results"`
}

func generateUuid(version string) (string, error) {
    payload := map[string]interface{}{
        "version": version,
    }
    
    jsonData, err := json.Marshal(payload)
    if err != nil {
        return "", err
    }

    resp, err := http.Post(
        baseURL + "/uuid/generate",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var result UuidResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", err
    }

    return result.Result, nil
}

func generateBulkUuids(count int, version string) ([]string, error) {
    payload := map[string]interface{}{
        "version": version,
        "count":   count,
    }
    
    jsonData, err := json.Marshal(payload)
    if err != nil {
        return nil, err
    }

    resp, err := http.Post(
        baseURL + "/uuid/bulk",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result BulkUuidResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }

    return result.Results, nil
}
``` 

## Ruby

### Using Net::HTTP
```ruby
require 'net/http'
require 'json'

class UuidClient
  BASE_URL = 'http://localhost:3000/api'

  def initialize
    @uri = URI(BASE_URL)
    @http = Net::HTTP.new(@uri.host, @uri.port)
  end

  def generate_uuid(version = 'v4')
    response = post('/uuid/generate', { version: version })
    JSON.parse(response.body)['result']
  end

  def generate_bulk_uuids(count, version = 'v4')
    response = post('/uuid/bulk', { version: version, count: count })
    JSON.parse(response.body)['results']
  end

  def validate_uuid(uuid)
    response = post('/uuid/info', { uuid: uuid })
    JSON.parse(response.body)
  end

  private

  def post(path, payload)
    request = Net::HTTP::Post.new(@uri.path + path)
    request['Content-Type'] = 'application/json'
    request.body = payload.to_json
    @http.request(request)
  end
end
```

## C#

### Using HttpClient
```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class UuidClient
{
    private readonly HttpClient _client;
    private const string BaseUrl = "http://localhost:3000/api";

    public UuidClient()
    {
        _client = new HttpClient
        {
            BaseAddress = new Uri(BaseUrl)
        };
    }

    public async Task<string> GenerateUuidAsync(string version = "v4")
    {
        var payload = JsonSerializer.Serialize(new { version });
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        
        var response = await _client.PostAsync("/uuid/generate", content);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<UuidResponse>(result).Result;
    }

    public async Task<string[]> GenerateBulkUuidsAsync(int count, string version = "v4")
    {
        var payload = JsonSerializer.Serialize(new { version, count });
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        
        var response = await _client.PostAsync("/uuid/bulk", content);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<BulkUuidResponse>(result).Results;
    }

    public async Task<UuidInfo> ValidateUuidAsync(string uuid)
    {
        var payload = JsonSerializer.Serialize(new { uuid });
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        
        var response = await _client.PostAsync("/uuid/info", content);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<UuidInfo>(result);
    }
}

public class UuidResponse
{
    public string Result { get; set; }
}

public class BulkUuidResponse
{
    public string[] Results { get; set; }
}

public class UuidInfo
{
    public bool IsValid { get; set; }
    public string Version { get; set; }
    public string Variant { get; set; }
    public bool IsNil { get; set; }
    public DateTime? Timestamp { get; set; }
}
```

## PHP

### Using Guzzle
```php
<?php

use GuzzleHttp\Client;

class UuidClient
{
    private $client;
    private const BASE_URL = 'http://localhost:3000/api';

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => self::BASE_URL,
            'headers' => ['Content-Type' => 'application/json']
        ]);
    }

    public function generateUuid(string $version = 'v4'): string
    {
        $response = $this->client->post('/uuid/generate', [
            'json' => ['version' => $version]
        ]);

        $data = json_decode($response->getBody(), true);
        return $data['result'];
    }

    public function generateBulkUuids(int $count, string $version = 'v4'): array
    {
        $response = $this->client->post('/uuid/bulk', [
            'json' => [
                'version' => $version,
                'count' => $count
            ]
        ]);

        $data = json_decode($response->getBody(), true);
        return $data['results'];
    }

    public function validateUuid(string $uuid): array
    {
        $response = $this->client->post('/uuid/info', [
            'json' => ['uuid' => $uuid]
        ]);

        return json_decode($response->getBody(), true);
    }
}
```

## Rust

### Using reqwest
```rust
use reqwest::Client;
use serde::{Deserialize, Serialize};
use anyhow::Result;

#[derive(Debug, Serialize)]
struct GenerateRequest {
    version: String,
}

#[derive(Debug, Serialize)]
struct BulkGenerateRequest {
    version: String,
    count: u32,
}

#[derive(Debug, Serialize)]
struct ValidateRequest {
    uuid: String,
}

#[derive(Debug, Deserialize)]
struct UuidResponse {
    result: String,
}

#[derive(Debug, Deserialize)]
struct BulkUuidResponse {
    results: Vec<String>,
}

pub struct UuidClient {
    client: Client,
    base_url: String,
}

impl UuidClient {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
            base_url: String::from("http://localhost:3000/api"),
        }
    }

    pub async fn generate_uuid(&self, version: &str) -> Result<String> {
        let response = self.client
            .post(&format!("{}/uuid/generate", self.base_url))
            .json(&GenerateRequest {
                version: version.to_string(),
            })
            .send()
            .await?;

        let uuid_response: UuidResponse = response.json().await?;
        Ok(uuid_response.result)
    }

    pub async fn generate_bulk_uuids(&self, count: u32, version: &str) -> Result<Vec<String>> {
        let response = self.client
            .post(&format!("{}/uuid/bulk", self.base_url))
            .json(&BulkGenerateRequest {
                version: version.to_string(),
                count,
            })
            .send()
            .await?;

        let bulk_response: BulkUuidResponse = response.json().await?;
        Ok(bulk_response.results)
    }

    pub async fn validate_uuid(&self, uuid: &str) -> Result<serde_json::Value> {
        let response = self.client
            .post(&format!("{}/uuid/info", self.base_url))
            .json(&ValidateRequest {
                uuid: uuid.to_string(),
            })
            .send()
            .await?;

        Ok(response.json().await?)
    }
}
``` 

## Shell Scripts

### Using curl
```bash
# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Generate a single UUID
generate_uuid() {
    version=${1:-v4}
    curl -X POST "$BASE_URL/uuid/generate" \
        -H "Content-Type: application/json" \
        -d "{\"version\": \"$version\"}"
}

# Generate multiple UUIDs
generate_bulk_uuids() {
    count=${1:-10}
    version=${2:-v4}
    curl -X POST "$BASE_URL/uuid/bulk" \
        -H "Content-Type: application/json" \
        -d "{\"version\": \"$version\", \"count\": $count}"
}

# Generate UUID with namespace and name
generate_namespaced_uuid() {
    version=${1:-v5}
    namespace=${2}
    name=${3}
    curl -X POST "$BASE_URL/uuid/generate" \
        -H "Content-Type: application/json" \
        -d "{\"version\": \"$version\", \"namespace\": \"$namespace\", \"name\": \"$name\"}"
}

# Validate UUID
validate_uuid() {
    uuid=$1
    curl -X POST "$BASE_URL/uuid/info" \
        -H "Content-Type: application/json" \
        -d "{\"uuid\": \"$uuid\"}"
}

# Example usage:
# Generate v4 UUID
# generate_uuid v4

# Generate 5 v4 UUIDs
# generate_bulk_uuids 5 v4

# Generate v5 UUID with namespace and name
# generate_namespaced_uuid v5 "6ba7b810-9dad-11d1-80b4-00c04fd430c8" "example.com"

# Validate UUID
# validate_uuid "123e4567-e89b-12d3-a456-426614174000"
```

### Using wget
```bash
# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Generate a single UUID
generate_uuid() {
    version=${1:-v4}
    wget --quiet \
        --method POST \
        --header "Content-Type: application/json" \
        --body-data "{\"version\": \"$version\"}" \
        --output-document - \
        "$BASE_URL/uuid/generate"
}

# Generate multiple UUIDs
generate_bulk_uuids() {
    count=${1:-10}
    version=${2:-v4}
    wget --quiet \
        --method POST \
        --header "Content-Type: application/json" \
        --body-data "{\"version\": \"$version\", \"count\": $count}" \
        --output-document - \
        "$BASE_URL/uuid/bulk"
}

# Generate UUID with namespace and name
generate_namespaced_uuid() {
    version=${1:-v5}
    namespace=${2}
    name=${3}
    wget --quiet \
        --method POST \
        --header "Content-Type: application/json" \
        --body-data "{\"version\": \"$version\", \"namespace\": \"$namespace\", \"name\": \"$name\"}" \
        --output-document - \
        "$BASE_URL/uuid/generate"
}

# Validate UUID
validate_uuid() {
    uuid=$1
    wget --quiet \
        --method POST \
        --header "Content-Type: application/json" \
        --body-data "{\"uuid\": \"$uuid\"}" \
        --output-document - \
        "$BASE_URL/uuid/info"
}

# Example usage:
# Generate v4 UUID
# generate_uuid v4

# Generate 5 v4 UUIDs
# generate_bulk_uuids 5 v4

# Generate v5 UUID with namespace and name
# generate_namespaced_uuid v5 "6ba7b810-9dad-11d1-80b4-00c04fd430c8" "example.com"

# Validate UUID
# validate_uuid "123e4567-e89b-12d3-a456-426614174000"
```

### Using httpie
```bash
# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Generate a single UUID
generate_uuid() {
    version=${1:-v4}
    http POST "$BASE_URL/uuid/generate" \
        version="$version"
}

# Generate multiple UUIDs
generate_bulk_uuids() {
    count=${1:-10}
    version=${2:-v4}
    http POST "$BASE_URL/uuid/bulk" \
        version="$version" \
        count:="$count"
}

# Generate UUID with namespace and name
generate_namespaced_uuid() {
    version=${1:-v5}
    namespace=${2}
    name=${3}
    http POST "$BASE_URL/uuid/generate" \
        version="$version" \
        namespace="$namespace" \
        name="$name"
}

# Validate UUID
validate_uuid() {
    uuid=$1
    http POST "$BASE_URL/uuid/info" \
        uuid="$uuid"
}

# Example usage:
# Generate v4 UUID
# generate_uuid v4

# Generate 5 v4 UUIDs
# generate_bulk_uuids 5 v4

# Generate v5 UUID with namespace and name
# generate_namespaced_uuid v5 "6ba7b810-9dad-11d1-80b4-00c04fd430c8" "example.com"

# Validate UUID
# validate_uuid "123e4567-e89b-12d3-a456-426614174000"
``` 