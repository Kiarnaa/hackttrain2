#!/usr/bin/env node
/**
 * MVola Endpoint Tester
 * Tests different potential endpoint paths to find the correct one
 * Run: node test-endpoints.js
 */

require("dotenv").config({ path: "./.env" });
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const baseUrl = process.env.MVOLA_ENV === "production"
  ? "https://api.mvola.mg"
  : "https://devapi.mvola.mg";

const consumerKey = process.env.MVOLA_CONSUMER_KEY;
const consumerSecret = process.env.MVOLA_CONSUMER_SECRET;
const merchantNumber = process.env.MVOLA_MERCHANT_NUMBER;
const partnerName = process.env.MVOLA_PARTNER_NAME;

// Different endpoint variations to test
const endpointVariations = [
  "/mvola/mm/transactions/type/merchantpay/1.0/",
  "/mvola/mm/transactions/type/merchantpay/1.0",
  "/mvola/mm/transactions/merchantpay/1.0/",
  "/v1/mvola/mm/transactions/type/merchantpay",
  "/api/mvola/mm/transactions/type/merchantpay/1.0/",
  "/transactions/type/merchantpay/1.0/",
  "/transactions/merchantpay/",
  "/merchantpay/",
  "/api/transactions/merchantpay",
];

async function getToken() {
  try {
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await axios.post(
      `${baseUrl}/token`,
      "grant_type=client_credentials&scope=EXT_INT_MVOLA_API",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Failed to get token:", error.message);
    throw error;
  }
}

async function testEndpoint(endpoint, token) {
  const correlationId = uuidv4();
  const body = {
    amount: "5000",
    currency: "Ar",
    descriptionText: "Test Payment",
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `TEST-${Date.now()}`,
    originalTransactionReference: correlationId,
    debitParty: [{ key: "msisdn", value: "0343500003" }],
    creditParty: [{ key: "msisdn", value: merchantNumber }],
    metadata: [{ key: "partnerName", value: partnerName }],
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Version: "1.0",
    "X-CorrelationID": correlationId,
    UserLanguage: "FR",
    UserAccountIdentifier: `msisdn;${merchantNumber}`,
    partnerName: partnerName,
    "Cache-Control": "no-cache",
  };

  try {
    const response = await axios.post(
      `${baseUrl}${endpoint}`,
      body,
      { headers, timeout: 5000 }
    );
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.statusText,
        data: error.response.data
      };
    }
    return { success: false, status: 0, message: error.message };
  }
}

async function runTests() {
  console.log("🧪 Testing MVola Endpoints\n");
  console.log(`Base URL: ${baseUrl}\n`);

  try {
    console.log("🔐 Getting access token...");
    const token = await getToken();
    console.log("✅ Token obtained\n");

    console.log("🔄 Testing endpoint variations...\n");

    for (const endpoint of endpointVariations) {
      process.stdout.write(`   Testing ${endpoint}... `);
      const result = await testEndpoint(endpoint, token);

      if (result.success) {
        console.log(`✅ SUCCESS (${result.status})`);
        console.log(`      Response:`, JSON.stringify(result.data, null, 6));
        return; // Stop if we find a working endpoint
      } else {
        console.log(`❌ ${result.status} ${result.message}`);
      }

      // Small delay between requests
      await new Promise(r => setTimeout(r, 500));
    }

    console.log("\n⚠️  None of the tested endpoints worked.");
    console.log("\n💡 Next steps:");
    console.log("   1. Check MVola documentation for the exact endpoint");
    console.log("   2. Look for 'Merchant Pay' or 'Payment Initiation' endpoint");
    console.log("   3. Update mvola.js with the correct endpoint path");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

runTests();
