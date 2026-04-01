#!/bin/bash

CONSUMER_KEY="TzsQ7v8S563Lv5IGc14Bqv_NoFAa"
CONSUMER_SECRET="lYyCsuZdq_1XNdxtl44ELvEeHJAa"
BASE_URL="https://devapi.mvola.mg"

echo "🔐 Getting token..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/token" \
  -H "Authorization: Basic $(echo -n "$CONSUMER_KEY:$CONSUMER_SECRET" | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cache-Control: no-cache" \
  -d "grant_type=client_credentials&scope=EXT_INT_MVOLA_API")

echo "$TOKEN_RESPONSE" | jq .
TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

echo ""
echo "📤 Testing payment endpoint..."
curl -X POST "$BASE_URL/mvola/mm/transactions/type/merchantpay/1.0.0/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 1.0" \
  -H "X-CorrelationID: test-$(date +%s)" \
  -H "UserLanguage: FR" \
  -H "UserAccountIdentifier: msisdn;0343500004" \
  -H "partnerName: ITHKL" \
  -d '{
    "amount": "5000",
    "currency": "Ar",
    "descriptionText": "Test Direct",
    "requestDate": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "requestingOrganisationTransactionReference": "TEST-'$(date +%s)'",
    "originalTransactionReference": "test-'$(date +%s)'",
    "debitParty": [{"key": "msisdn", "value": "0343500003"}],
    "creditParty": [{"key": "msisdn", "value": "0343500004"}],
    "metadata": [{"key": "partnerName", "value": "ITHKL"}]
  }' | jq .

