import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { pricing } from '@/lib/data';

const Page = () => {
  return (
    <section className='mx-4 md:mx-10 lg:mx-20 my-8 md:my-12 text-center'>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-indigo-900 dark:text-indigo-300">
        Pricing
      </h2>
      <div className="flex flex-col sm:flex-row items-start justify-center flex-wrap gap-4 sm:gap-5 w-full">
        {
          pricing.map(plan => (
            <Card 
              key={plan.title}
              className="w-full max-w-xs p-4 bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md dark:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl dark:hover:shadow-2xl hover:bg-indigo-100 dark:hover:bg-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-400">
                  {plan.title}
                </CardTitle>
                <CardDescription className="text-indigo-600 dark:text-indigo-300">
                  {plan.price}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="list-disc list-inside text-left text-indigo-700 dark:text-indigo-300">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center mt-4">
                <Button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 dark:shadow-purple-900 transition duration-300 ease-in-out">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))
        }
      </div>
    </section>
  );
};

export default Page;
