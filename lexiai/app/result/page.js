// app/result/page.js
"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.');
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        <p className="text-lg mt-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {session.payment_status === 'paid' ? (
        <>
          <h1 className="text-3xl font-bold text-center">Thank you for your purchase!</h1>
          <div className="mt-6">
            <p className="text-lg text-center">Session ID: {session_id}</p>
            <p className="text-base text-center mt-2">
              We have received your payment. You will receive an email with the order details shortly.
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center text-red-600">Payment failed</h1>
          <div className="mt-6">
            <p className="text-base text-center">
              Your payment was not successful. Please try again.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultPage;
