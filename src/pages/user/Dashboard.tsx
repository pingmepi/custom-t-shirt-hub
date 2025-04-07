
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { TShirtDesign, OrderDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShoppingBag, Palette, AlertCircle } from "lucide-react";

const UserDashboard = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("designs");

  // Use useEffect for navigation instead of conditional rendering
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Define queries outside of conditional rendering
  const {
    data: designs,
    isLoading: designsLoading,
    error: designsError
  } = useQuery({
    queryKey: ['userDesigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TShirtDesign[];
    },
    enabled: !!user && isAuthenticated // Only run query when user is available
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError
  } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      // This is a placeholder for actual order fetching logic
      // In production, this would fetch from a real orders table
      return [] as OrderDetails[];
    },
    enabled: !!user && isAuthenticated // Only run query when user is available
  });

  // If not authenticated, show loading or nothing
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  const handleCreateNewDesign = () => {
    navigate("/design");
  };

  const handleEditDesign = (designId: string) => {
    navigate(`/design/${designId}`);
  };

  const handleReorder = (designId: string) => {
    navigate(`/checkout/${designId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {userProfile?.full_name || user?.email}! Manage your saved designs and track your orders
          </p>
        </div>
        <Button
          onClick={handleCreateNewDesign}
          className="mt-4 md:mt-0 bg-brand-green hover:bg-brand-darkGreen"
        >
          <Palette className="mr-2 h-4 w-4" />
          Create New Design
        </Button>
      </div>

      <Tabs defaultValue="designs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="designs">My Designs</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="designs">
          {designsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
            </div>
          ) : designsError ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <p>There was an error loading your designs. Please try again later.</p>
              </CardContent>
            </Card>
          ) : designs && designs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <Card key={design.id}>
                  <CardHeader>
                    <CardTitle className="truncate">
                      {typeof design.question_responses.title === 'string'
                        ? design.question_responses.title
                        : typeof design.question_responses.title === 'object' && 'answer' in design.question_responses.title
                          ? String(design.question_responses.title.answer)
                          : "Untitled Design"}
                    </CardTitle>
                    <CardDescription>
                      Created on {new Date(design.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={design.preview_url || "/placeholder.svg"}
                        alt="T-shirt design preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleEditDesign(design.id)}>
                      Edit Design
                    </Button>
                    <Button onClick={() => handleReorder(design.id)}>
                      Order Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="mb-6">You haven't created any designs yet.</p>
                <Button onClick={handleCreateNewDesign} className="bg-brand-green hover:bg-brand-darkGreen">
                  Create Your First Design
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
            </div>
          ) : ordersError ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <p>There was an error loading your orders. Please try again later.</p>
              </CardContent>
            </Card>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.design_id}>
                  <CardHeader>
                    <CardTitle>Order #{order.design_id.substring(0, 8)}</CardTitle>
                    <CardDescription>
                      Status: <span className="font-medium">{order.order_status}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="aspect-square rounded-md overflow-hidden bg-gray-100 max-w-[120px]">
                        {/* This would show the design preview */}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p><strong>Size:</strong> {order.options.size}</p>
                        <p><strong>Color:</strong> {order.options.color}</p>
                        <p><strong>Quantity:</strong> {order.options.quantity}</p>
                        <p><strong>Shipping to:</strong> {order.shipping_address.city}, {order.shipping_address.state}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => handleReorder(order.design_id)}>
                      Reorder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="mb-6">You haven't placed any orders yet.</p>
                <Button
                  onClick={handleCreateNewDesign}
                  className="bg-brand-green hover:bg-brand-darkGreen"
                >
                  Design & Order Your First T-Shirt
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
