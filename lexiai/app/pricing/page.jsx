import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { pricing } from '@/lib/data'

const page = () => {
  return (
    <section className='mx-20 my-12 text-center'>
        <h2 className="text-3xl font-bold mb-8">Pricing</h2>
        <div className="flex items-start justify-center flex-wrap gap-5 w-full">
          {/* Replace these placeholder items with your feature content */}
          {
            pricing.map(plan => (
              <Card className="w-1/4 shadow-md" key={plan.title}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>{plan.price}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul>
                    { plan.features.map(feature => <li>{feature}</li> ) }
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
  )
}

export default page