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
    <section className='my-36'>
      <Pricing />
    </section>
  );
};

export default Page;
