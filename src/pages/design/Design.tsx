
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowLeft, ArrowRight, Save, ShoppingCart, LogIn } from "lucide-react";
import QuestionForm from "@/components/design/QuestionForm";
import DesignCanvas from "@/components/design/DesignCanvas";
import TShirtOptions from "@/components/design/TShirtOptions";
import { toast } from "sonner";
import { TShirtOptions as TShirtOptionsType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DesignPage = () => {
  const [activeStep, setActiveStep] = useState<string>("questions");
  const [questionResponses, setQuestionResponses] = useState<Record<string, any>>({});
  const [designData, setDesignData] = useState<any>(null);
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOptionsType>({
    color: "#ffffff",
    size: "M",
    quantity: 1,
  });
  const [isDesignComplete, setIsDesignComplete] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    fetchUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const handleQuestionsComplete = (responses: Record<string, any>) => {
    setQuestionResponses(responses);
    setActiveStep("design");
    toast.success("Preferences saved! Let's customize your design.");
  };

  const handleDesignUpdated = (data: any) => {
    setDesignData(data);
  };

  const handleOptionsChange = (options: TShirtOptionsType) => {
    setTshirtOptions(options);
  };

  const handleSaveDesign = async () => {
    if (!user) {
      toast.error("Please login or sign up to save your design");
      navigate("/login");
      return;
    }
    
    try {
      // Save the design to the database
      const { data, error } = await supabase
        .from("designs")
        .insert({
          user_id: user.id,
          question_responses: questionResponses,
          design_data: designData,
          preview_url: "/design-flow.png" // This would be replaced with an actual preview in a real implementation
        });
        
      if (error) throw error;
      
      setIsDesignComplete(true);
      toast.success("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      toast.error("Failed to save design. Please try again.");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login or sign up to add to cart");
      navigate("/login");
      return;
    }
    toast.success("Added to cart successfully!");
  };

  const handleNavigateToStep = (step: string) => {
    if (step === "design" && !Object.keys(questionResponses).length) {
      toast.error("Please complete the questions first");
      return;
    }
    
    if (step === "options" && !designData) {
      toast.error("Please customize your design first");
      return;
    }
    
    // Check auth for design step (editing) and options step
    if ((step === "design" || step === "options") && !user) {
      toast.error("Please login or sign up to customize your design");
      return;
    }
    
    setActiveStep(step);
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Custom T-Shirt</h1>
        <p className="text-lg text-gray-600">
          Follow these steps to design a t-shirt that's uniquely yours.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green transition-width duration-500"
              style={{ width: activeStep === "questions" ? "33%" : activeStep === "design" ? "66%" : "100%" }}
            ></div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  activeStep === "questions" 
                    ? "border-brand-green bg-brand-green text-white" 
                    : Object.keys(questionResponses).length 
                      ? "border-brand-green bg-brand-lightGreen" 
                      : "border-gray-300"
                }`}
              >
                {Object.keys(questionResponses).length ? <CheckCircle size={18} /> : "1"}
              </div>
              <span className="mt-2 text-sm font-medium">Preferences</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  activeStep === "design" 
                    ? "border-brand-green bg-brand-green text-white" 
                    : designData 
                      ? "border-brand-green bg-brand-lightGreen" 
                      : "border-gray-300"
                }`}
              >
                {designData ? <CheckCircle size={18} /> : "2"}
              </div>
              <span className="mt-2 text-sm font-medium">Design</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  activeStep === "options" 
                    ? "border-brand-green bg-brand-green text-white" 
                    : isDesignComplete 
                      ? "border-brand-green bg-brand-lightGreen" 
                      : "border-gray-300"
                }`}
              >
                {isDesignComplete ? <CheckCircle size={18} /> : "3"}
              </div>
              <span className="mt-2 text-sm font-medium">Options</span>
            </div>
          </div>
        </div>
      </div>

      {!user && (activeStep === "design" || activeStep === "options") ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login or create an account to customize your design.
          </p>
          <Button onClick={redirectToLogin} className="bg-brand-green hover:bg-brand-darkGreen">
            <LogIn className="mr-2 h-4 w-4" />
            Login / Sign Up
          </Button>
        </div>
      ) : (
        <Tabs value={activeStep} onValueChange={handleNavigateToStep}>
          <TabsList className="hidden">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="design">Design Editor</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="mt-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tell us about your vision</h2>
                <p className="text-gray-600 mb-6">
                  Answer a few questions to help us understand what kind of t-shirt design you're looking for.
                </p>
                
                <QuestionForm 
                  questions={[]} // We'll now fetch questions from the database
                  onComplete={handleQuestionsComplete} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="design" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,300px] lg:gap-8">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Design Your T-Shirt</h2>
                  <p className="text-gray-600 mb-6">
                    Use the editor below to customize your design. Add text, shapes, or upload your own images.
                  </p>
                  
                  <DesignCanvas 
                    initialImageUrl="/design-flow.png"
                    onDesignUpdated={handleDesignUpdated}
                  />
                  
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep("questions")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Questions
                    </Button>
                    <Button
                      onClick={() => setActiveStep("options")}
                      disabled={!designData}
                      className="bg-brand-green hover:bg-brand-darkGreen"
                    >
                      Next: Choose Options
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Preferences</h3>
                  <div className="space-y-2">
                    {Object.entries(questionResponses).map(([questionId, answer]) => (
                      <div key={questionId} className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">
                          Question {questionId.replace("q", "")}:
                        </span>
                        <span className="text-sm">{answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Select T-Shirt Options</h2>
                  <p className="text-gray-600 mb-6">
                    Choose the color, size, and quantity for your custom t-shirt.
                  </p>
                  
                  <TShirtOptions 
                    onOptionsChange={handleOptionsChange}
                    defaultOptions={tshirtOptions}
                  />
                  
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep("design")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Design
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleSaveDesign}
                        className="border-brand-green text-brand-green hover:text-brand-darkGreen"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Design
                      </Button>
                      <Button
                        onClick={handleAddToCart}
                        className="bg-brand-green hover:bg-brand-darkGreen"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-medium">Custom T-Shirt Design</span>
                      <span className="font-medium">$29.99</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Color:</span>
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: tshirtOptions.color }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Size:</span>
                      <span>{tshirtOptions.size}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Quantity:</span>
                      <span>{tshirtOptions.quantity}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Item Total:</span>
                      <span>${(29.99 * tshirtOptions.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>Shipping:</span>
                      <span>$5.99</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t font-medium">
                      <span>Total:</span>
                      <span>${(29.99 * tshirtOptions.quantity + 5.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DesignPage;
