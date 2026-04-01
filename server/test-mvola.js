#!/usr/bin/env node
/**
 * Test Script for MVola API
 * Run: node test-mvola.js
 */

require("dotenv").config({ path: "./.env" });

const mvola = require("./utils/mvola");

async function runTests() {
  console.log("🧪 Testing MVola API Integration\n");
  console.log("⚙️  Configuration:");
  console.log(`   MVOLA_ENV: ${process.env.MVOLA_ENV}`);
  console.log(`   MVOLA_CONSUMER_KEY: ${process.env.MVOLA_CONSUMER_KEY?.substring(0, 20)}...`);
  console.log(`   MVOLA_MERCHANT_NUMBER: ${process.env.MVOLA_MERCHANT_NUMBER}`);
  console.log(`   MVOLA_PARTNER_NAME: ${process.env.MVOLA_PARTNER_NAME}\n`);

  try {
    // Test 1: Get Access Token
    console.log("1️⃣  Testing getAccessToken()...");
    const token = await mvola.getAccessToken();
    console.log(`   ✅ Token obtained: ${token.substring(0, 30)}...\n`);

    // Test 2: Initiate Payment
    console.log("2️⃣  Testing initiatePayment()...");
    const paymentResult = await mvola.initiatePayment({
      amount: "5000",
      customerMsisdn: "0343500003",
      description: "Test Payment",
      reference: `TEST-${Date.now()}`,
    });
    console.log("   ✅ Payment initiated:");
    console.log(`      - Server Correlation ID: ${paymentResult.serverCorrelationId}`);
    console.log(`      - Status: ${paymentResult.status}\n`);

    // Test 3: Get Transaction Status
    console.log("3️⃣  Testing getTransactionStatus()...");
    const status = await mvola.getTransactionStatus(paymentResult.serverCorrelationId);
    console.log("   ✅ Transaction status retrieved:");
    console.log(`      - Status: ${status.status}`);
    console.log(`      - ID: ${status.serverCorrelationId}\n`);

    console.log("✅ All tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:");
    console.error(`   ${error.message}`);
    if (error.response?.data) {
      console.error("   Response:", JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

runTests();
