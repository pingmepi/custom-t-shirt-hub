import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "font-medium text-brand-green" : "text-gray-700 hover:text-brand-green";
  };
  
  const navLinks = [
    { text: "Home", path: "/" },
    { text: "How It Works", path: "/how-it-works" },
    { text: "Pricing", path: "/pricing" },
  ];

  const userLinks = isAuthenticated ? [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Profile", path: "/profile" },
    { text: "Design", path: "/design" },
  ] : [];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-brand-green">T-Shirt Designer</span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${isActive(link.path)} transition-colors duration-200 text-sm`}
                >
                  {link.text}
                </Link>
              ))}
              
              {userLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${isActive(link.path)} transition-colors duration-200 text-sm`}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-1 text-sm text-gray-700 hover:text-brand-green">
                  <User className="h-5 w-5" />
                  <span>{user?.email}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-brand-green hover:bg-brand-darkGreen" size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      {link.text}
                    </Link>
                  ))}
                  
                  {isAuthenticated && (
                    <>
                      <div className="border-t border-gray-200 pt-6">
                        {userLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="block py-2 text-gray-700 hover:text-brand-green transition-colors duration-200"
                            onClick={closeMenu}
                          >
                            {link.text}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-6">
                        <Button 
                          variant="ghost" 
                          className="text-red-600 hover:bg-red-50 w-full justify-start"
                          onClick={() => {
                            handleSignOut();
                            closeMenu();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="border-t border-gray-200 pt-6 flex flex-col space-y-4">
                      <Link to="/login" onClick={closeMenu}>
                        <Button variant="outline" className="w-full">
                          Log in
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={closeMenu}>
                        <Button className="w-full bg-brand-green hover:bg-brand-darkGreen">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
