# MVola Payment Integration - Complete Setup Guide

## ✅ What's Been Created

### **Backend (Node.js + Express)**

1. **`server/utils/mvola.js`** - Real MVola API integration
2. **`server/utils/mvola-mock.js`** ⭐ - Mock API for testing (simulates realistic flows)
3. **`server/controllers/payment.js`** - Payment business logic
4. **`server/routes/payments.js`** - Payment API endpoints
5. **`server/.env`** - Environment configuration with mock mode enabled

### **Frontend (React)**

1. **`client/src/hooks/useMVola.js`** ⭐ - Custom React hook for payments
2. **`client/src/components/PaymentForm.jsx`** ⭐ - Example payment component
3. **`client/.env.local`** - Frontend configuration

### **Documentation & Testing**

1. **`TESTING.md`** - Complete testing guide with curl examples
2. **`start-dev.sh`** - One-command startup script
3. **`server/test-mock.js`** - Automated test suite
4. **`server/test-mvola.js`** - Real API test (when ready)

---

## 🎮 Quick Start (30 seconds)

### **Option 1: Automatic (Recommended)**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

Then open: [http://localhost:5173](http://localhost:5173)

### **Option 2: Manual**

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Test the API

### **See Mock Transactions** (Debug)
```bash
curl http://localhost:5000/api/payments/debug/transactions
```

### **Initiate a Payment**
```bash
curl -X POST http://localhost:5000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "5000",
    "customerMsisdn": "0343500003",
    "description": "Test Payment",
    "reference": "TEST-001"
  }'
```

---

## 📋 Architecture Overview

```
Client (React)
    ↓
useMVola Hook
    ↓
HTTP Request
    ↓
Backend (Express)
    ↓
Payment Controller
    ↓
MVola API Layer (Real or Mock)
    ↓
Response (Transaction Status)
```

### **Mock Mode Flow**

```
Payment Initiated
    ↓
Random Status Assigned (70% success, 20% fail, 10% reject)
    ↓
Stored in Memory
    ↓
Simulated Delay (3-5 seconds)
    ↓
Status Updated Automatically
```

---

## 🔧 Configuration

### **Enable Mock Mode** (Default)
`server/.env`:
```env
MVOLA_USE_MOCK=true
```

### **Switch to Real MVola**
`server/.env`:
```env
MVOLA_USE_MOCK=false
MVOLA_CONSUMER_KEY=your_key_here
MVOLA_CONSUMER_SECRET=your_secret_here
```

### **Frontend API URL**
`client/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💡 Usage Examples

### **Simple Payment**
```jsx
import { useMVola } from "../hooks/useMVola";

function CheckoutPage() {
  const { initiatePayment, isLoading, error } = useMVola();

  const handlePayment = async () => {
    try {
      const result = await initiatePayment(
        5000,                 // amount
        "0343500003",         // phone
        "Product purchase"    // description
      );
      console.log("Payment started:", result.serverCorrelationId);
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

### **With Polling**
```jsx
const {
  initiatePayment,
  pollPayment,
  transactionStatus,
} = useMVola();

const handlePay = async () => {
  const result = await initiatePayment(5000, "0343500003", "Purchase");
  
  // Wait for completion (auto-polls every 3 seconds)
  const final = await pollPayment(result.serverCorrelationId);
  
  if (final.status === "completed") {
    console.log("✅ Payment successful!");
  } else {
    console.log("❌ Payment failed");
  }
};
```

### **With Error Handling**
```jsx
const { initiatePayment, error, clearError } = useMVola();

const handlePay = async () => {
  clearError();
  try {
    await initiatePayment(5000, "0343500003", "Purchase");
  } catch (err) {
    // Error is automatically set in state
    console.error(error); // Access via state
  }
};

return (
  <>
    {error && <div className="error">{error}</div>}
  </>
);
```

---

## 📊 Mock Transaction States

### **Pending** (Waiting)
- Status: `pending`
- Duration: 1-3 seconds
- Action: Waiting for user confirmation or system processing

### **Completed** ✅
- Status: `completed`
- Frequency: 70% of transactions
- Action: Payment successful, update inventory

### **Failed** ❌
- Status: `failed`
- Frequency: 20% of transactions
- Reason: Network error, insufficient balance, etc.
- Action: Show retry option to user

### **Rejected** ❌
- Status: `rejected`
- Frequency: 10% of transactions
- Reason: Immediate rejection (bad number, blocked account)
- Action: Show error without retry

---

## 🚀 Production Checklist

Before switching to real MVola:

- [ ] Get Consumer Key and Secret from [developer.mvola.mg](https://developer.mvola.mg)
- [ ] Test credentials locally with `server/test-mvola.js`
- [ ] Set `MVOLA_USE_MOCK=false` in `.env`
- [ ] Add database integration to save transactions
- [ ] Implement webhooks to handle payment notifications
- [ ] Add error logging and monitoring
- [ ] Test with real transactions on sandbox first
- [ ] Set up production credentials when ready

---

## 📞 API Reference

### `useMVola()` Hook

**Returns:**
```typescript
{
  initiatePayment: (amount, msisdn, description, reference?) => Promise
  getStatus: (serverCorrelationId) => Promise
  pollPayment: (serverCorrelationId) => Promise
  isLoading: boolean
  polling: boolean
  error: string | null
  transactionStatus: object | null
  clearError: () => void
}
```

### **Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payments/initiate` | POST | Start payment |
| `/api/payments/status/:id` | GET | Get transaction status |
| `/api/payments/poll` | POST | Poll until complete |
| `/api/payments/webhook` | POST | Receive callbacks |
| `/api/payments/debug/transactions` | GET | View all transactions (mock only) |

---

## 🐛 Debugging

### **View Server Logs**
```bash
# Foreground
cd server && npm start

# Or check logs
tail -f /tmp/server.log
```

### **View All Mock Transactions**
```bash
curl http://localhost:5000/api/payments/debug/transactions | jq
```

### **Monitor Network Requests**
1. Open DevTools (F12)
2. Go to Network tab
3. Perform a payment
4. See requests to `/api/payments/initiate`, `/api/payments/poll`, etc.

---

## 📚 Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `server/utils/mvola.js` | Real API integration | ✅ Ready |
| `server/utils/mvola-mock.js` | Mock API for testing | ✅ Ready |
| `server/controllers/payment.js` | Business logic | ✅ Ready |
| `server/routes/payments.js` | Endpoints | ✅ Ready |
| `client/src/hooks/useMVola.js` | React hook | ✅ Ready |
| `client/src/components/PaymentForm.jsx` | Example component | ✅ Ready |
| `TESTING.md` | Testing guide | ✅ Ready |

---

## ✨ Next Steps

1. **Run `./start-dev.sh`** to start everything
2. **Open http://localhost:5173** in your browser
3. **Test a payment** using the mock API
4. **Customize PaymentForm** to match your design
5. **Read TESTING.md** for detailed testing guide
6. **Get real credentials** from MVola when ready
7. **Switch `MVOLA_USE_MOCK=false`** to go live

---

**You're all set! 🎉 Happy testing!**

Need help? Check `TESTING.md` for detailed examples and troubleshooting.
