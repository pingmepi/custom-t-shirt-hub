
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkle, Paintbrush, ShoppingCart, Truck } from "lucide-react";

const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Creating your perfect custom t-shirt is simple with our easy 4-step process
        </p>
      </div>

      {/* Step 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24">
        <div className="order-2 md:order-1">
          <div className="bg-brand-lightGreen rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-brand-green font-bold text-lg">1</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Tell us about your design</h2>
          <p className="text-lg text-gray-600 mb-6">
            Answer a few simple questions about your preferences, style, and the message you want to convey. This helps us understand your vision and provide you with the best design options.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Share your main message or theme</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Select your preferred style</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Choose color preferences</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Tell us about the intended use</span>
            </li>
          </ul>
        </div>
        <div className="order-1 md:order-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <img 
              src="/tshirt-mockup-1.png" 
              alt="Design questionnaire" 
              className="w-full h-auto rounded" 
            />
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24">
        <div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <img 
              src="/design-flow.png" 
              alt="Design editor" 
              className="w-full h-auto rounded" 
            />
          </div>
        </div>
        <div>
          <div className="bg-brand-lightGreen rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-brand-green font-bold text-lg">2</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Customize your design</h2>
          <p className="text-lg text-gray-600 mb-6">
            Use our intuitive design editor to perfect your t-shirt. Our intelligent system creates an initial design based on your preferences that you can then customize to your liking.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Adjust text and graphics</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Add your own elements</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Change colors and sizes</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>See real-time preview</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24">
        <div className="order-2 md:order-1">
          <div className="bg-brand-lightGreen rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-brand-green font-bold text-lg">3</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Select your options and checkout</h2>
          <p className="text-lg text-gray-600 mb-6">
            Choose your preferred t-shirt color, size, and quantity. Review your order and proceed to our secure checkout process to complete your purchase.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Multiple color options available</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Sizes from XS to XXL</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Bulk discounts for multiple items</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Secure payment processing</span>
            </li>
          </ul>
        </div>
        <div className="order-1 md:order-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <img 
              src="/tshirt-mockup-3.png" 
              alt="T-shirt options" 
              className="w-full h-auto rounded" 
            />
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <img 
              src="/tshirt-mockup-4.png" 
              alt="Delivery process" 
              className="w-full h-auto rounded" 
            />
          </div>
        </div>
        <div>
          <div className="bg-brand-lightGreen rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-brand-green font-bold text-lg">4</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Receive your custom t-shirt</h2>
          <p className="text-lg text-gray-600 mb-6">
            We carefully print and package your custom design and ship it directly to your doorstep. Track your order every step of the way for peace of mind.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>High-quality printing process</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Careful packaging and handling</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Real-time shipment tracking</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-brand-green mr-2 mt-1" />
              <span>Fast delivery to your door</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Why Choose CustomTee?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform offers unique features that make designing and ordering custom t-shirts easier than ever
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-brand-lightGreen p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkle className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Design Assistance</h3>
            <p className="text-gray-600">
              Our system learns from your preferences to suggest design elements that match your style.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-brand-lightGreen p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Paintbrush className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Editor</h3>
            <p className="text-gray-600">
              Powerful yet easy-to-use design tools that give you complete creative freedom.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-brand-lightGreen p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <ShoppingCart className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Simple Ordering</h3>
            <p className="text-gray-600">
              Streamlined checkout process with multiple payment options for your convenience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-brand-lightGreen p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick production and shipping to get your custom t-shirts to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to create your custom t-shirt?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Start designing now and have your unique t-shirt delivered to your doorstep in no time!
        </p>
        <Link to="/design">
          <Button className="bg-brand-green hover:bg-brand-darkGreen text-white text-lg px-8 py-6">
            Start Designing Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
