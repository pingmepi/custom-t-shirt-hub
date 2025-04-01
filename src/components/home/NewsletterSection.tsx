import { useState } from "react";
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would add the logic to subscribe the user
    console.log("Subscribing email:", email);
    setEmail("");
    // You could add a toast notification here
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubscribe}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              />
              <Button 
                type="submit" 
                className="bg-brand-green hover:bg-brand-darkGreen text-white whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;