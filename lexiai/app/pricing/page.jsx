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
import Pricing from '@/components/Pricing';

const Page = () => {
  return (
    // <section className='mx-20 my-12 text-center'>
    //   <h2 className="text-3xl font-bold mb-8">Pricing</h2>
    //   <div className="flex items-start justify-center flex-wrap gap-5 w-full">
    //     {
    //       pricing.map(plan => (
    //         <Card className="w-1/4 shadow-md" key={plan.title}>
    //           <CardHeader>
    //             <CardTitle>{plan.title}</CardTitle>
    //             <CardDescription>{plan.price}</CardDescription>
    //           </CardHeader>

    //           <CardContent>
    //             <ul>
    //               {plan.features.map((feature, index) => (
    //                 <li key={index}>{feature}</li>
    //               ))}
    //             </ul>
    //           </CardContent>
    //           <CardFooter className="flex justify-center">
    //             <Button>Get Started</Button>
    //           </CardFooter>
    //         </Card>
    //       ))
    //     }
    //   </div>
    // </section>

    <section className='my-36'>
      
      <Pricing />
    </section>
  );
};

export default Page;
