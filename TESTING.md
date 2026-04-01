# Testing MVola Payment Integration with Mock API

## 🎯 Overview

This guide shows how to test the complete payment flow locally using the **Mock MVola API** without needing real MVola credentials.

## 📦 What's Included

- ✅ **Mock MVola API** (`server/utils/mvola-mock.js`) - Simulates realistic payment flows
- ✅ **Payment API** (`server/controllers/payment.js`) - REST endpoints for payments
- ✅ **React Hook** (`client/src/hooks/useMVola.js`) - Custom hook for client-side integration
- ✅ **Payment Component** (`client/src/components/PaymentForm.jsx`) - Example UI component

## 🚀 Quick Start

### 1️⃣ **Start Backend Server** (Mock Mode Enabled)

```bash
cd server
npm install  # Install dependencies
npm start    # Start server on http://localhost:5000
```

You'll see:
```
Server running on port 5000
📡 Using MOCK MVola API
```

### 2️⃣ **Start Frontend** (in another terminal)

```bash
cd client
npm install
npm run dev  # Start on http://localhost:5173
```

### 3️⃣ **Test Payment Flow**

1. Go to `http://localhost:5173`
2. Add the PaymentForm component to a page:
   ```jsx
   import PaymentForm from "./components/PaymentForm";
   export default function TestPayment() {
     return <PaymentForm />;
   }
   ```
3. Fill the form and click "Initiate Payment"
4. Watch the status change automatically! 🎉

## 🧪 Testing Endpoints

### **Manual Testing with curl**

#### 1. Initiate Payment
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

Response:
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "serverCorrelationId": "abc-123-def",
    "objectReference": "xyz-789"
  }
}
```

#### 2. Check Transaction Status
```bash
curl http://localhost:5000/api/payments/status/{serverCorrelationId}
```

#### 3. Poll Until Complete
```bash
curl -X POST http://localhost:5000/api/payments/poll \
  -H "Content-Type: application/json" \
  -d '{
    "serverCorrelationId": "abc-123-def",
    "interval": 2000,
    "timeout": 30000
  }'
```

#### 4. View All Mock Transactions (Debug)
```bash
curl http://localhost:5000/api/payments/debug/transactions
```

Response:
```json
{
  "mode": "mock",
  "transactions": [
    {
      "correlationId": "abc-123",
      "status": "completed",
      "amount": "5000",
      ...
    }
  ]
}
```

## 🔄 Mock Transaction Behavior

The mock API simulates **realistic transaction flows**:

- **70%** → `pending` → `completed` ✅
- **20%** → `pending` → `failed` ❌
- **10%** → `rejected` immediately ❌

Each transaction:
- Takes **3-5 seconds** to complete/fail
- Has realistic delays for API calls
- Stores data in memory

## 📝 Using the React Hook

```jsx
import { useMVola } from "../hooks/useMVola";

function MyPayment() {
  const {
    initiatePayment,
    pollPayment,
    isLoading,
    error,
    transactionStatus,
  } = useMVola();

  const handlePay = async () => {
    try {
      // 1. Initiate payment
      const result = await initiatePayment(
        5000,                    // amount
        "0343500003",            // phone
        "Purchase item",         // description
        "ORDER-001"              // reference
      );

      // 2. Poll for completion
      const final = await pollPayment(result.serverCorrelationId);
      console.log("Payment status:", final.status);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={isLoading}>
        Pay Now
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {transactionStatus && (
        <p>Status: {transactionStatus.status}</p>
      )}
    </div>
  );
}
```

## 🔧 Configuration

### **Enable/Disable Mock Mode**

Edit `server/.env`:

```env
# Use Mock API (for testing)
MVOLA_USE_MOCK=true

# Use Real API (when ready)
MVOLA_USE_MOCK=false
```

### **Real MVola Credentials**

When you're ready to use real MVola:

1. Get credentials from [developer.mvola.mg](https://developer.mvola.mg)
2. Update `server/.env`:
   ```env
   MVOLA_USE_MOCK=false
   MVOLA_CONSUMER_KEY=your_key
   MVOLA_CONSUMER_SECRET=your_secret
   ```
3. Restart the server

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/initiate` | Start a payment |
| `GET` | `/api/payments/status/:id` | Check transaction status |
| `POST` | `/api/payments/poll` | Poll until complete |
| `POST` | `/api/payments/webhook` | Receive MVola callbacks |
| `GET` | `/api/payments/debug/transactions` | View all transactions (mock only) |

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
cd server
npm install
```

### "Server won't start"
- Check if port 5000 is already in use
- Try: `lsof -i :5000` to find the process

### "PaymentForm not showing"
- Make sure you imported `useMVola` from `../hooks/useMVola`
- Check browser console for errors

### "API calls fail"
- Verify `client/.env.local` has `VITE_API_URL=http://localhost:5000/api`
- Check server is running: `curl http://localhost:5000/api/health`

## ✅ Next Steps

1. **Test the complete flow** with the Mock API
2. **Customize PaymentForm** to match your design
3. **Add database integration** to save transactions
4. **Implement WebSocket** for real-time updates
5. **Switch to real MVola** credentials when ready

## 📚 Resources

- [MVola Developer Portal](https://developer.mvola.mg)
- [Merchant Pay API Docs](https://developer.mvola.mg)
- React Hook API: `useMVola.js`
- Payment Component: `PaymentForm.jsx`

---

**Happy Testing! 🚀**
