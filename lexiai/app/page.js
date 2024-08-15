'use client'
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";
import { features, pricing } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import Link from 'next/link';




export default function Home() {
  const router = useRouter();

  const [cards, setCards] = useState(null);

  // const handleCheckout = async () => {
  //   const checkoutSession = await fetch('/api/checkout_sessions', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  //   const checkoutSessionJson = await checkoutSession.json();

  //   const stripe = await getStripe();
  //   const { error } = await stripe.redirectToCheckout({
  //     sessionId: checkoutSessionJson.id,
  //   });

  //   if (error) {
  //     console.warn(error.message);
  //   }
  // };

  return (
    <main className='mx-40'>
      <section className="text-center my-32">
        <h1 className="text-4xl font-extrabold mb-4">
          Learn with Lexi AI
        </h1>
        <h2 className="text-2xl mb-8">
          Flashcards in a flash
        </h2>
        <div className="flex justify-center space-x-4">
          <Link href="/generate">
            <Button >
              Get Started

            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">
              Learn More
            </Button>
          </Link>
        </div>
      </section>


      {/* features */}
      <section className="my-48">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="flex items-center justify-center flex-wrap gap-5 w-full mx">
          {/* Replace these placeholder items with your feature content */}
          {
            features.map(feature => (
              <Card className="w-1/4 shadow-md">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.title}</CardDescription>
                </CardHeader>
              </Card>
            ))
          }
        </div>
      </section>

      {/* pricing */}
      <section className="my-12 text-center">
        <h2 className="text-3xl font-bold mb-8">Pricing</h2>
        <div className="flex items-start justify-center flex-wrap gap-5 w-full">
          {/* Replace these placeholder items with your feature content */}
          {
            pricing.map(plan => (
              <Card className="w-1/4 shadow-md">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>{plan.price}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul>
                    {
                      plan.features.map(feature => (
                        <li>{feature}</li>
                      ))
                    }
                  </ul>

                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button>Get Started</Button>
                </CardFooter>
              </Card>
            ))
          }
        </div>
      </section>
    </main >
  );
}
