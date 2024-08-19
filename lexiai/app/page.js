import Image from "next/image";
import { features, pricing } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaClock, FaChartBar } from "react-icons/fa";
import { ModeToggle } from "@/components/mode-toggle";

const Icon = ({ name, className }) => {
  switch (name) {
    case "clock":
      return <FaClock className={className} />;
    case "chart":
      return <FaChartBar className={className} />;
    case "graph":
      return <FaChartBar className={className} />;
    default:
      return null;
  }
};

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <section className="text-center mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 md:mb-8 text-indigo-900 dark:text-indigo-300 shadow-sm">
          Learn with Lexi AI
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 md:mb-8 text-purple-500 dark:text-purple-300">Flashcards in a flash</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/sign-up">
            <Button className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 dark:shadow-purple-900 transition duration-300 ease-in-out">
              Get Started
            </Button>
          </Link>
          <Link href="/">
            <Button className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200 rounded-full shadow-lg hover:from-gray-400 hover:to-gray-500 dark:hover:from-gray-600 dark:hover:to-gray-700 transition duration-300 ease-in-out">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-indigo-900 dark:text-indigo-300">
          Features
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="w-full sm:w-80 max-w-xs p-4 sm:p-6 bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md dark:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl dark:hover:shadow-2xl hover:bg-indigo-100 dark:hover:bg-gray-700"
            >
              <CardHeader>
                <Icon
                  name={feature.icon}
                  className="text-xl sm:text-2xl text-purple-700 dark:text-purple-400 mb-2"
                />
                <CardTitle className="text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-400">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-indigo-600 dark:text-indigo-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 text-indigo-900 dark:text-indigo-300">
          Pricing
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {pricing.map((plan, index) => (
            <Card
              key={index}
              className="w-full sm:w-72 max-w-xs p-4 sm:p-6 bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md dark:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl dark:hover:shadow-2xl hover:bg-indigo-100 dark:hover:bg-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-400">
                  {plan.title}
                </CardTitle>
                <CardDescription className="text-indigo-600 dark:text-indigo-300">
                  {plan.price}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="list-disc list-inside text-left text-indigo-700 dark:text-indigo-300">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center mt-4 sm:mt-6">
                <Link href="/result">
                  <Button className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 dark:shadow-purple-900 transition duration-300 ease-in-out">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
