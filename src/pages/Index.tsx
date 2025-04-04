
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkle, Zap, Truck, Brush, Check } from "lucide-react";
import FeaturedDesigns from "@/components/FeaturedDesigns";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
                src="/images/tshirt/mockup-5.png" 
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-gray">Bring your ideas to life in minutes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-brand-lightGreen p-4 rounded-full mb-6">
                <Brush className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">It's that simple</h3>
              <p className="text-gray-600">
                Answer a few questions about your design preferences and our intuitive editor takes care of the rest.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-brand-lightGreen p-4 rounded-full mb-6">
                <Zap className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Try different styles</h3>
              <p className="text-gray-600">
                Experiment with various designs, colors, and layouts to find the perfect look for your shirt.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-brand-lightGreen p-4 rounded-full mb-6">
                <Truck className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ship worldwide</h3>
              <p className="text-gray-600">
                We deliver your custom-made t-shirts quickly and safely anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase - Using the new FeaturedDesigns component */}
      <FeaturedDesigns />

      {/* How It Works */}
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
              <div className="relative bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <div className="pt-4 text-center">
                  <h3 className="text-xl font-semibold mb-2">Tell us about your design</h3>
                  <p className="text-gray-600">
                    Answer a few questions to help us understand your vision and style preferences.
                  </p>
                </div>
              </div>
              
              <div className="relative bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <div className="pt-4 text-center">
                  <h3 className="text-xl font-semibold mb-2">Customize your design</h3>
                  <p className="text-gray-600">
                    Use our interactive editor to perfect your design before finalizing your order.
                  </p>
                </div>
              </div>
              
              <div className="relative bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <div className="pt-4 text-center">
                  <h3 className="text-xl font-semibold mb-2">Ship and enjoy</h3>
                  <p className="text-gray-600">
                    Receive your custom-printed t-shirt delivered to your doorstep.
                  </p>
                </div>
              </div>
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

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-gray">Simple pricing for everyone</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold">Basic</h3>
              <div className="mt-4 text-4xl font-bold text-brand-green">
                $19.99
              </div>
              <p className="mt-2 text-gray-500">per shirt</p>
              <ul className="mt-6 space-y-3 flex-grow">
                {["Standard cotton", "Basic colors", "Simple design", "Standard shipping"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-brand-green mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full bg-brand-green hover:bg-brand-darkGreen text-white">
                Choose Basic
              </Button>
            </div>
            
            <div className="bg-white p-8 rounded-lg border-2 border-brand-green shadow-lg flex flex-col relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-green text-white text-sm px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold">Premium</h3>
              <div className="mt-4 text-4xl font-bold text-brand-green">
                $29.99
              </div>
              <p className="mt-2 text-gray-500">per shirt</p>
              <ul className="mt-6 space-y-3 flex-grow">
                {[
                  "Premium cotton blend", 
                  "Extended color options", 
                  "Complex designs", 
                  "Expedited shipping",
                  "Design assistance"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-brand-green mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full bg-brand-green hover:bg-brand-darkGreen text-white">
                Choose Premium
              </Button>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold">Business</h3>
              <div className="mt-4 text-4xl font-bold text-brand-green">
                $39.99
              </div>
              <p className="mt-2 text-gray-500">per shirt</p>
              <ul className="mt-6 space-y-3 flex-grow">
                {[
                  "Luxury fabric", 
                  "All color options", 
                  "Advanced designs", 
                  "Priority shipping",
                  "Dedicated designer",
                  "Bulk discounts"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-brand-green mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full bg-brand-green hover:bg-brand-darkGreen text-white">
                Choose Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-brand-gray">Subscribe to our newsletter</h2>
              <p className="mt-4 text-gray-600">
                Stay up to date with the latest designs, offers, and t-shirt printing tips.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <Button className="bg-brand-green hover:bg-brand-darkGreen text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
