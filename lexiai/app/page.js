'use client'
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
    const router = useRouter();
    const { isSignedIn } = useUser();
  

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <div>
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold">Flashcard SaaS</h1>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  {!isSignedIn ? (
                    <>
                      <a
                        href="/sign-in"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </a>
                      <a
                        href="/sign-up"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Sign Up
                      </a>
                    </>
                  ) : (
                    <UserButton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="text-center my-12">
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome to Flashcard SaaS
          </h1>
          <h2 className="text-2xl mb-8">
            The easiest way to create flashcards from your text.
          </h2>
          <div className="flex justify-center space-x-4">
            <a
              href="/generate"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
              Get Started
            </a>
            <a
              href="#"
              className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition"
            >
              Learn More
            </a>
          </div>
        </section>
        <section className="my-12">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Replace these placeholder items with your feature content */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
              <p>Details about feature 1.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Feature 2</h3>
              <p>Details about feature 2.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Feature 3</h3>
              <p>Details about feature 3.</p>
            </div>
          </div>
        </section>
        <section className="my-12 text-center">
          <h2 className="text-3xl font-bold mb-8">Pricing</h2>
          <div className="flex justify-center space-x-8">
            {/* Replace these placeholder items with your pricing plans */}
            <div className="bg-white shadow-lg rounded-lg p-6 w-64">
              <h3 className="text-xl font-semibold mb-4">Basic Plan</h3>
              <p className="text-2xl font-bold mb-4">$10 / month</p>
              <ul className="mb-4">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
              <a
                href="#"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                Choose Plan
              </a>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 w-64">
              <h3 className="text-xl font-semibold mb-4">Pro Plan</h3>
              <p className="text-2xl font-bold mb-4">$30 / month</p>
              <ul className="mb-4">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                <li>Feature 4</li>
              </ul>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                Choose Plan
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
