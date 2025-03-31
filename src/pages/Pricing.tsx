
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, HelpCircle } from "lucide-react";

const PricingPage = () => {
  const pricingTiers = [
    {
      name: "Basic",
      price: 19.99,
      description: "Perfect for simple designs and personal use",
      features: [
        "Standard cotton material",
        "Basic color options",
        "Simple text and graphics",
        "Standard shipping (5-7 days)",
        "1 design revision",
      ],
    },
    {
      name: "Premium",
      price: 29.99,
      description: "Great for detailed designs and gifts",
      features: [
        "Premium cotton blend",
        "Extended color palette",
        "Complex designs with multiple elements",
        "Expedited shipping (3-5 days)",
        "3 design revisions",
        "Design assistance",
      ],
      popular: true,
    },
    {
      name: "Business",
      price: 39.99,
      description: "Ideal for teams and professional use",
      features: [
        "Luxury fabric options",
        "All color options",
        "Advanced designs with special effects",
        "Priority shipping (2-3 days)",
        "Unlimited design revisions",
        "Dedicated designer",
        "Bulk discounts available",
      ],
    },
  ];

  const faqs = [
    {
      question: "What is the difference between the fabric options?",
      answer: "Standard cotton is our basic 100% cotton t-shirt. Premium cotton blend offers better durability and comfort with a cotton-polyester mix. Luxury fabric options include tri-blend fabrics that offer superior softness and a more tailored fit.",
    },
    {
      question: "How many revisions can I make to my design?",
      answer: "The Basic tier includes 1 revision after your initial design is created. Premium includes 3 revisions, and Business offers unlimited revisions to ensure you get exactly what you want.",
    },
    {
      question: "What are bulk discounts?",
      answer: "Bulk discounts apply to orders of 10 or more shirts. The discount percentage increases with larger quantities: 10-24 shirts (5% off), 25-49 shirts (10% off), 50+ shirts (15% off).",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days, expedited shipping takes 3-5 business days, and priority shipping takes 2-3 business days. Shipping times may vary depending on your location.",
    },
    {
      question: "Can I return my t-shirt if I'm not satisfied?",
      answer: "Since all our t-shirts are custom made, we cannot accept returns unless there is a manufacturing defect. We do offer design previews before printing to ensure you're happy with your design.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! International shipping costs and delivery times will be calculated at checkout based on your location.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple pricing for everyone</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the perfect plan for your custom t-shirt needs, with transparent pricing and no hidden fees
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingTiers.map((tier, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg ${
              tier.popular ? "border-2 border-brand-green shadow-lg transform -translate-y-2" : "border border-gray-200 shadow-sm"
            } relative overflow-hidden`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-0 right-0 bg-brand-green text-white text-center py-1.5 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className={`p-8 ${tier.popular ? "pt-14" : ""}`}>
              <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-brand-green">${tier.price}</span>
                <span className="ml-1 text-gray-500">per shirt</span>
              </div>
              
              <p className="mt-2 text-gray-600">{tier.description}</p>
              
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-brand-green mr-3 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/design" className="block mt-8">
                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? "bg-brand-green hover:bg-brand-darkGreen" 
                      : "bg-white border-2 border-brand-green text-brand-green hover:bg-brand-lightGreen"
                  }`}
                >
                  {tier.popular ? "Choose Premium" : `Choose ${tier.name}`}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compare Features</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Feature</th>
                <th className="py-4 px-6 text-center text-sm font-medium text-gray-600 uppercase tracking-wider">Basic</th>
                <th className="py-4 px-6 text-center text-sm font-medium text-brand-green uppercase tracking-wider bg-brand-lightGreen">Premium</th>
                <th className="py-4 px-6 text-center text-sm font-medium text-gray-600 uppercase tracking-wider">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Material Quality</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Standard Cotton</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">Premium Cotton Blend</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Luxury Fabric Options</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Color Options</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">5 Basic Colors</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">15 Extended Colors</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">25+ Colors</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Design Complexity</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Simple</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">Complex</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Advanced</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Shipping Speed</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Standard (5-7 days)</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">Expedited (3-5 days)</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Priority (2-3 days)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Design Revisions</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">1 Revision</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">3 Revisions</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Design Assistance</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">❌</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">✅</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">✅ (Dedicated Designer)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">Bulk Discounts</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">❌</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center bg-brand-lightGreen bg-opacity-20">❌</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Pricing */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bulk Order Discounts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <span className="block text-5xl font-bold text-brand-green">5%</span>
              <span className="block text-lg font-medium mt-2">Discount</span>
            </div>
            <div className="text-center mt-6">
              <span className="block text-gray-900 font-medium">10-24 shirts</span>
              <span className="block text-gray-600 mt-1">Perfect for small teams and events</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <span className="block text-5xl font-bold text-brand-green">10%</span>
              <span className="block text-lg font-medium mt-2">Discount</span>
            </div>
            <div className="text-center mt-6">
              <span className="block text-gray-900 font-medium">25-49 shirts</span>
              <span className="block text-gray-600 mt-1">Great for medium-sized organizations</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <span className="block text-5xl font-bold text-brand-green">15%</span>
              <span className="block text-lg font-medium mt-2">Discount</span>
            </div>
            <div className="text-center mt-6">
              <span className="block text-gray-900 font-medium">50+ shirts</span>
              <span className="block text-gray-600 mt-1">Ideal for large groups and businesses</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/contact">
            <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-lightGreen">
              Contact Us for Custom Quotes
            </Button>
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <HelpCircle className="h-6 w-6 text-brand-green mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-lightGreen rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to create your custom t-shirt?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Start with our user-friendly design tool and bring your ideas to life!
          </p>
          <Link to="/design">
            <Button className="bg-brand-green hover:bg-brand-darkGreen text-white text-lg px-8 py-6">
              Start Designing Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
