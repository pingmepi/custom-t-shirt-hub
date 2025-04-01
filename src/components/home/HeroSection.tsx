import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-white to-brand-lightGreen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-gray leading-tight">
              T-shirt printing
              <span className="block text-brand-green">made easy.</span>
            </h1>
            <p className="text-lg text-gray-600">
              Create your perfect custom t-shirt in minutes with our intuitive design platform. No design skills required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/design">
                <Button className="bg-brand-green hover:bg-brand-darkGreen text-white text-lg px-8 py-6">
                  Start Designing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/designs">
                <Button variant="outline" className="border-brand-green text-brand-green hover:text-brand-darkGreen text-lg px-8 py-6">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-slide-up">
            <img 
              src="/tshirt-mockup-5.png" 
              alt="T-shirt mockup" 
              className="w-full h-auto rounded-lg shadow-xl" 
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-green text-white rounded-full p-4">
              <Sparkle className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;