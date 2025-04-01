import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingTierProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

const PricingTier = ({ title, price, features, isPopular = false }: PricingTierProps) => (
  <div 
    className={`bg-white p-8 rounded-lg ${
      isPopular 
        ? 'border-2 border-brand-green shadow-lg' 
        : 'border border-gray-200 shadow-sm'
    } flex flex-col relative`}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-green text-white text-sm px-3 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold">{title}</h3>
    <div className="mt-4 text-4xl font-bold text-brand-green">
      {price}
    </div>
    <p className="mt-2 text-gray-500">per shirt</p>
    <ul className="mt-6 space-y-3 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="h-5 w-5 text-brand-green mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button className="mt-8 w-full bg-brand-green hover:bg-brand-darkGreen text-white">
      Choose {title}
    </Button>
  </div>
);

const PricingSection = () => {
  const pricingTiers = [
    {
      title: "Basic",
      price: "$19.99",
      features: [
        "Standard cotton", 
        "Basic colors", 
        "Simple design", 
        "Standard shipping"
      ]
    },
    {
      title: "Premium",
      price: "$29.99",
      features: [
        "Premium cotton blend", 
        "Extended color options", 
        "Complex designs", 
        "Expedited shipping",
        "Design assistance"
      ],
      isPopular: true
    },
    {
      title: "Business",
      price: "$39.99",
      features: [
        "Luxury fabric", 
        "All color options", 
        "Advanced designs", 
        "Priority shipping",
        "Dedicated designer",
        "Bulk discounts"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-gray">Simple pricing for everyone</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              title={tier.title}
              price={tier.price}
              features={tier.features}
              isPopular={tier.isPopular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;