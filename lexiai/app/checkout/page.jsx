'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { convertToSubcurrency } from '@/lib/utils'
import CheckoutForm from '@/components/CheckoutForm'

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is undefined')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)


import React from 'react'

const page = () => {

    const amount = 10.00;

    return (
        <div>
            <Elements
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubcurrency(amount),   
                    currency: 'usd',
                }}
            >
                <CheckoutForm amount={amount} />
            </Elements>

        </div>
    )
}

export default page