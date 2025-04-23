
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { TShirtDesign, OrderDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShoppingBag, Palette, AlertCircle, RefreshCcw, ImageOff, Database } from "lucide-react";
import { debugSupabaseQuery } from "@/utils/debugUtils";
import { toast } from "sonner";
import { designImages } from "@/assets";
import { handleImageError } from "@/utils/imageUtils";
import { fetchUserDesigns, checkDesignsTableAccess } from "@/services/designsService";

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
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);

  // State for table access check
  const [tableAccessible, setTableAccessible] = useState<boolean | null>(null);

  // Check if the designs table is accessible
  useEffect(() => {
    if (user && isAuthenticated && tableAccessible === null) {
      checkDesignsTableAccess()
        .then(accessible => {
          console.log("[Dashboard] Designs table accessible:", accessible);
          setTableAccessible(accessible);
        })
        .catch(error => {
          console.error("[Dashboard] Error checking table access:", error);
          setTableAccessible(false);
        });
    }
  }, [user, isAuthenticated, tableAccessible]);

  const {
    data: designs,
    isLoading: designsLoading,
    error: designsError,
    refetch: refetchDesigns
  } = useQuery({
    queryKey: ['userDesigns', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        console.log("[Dashboard] Fetching designs for user:", user.id);

        // Use our service function instead of direct Supabase query
        return await fetchUserDesigns(user.id);
      } catch (err) {
        console.error("[Dashboard] Exception fetching designs:", err);
        throw err;
      }
    },
    enabled: !!user && isAuthenticated, // Only run query when user is available
    retry: 3, // Retry three times if there's an error
    retryDelay: 1500 // Wait 1.5 seconds before retrying
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError
  } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        // This is a placeholder for actual order fetching logic
        // In production, this would fetch from a real orders table
        return [] as OrderDetails[];
      } catch (err) {
        console.error("[Dashboard] Exception fetching orders:", err);
        return [];
      }
    },
    enabled: !!user && isAuthenticated, // Only run query when user is available
    retry: 1, // Retry once if there's an error
    retryDelay: 1000 // Wait 1 second before retrying
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

  // Enhanced debug function to help diagnose Supabase issues
  const handleDebugQuery = async () => {
    setIsDebugMode(true);
    try {
      // First check if the designs table is accessible
      const isTableAccessible = await checkDesignsTableAccess();
      console.log("[Dashboard] Designs table accessible:", isTableAccessible);

      // Then run the standard debug query
      const result = await debugSupabaseQuery(user?.id);

      // Add table access info to the result
      const enhancedResult = {
        ...result,
        tableAccessible: isTableAccessible,
        authStatus: {
          isAuthenticated,
          hasUser: !!user,
          hasProfile: !!userProfile,
          userId: user?.id
        }
      };

      setDebugResult(enhancedResult);
      console.log("[Dashboard] Enhanced debug result:", enhancedResult);

      if (result.success) {
        toast.success("Debug query successful. Check console for details.");
      } else {
        // Try to provide more specific error information
        if (!isTableAccessible) {
          toast.error("Database table access denied. This may be an RLS policy issue.");
        } else if (!user) {
          toast.error("User authentication issue. Try logging out and back in.");
        } else {
          toast.error("Debug query failed. Check console for details.");
        }
      }
    } catch (error) {
      console.error("[Dashboard] Debug error:", error);
      setDebugResult({
        success: false,
        error,
        tableAccessible,
        authStatus: {
          isAuthenticated,
          hasUser: !!user,
          hasProfile: !!userProfile,
          userId: user?.id
        }
      });
      toast.error("Debug query failed with an exception.");
    } finally {
      setIsDebugMode(false);
    }
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
        <div className="flex gap-2 mt-4 md:mt-0">
          {designsError && (
            <Button
              variant="outline"
              onClick={() => refetchDesigns()}
              className="flex items-center"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
          <Button
            onClick={handleCreateNewDesign}
            className="bg-brand-green hover:bg-brand-darkGreen"
          >
            <Palette className="mr-2 h-4 w-4" />
            Create New Design
          </Button>
        </div>
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
                <p className="mb-4">There was an error loading your designs.</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => refetchDesigns()}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                  <Button variant="outline" onClick={handleDebugQuery} disabled={isDebugMode}>
                    {isDebugMode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Debugging...
                      </>
                    ) : (
                      <>Diagnose Issue</>
                    )}
                  </Button>
                </div>
                {debugResult && (
                  <div className="mt-4 text-left p-4 bg-gray-50 rounded-md text-sm">
                    <p className="font-semibold">Diagnostic Results:</p>
                    <p>Status: {debugResult.success ? 'Success' : 'Failed'}</p>

                    {/* Authentication Status */}
                    <div className="mt-2">
                      <p className="font-medium">Authentication:</p>
                      <ul className="list-disc pl-5">
                        <li className={debugResult.authStatus?.isAuthenticated ? "text-green-600" : "text-red-500"}>
                          Authenticated: {debugResult.authStatus?.isAuthenticated ? "Yes" : "No"}
                        </li>
                        <li className={debugResult.authStatus?.hasUser ? "text-green-600" : "text-red-500"}>
                          User Object: {debugResult.authStatus?.hasUser ? "Available" : "Missing"}
                        </li>
                        <li className={debugResult.authStatus?.hasProfile ? "text-green-600" : "text-red-500"}>
                          User Profile: {debugResult.authStatus?.hasProfile ? "Available" : "Missing"}
                        </li>
                        {debugResult.authStatus?.userId && (
                          <li className="text-gray-700">User ID: {debugResult.authStatus.userId.substring(0, 8)}...</li>
                        )}
                      </ul>
                    </div>

                    {/* Database Access */}
                    <div className="mt-2">
                      <p className="font-medium">Database Access:</p>
                      <ul className="list-disc pl-5">
                        <li className={debugResult.tableAccessible ? "text-green-600" : "text-red-500"}>
                          Designs Table: {debugResult.tableAccessible ? "Accessible" : "Not Accessible"}
                        </li>
                        {debugResult.success && debugResult.data && (
                          <li className="text-green-600">
                            Found {debugResult.data.designs?.length || 0} designs for user
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Error Details */}
                    {debugResult.error && (
                      <div className="mt-2">
                        <p className="font-medium text-red-500">Error Details:</p>
                        <p className="text-red-500 whitespace-pre-wrap break-words">
                          {debugResult.error.message || JSON.stringify(debugResult.error, null, 2)}
                        </p>
                      </div>
                    )}

                    {/* Troubleshooting Tips */}
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="font-medium">Troubleshooting Tips:</p>
                      <ul className="list-disc pl-5">
                        {!debugResult.authStatus?.isAuthenticated && (
                          <li>Try logging out and back in to refresh your authentication</li>
                        )}
                        {!debugResult.tableAccessible && (
                          <li>Database access issue - check RLS policies in Supabase</li>
                        )}
                        {debugResult.error && debugResult.error.message?.includes('JWT') && (
                          <li>JWT token issue - try clearing browser storage and logging in again</li>
                        )}
                        <li>Check browser console for more detailed error messages</li>
                      </ul>
                    </div>
                  </div>
                )}
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
                      {design.preview_url ? (
                        <img
                          src={design.preview_url}
                          alt="T-shirt design preview"
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, [
                            design.initial_model_image_url,
                            design.final_user_image_url,
                            designImages.placeholder
                          ])}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <ImageOff className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
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
