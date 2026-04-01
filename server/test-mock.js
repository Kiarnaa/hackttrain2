#!/usr/bin/env node
/**
 * Test Mock MVola API
 * Run: node test-mock.js
 */

require("dotenv").config({ path: "./.env" });
const mvola = require("./utils/mvola-mock");

async function runTests() {
  console.log("🧪 Testing Mock MVola API\n");

  try {
    // Test 1: Get Access Token
    console.log("1️⃣  Testing getAccessToken()...");
    const token = await mvola.getAccessToken();
    console.log(`   ✅ Mock Token: ${token}\n`);

    // Test 2: Initiate Payment
    console.log("2️⃣  Testing initiatePayment()...");
    const paymentResult = await mvola.initiatePayment({
      amount: "5000",
      customerMsisdn: "0343500003",
      description: "Test Mock Payment",
      reference: `TEST-${Date.now()}`,
    });
    console.log("   ✅ Payment initiated:");
    console.log(`      - Server Correlation ID: ${paymentResult.serverCorrelationId}`);
    console.log(`      - Status: ${paymentResult.status}\n`);

    // Test 3: Check status immediately
    console.log("3️⃣  Testing getTransactionStatus() - Immediate...");
    const status1 = await mvola.getTransactionStatus(
      paymentResult.serverCorrelationId
    );
    console.log(`   ✅ Status: ${status1.status}\n`);

    // Test 4: Wait a bit and check again
    console.log("4️⃣  Waiting 4 seconds for transaction to complete...");
    await new Promise((r) => setTimeout(r, 4000));

    const status2 = await mvola.getTransactionStatus(
      paymentResult.serverCorrelationId
    );
    console.log(`   ✅ Updated Status: ${status2.status}\n`);

    // Test 5: Poll until complete
    console.log("5️⃣  Testing pollUntilComplete()...");

    // Initiate a new payment for polling test
    const payment2 = await mvola.initiatePayment({
      amount: "10000",
      customerMsisdn: "0343500004",
      description: "Test Polling",
      reference: `POLL-${Date.now()}`,
    });

    const finalStatus = await mvola.pollUntilComplete(
      payment2.serverCorrelationId,
      { interval: 1000, timeout: 30000 }
    );
    console.log(`   ✅ Final Status: ${finalStatus.status}\n`);

    // Test 6: Get all transactions
    console.log("6️⃣  All Mock Transactions:");
    const allTransactions = mvola.getAllTransactions();
    console.log(`   ✅ Total: ${allTransactions.length} transactions`);
    allTransactions.forEach((tx, i) => {
      console.log(`      ${i + 1}. ${tx.reference} - ${tx.status}`);
    });

    console.log("\n✅ All tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:");
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

runTests();
