import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Hook for MVola payment operations
 * Usage:
 *   const { initiatePayment, getStatus, polling, error, isLoading } = useMVola();
 */
export const useMVola = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  // Initiate a payment
  const initiatePayment = useCallback(
    async (amount, customerMsisdn, description, reference = null) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/payments/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: String(amount),
            customerMsisdn,
            description,
            reference,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to initiate payment");
        }

        const data = await response.json();
        console.log("✅ Payment initiated:", data.data);
        setIsLoading(false);
        return data.data;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  // Check transaction status
  const getStatus = useCallback(async (serverCorrelationId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/payments/status/${serverCorrelationId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get status");
      }

      const data = await response.json();
      setTransactionStatus(data.data);
      console.log("🔍 Transaction status:", data.data);
      setIsLoading(false);
      return data.data;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Poll until payment is complete
  const pollPayment = useCallback(async (serverCorrelationId) => {
    setPolling(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/payments/poll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverCorrelationId,
          interval: 3000,
          timeout: 120000,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment polling failed");
      }

      const data = await response.json();
      setTransactionStatus(data.data);
      console.log("✅ Payment completed:", data.data);
      setPolling(false);
      return data.data;
    } catch (err) {
      setError(err.message);
      setPolling(false);
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    initiatePayment,
    getStatus,
    pollPayment,
    isLoading,
    polling,
    error,
    transactionStatus,
    clearError,
  };
};

export default useMVola;
