import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <div className="relative bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
    <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="pt-4 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Tell us about your design",
      description: "Answer a few questions to help us understand your vision and style preferences."
    },
    {
      number: 2,
      title: "Customize your design",
      description: "Use our interactive editor to perfect your design before finalizing your order."
    },
    {
      number: 3,
      title: "Ship and enjoy",
      description: "Receive your custom-printed t-shirt delivered to your doorstep."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-gray">T-shirt printing made easy</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Our streamlined design process makes it simple to create your perfect custom t-shirt in just a few steps.
          </p>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-lightGreen -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/how-it-works">
            <Button variant="outline" className="border-brand-green text-brand-green hover:text-brand-darkGreen">
              Learn More About The Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;