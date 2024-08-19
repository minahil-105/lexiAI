'use client'

import React, {useEffect, useState} from 'react'
import { 
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js'
import { convertToSubcurrency } from '@/lib/utils'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe()
    const elements = useElements()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [clientSecret, setClientSecret] = useState(null)

    useEffect(() => {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to create payment intent")
          }
          return res.json()
        })
        .then((data) => {
          setClientSecret(data.clientSecret)
        })
        .catch((error) => {
          console.error(error)
        }
      )
    }, [amount])  

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!stripe || !elements) {
            return
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            setError(submitError.message)
            setLoading(false)
            return
        }

        // confirm payment}

        const { error } = await stripe.confirmCardPayment(clientSecret, {
            elements,
            confirmParams: {
                return_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://example.com'}/payment-succes?amount=${amount}`,
            },
        })

        if (error) {
            setError(result.error.message)
        } else {
            setError(null)
        }
        setLoading(false)  
    }

    if (!clientSecret) {
        return (
            // <div className="mt-40">
                <Skeleton className='w-1/2 max-w-[32rem]' />
            // </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className='bg-white p-2 rounded-md w-1/2 max-w-[32rem] mx-auto pt-64 space-y-5'>
                {clientSecret && (
                    <PaymentElement
                    className='p-2 mb-4'
                        options={{
                            clientSecret,
                        }}
                    />
                )}

                {error && <div className='text-red-500 text-center'>{error}</div>}
                {clientSecret}
                <Button  className="w-full disabled:opacity-50 disabled:animate-pulse tracking-wide font-semibold" size="lg" disabled={!stripe || loading}>
                    {loading ? "Processing..." : `Pay $${amount}`}
                </Button>
        </form>
    )
 }

export default CheckoutForm