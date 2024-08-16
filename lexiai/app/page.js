
import Image from "next/image";
import { features, pricing } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaClock, FaChartBar } from 'react-icons/fa';

const Icon = ({ name, className }) => {
  switch (name) {
    case 'clock':
      return <FaClock className={className} />;
    case 'chart':
      return <FaChartBar className={className} />;
    case 'graph':
        return <FaChartBar className={className} />;  
    default:
      return null;
  }
};
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <section className="text-center my-20 md:my-32">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-900">
          Learn with Lexi AI
        </h1>
        <h2 className="text-2xl mb-8 text-purple-500">
          Flashcards in a flash
        </h2>
        <div className="flex justify-center space-x-6">
          <Link href="/sign-up">
            <Button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out">
              Get Started
            </Button>
          </Link>
          <Link href="/">
            <Button className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-full shadow-lg hover:from-gray-400 hover:to-gray-500 transition duration-300 ease-in-out">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="my-36 md:my-48">
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-900">
          Features
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="w-full max-w-xs p-6 bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <CardHeader>
              <Icon name={feature.icon} className="text-2xl text-purple-700 mr-4" />
                <CardTitle className="text-xl font-semibold text-purple-700">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-indigo-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="my-24 md:my-36 text-center">
        <h2 className="text-4xl font-bold mb-12 text-indigo-900">Pricing</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {pricing.map((plan, index) => (
            <Card
              key={index}
              className="w-full max-w-xs p-6 bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-purple-700">
                  {plan.title}
                </CardTitle>
                <CardDescription className="text-indigo-600">
                  {plan.price}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="list-disc list-inside text-left text-indigo-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center mt-6">
                <Button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
