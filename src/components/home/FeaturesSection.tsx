import { Brush, Zap, Truck } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <div className="bg-brand-lightGreen p-4 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brush className="h-6 w-6 text-brand-green" />,
      title: "It's that simple",
      description: "Answer a few questions about your design preferences and our intuitive editor takes care of the rest."
    },
    {
      icon: <Zap className="h-6 w-6 text-brand-green" />,
      title: "Try different styles",
      description: "Experiment with various designs, colors, and layouts to find the perfect look for your shirt."
    },
    {
      icon: <Truck className="h-6 w-6 text-brand-green" />,
      title: "Ship worldwide",
      description: "We deliver your custom-made t-shirts quickly and safely anywhere in the world."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-gray">Bring your ideas to life in minutes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;