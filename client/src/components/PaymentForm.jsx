import { useState } from "react";
import { useMVola } from "../hooks/useMVola";

const PaymentForm = () => {
  const {
    initiatePayment,
    pollPayment,
    isLoading,
    polling,
    error,
    transactionStatus,
    clearError,
  } = useMVola();

  const [formData, setFormData] = useState({
    amount: "5000",
    customerMsisdn: "0343500003",
    description: "Test Payment",
    reference: "",
  });

  const [paymentId, setPaymentId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    clearError();

    try {
      const result = await initiatePayment(
        formData.amount,
        formData.customerMsisdn,
        formData.description,
        formData.reference
      );

      setPaymentId(result.serverCorrelationId);

      // Automatically start polling
      await pollPayment(result.serverCorrelationId);
    } catch (err) {
      console.error("Payment initiation failed:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">MVola Payment</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {transactionStatus && (
        <div
          className={`mb-4 p-3 rounded border ${
            transactionStatus.status === "completed"
              ? "bg-green-100 border-green-400 text-green-700"
              : transactionStatus.status === "failed"
              ? "bg-red-100 border-red-400 text-red-700"
              : "bg-blue-100 border-blue-400 text-blue-700"
          }`}
        >
          <p className="font-semibold capitalize">{transactionStatus.status}</p>
          <p className="text-sm mt-1">ID: {transactionStatus.serverCorrelationId}</p>
        </div>
      )}

      {!paymentId ? (
        <form onSubmit={handleInitiatePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Ar)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="5000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone
            </label>
            <input
              type="tel"
              name="customerMsisdn"
              value={formData.customerMsisdn}
              onChange={handleInputChange}
              placeholder="0343500003"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Payment description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference (Optional)
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              placeholder="REF-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Initiating..." : "Initiate Payment"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Processing payment...</p>
          {polling && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}
          <button
            onClick={() => {
              setPaymentId(null);
              setFormData({
                amount: "5000",
                customerMsisdn: "0343500003",
                description: "Test Payment",
                reference: "",
              });
            }}
            className="btn-secondary py-2"
          >
            New Payment
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">
        Sandbox mode - Test numbers: 0343500003, 0343500004
      </p>
    </div>
  );
};

export default PaymentForm;
