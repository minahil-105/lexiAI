
// features for a ai powered flashcards app  to display on cards

export const navLinks = [
    {
        title: "Home",
        href: "/"
    },
    {
        title: "Decks",
        href: "/decks"
    },
    {
        title: "Pricing",
        href: "/pricing"
    },
]

export const features = [
    {
        title: "Intelligent Spaced Repetition",
        description: "Our AI algorithm optimizes your study schedule to ensure maximum retention and recall.",
        icon: "clock"
    },
    {
        title: "Personalized Learning Paths",
        description: "Get tailored learning paths based on your strengths, weaknesses, and learning style.",
        icon: "chart"

    },
    {
        title: "Real-time Progress Tracking",
        description: "Monitor your progress, identify areas for improvement, and celebrate your achievements.",
        icon: "graph"
    },

]

export const pricing = [
    {
        title: "Basic Plan",
        price: "$7.99 / month",
        features: [
            "feature 1",
            "feature 2",
            "feature 3",
        ]
    },
    {
        title: "Starter Plan",
        price: "$10.99 / month",
        features: [
            "feature 1",
            "feature 2",
            "feature 3",
            "feature 4",
            "feature 5",
        ]
    },
    {
        title: "Pro Plan",
        price: "$13.99 / month",
        features: [
            "feature 1",
            "feature 2",
            "feature 3",
            "feature 4",
            "feature 5",
            "feature 6",
        ]
    },
]


export const plans = [
    {
        title: "Basic",
        monthlyPrice: 10,
        yearlyPrice: 100,
        description: "Essential features you need to get started",
        features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
        priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_MONTHLY,
        priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_YEARLY,
        actionLabel: "Get Started",
    },
    {
        title: "Pro",
        monthlyPrice: 25,
        yearlyPrice: 250,
        description: "Advanced features for serious students and educators",
        features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
        actionLabel: "Get Started",
        priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
        priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY,
        popular: true,
    },
    {
        title: "Academic",
        price: "Custom",
        description: "Specialized tools for researchers and advanced academic study",
        features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3", "Super Exclusive Feature"],
        actionLabel: "Contact Sales",
        priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ACADEMIC_MONTHLY,
        priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ACADEMIC_YEARLY,
        exclusive: true,
    },
]
