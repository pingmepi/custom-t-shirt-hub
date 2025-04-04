import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { DesignData } from "@/lib/types";
import { toast } from "sonner";

interface UseCanvasInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initialImageUrl?: string;
  onDesignUpdated?: (designData: DesignData) => void;
  tshirtColor?: string;
}

interface UseCanvasInitializationResult {
  fabricCanvas: fabric.Canvas | null;
  isLoaded: boolean;
  isInitialized: boolean;
  tshirtImageObject: fabric.Image | undefined;
}

/**
 * Custom hook to handle canvas initialization and image loading
 */
export function useCanvasInitialization({
  canvasRef,
  initialImageUrl,
  onDesignUpdated,
  tshirtColor = "#ffffff"
}: UseCanvasInitializationProps): UseCanvasInitializationResult {
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const tshirtImageRef = useRef<fabric.Image>();
  const designImageRef = useRef<fabric.Image>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the canvas once on mount with proper performance optimizations
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      // Create the canvas immediately to improve perceived performance
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 600,
        backgroundColor: "#f9f9f9",
        // Add performance optimizations
        enableRetinaScaling: true,
        renderOnAddRemove: false,
        stateful: false
      });
      
      fabricCanvasRef.current = canvas;
      setIsInitialized(true);
      
      // Helper function to add placeholder text
      const addPlaceholderText = () => {
        try {
          const text = new fabric.Text('Your Design Here', {
            fontSize: 24,
            fontFamily: 'Arial',
            left: 300,
            top: 225,
            fill: '#888888',
            originX: 'center',
            originY: 'center',
          });
          
          canvas.add(text);
          canvas.renderAll();
          setIsLoaded(true);
        } catch (error) {
          console.error("Error adding placeholder text:", error);
          setIsLoaded(true);
        }
      };
      
      // Helper function to load design image
      const loadDesignImage = (imageUrl?: string) => {
        // Remove existing design image if it exists
        if (designImageRef.current) {
          canvas.remove(designImageRef.current);
        }
        
        // Handle when an initial image URL is provided
        if (imageUrl) {
          setIsLoaded(false);
          
          if (imageUrl.endsWith('.svg')) {
            // Handle SVG loading
            try {
              fabric.loadSVGFromURL(imageUrl, (objects, options) => {
                try {
                  const loadedObject = fabric.util.groupSVGElements(objects, options);
                  loadedObject.set({
                    left: 300,
                    top: 225,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    originX: 'center',
                    originY: 'center',
                  });
                  
                  canvas.add(loadedObject);
                  designImageRef.current = loadedObject as unknown as fabric.Image;
                  canvas.renderAll();
                  setIsLoaded(true);
                  
                  if (onDesignUpdated) {
                    const canvasJson = canvas.toJSON();
                    const designData: DesignData = {
                      canvas_json: JSON.stringify(canvasJson),
                      width: canvas.width,
                      height: canvas.height,
                      background_color: canvas.backgroundColor as string,
                      version: '1.0'
                    };
                    onDesignUpdated(designData);
                  }
                } catch (error) {
                  console.error("Error processing SVG:", error);
                  toast.error("Failed to process SVG design");
                  addPlaceholderText();
                }
              });
            } catch (error) {
              console.error("Error loading SVG:", error);
              toast.error("Failed to load SVG design");
              addPlaceholderText();
            }
          } else {
            // Handle other image formats
            try {
              fabric.Image.fromURL(imageUrl, (img) => {
                try {
                  // Scale image to fit the design area while maintaining aspect ratio
                  img.scaleToWidth(200);
                  img.set({
                    left: 300,
                    top: 225,
                    originX: 'center',
                    originY: 'center',
                  });
                  
                  canvas.add(img);
                  designImageRef.current = img;
                  canvas.renderAll();
                  setIsLoaded(true);
                  
                  if (onDesignUpdated) {
                    const canvasJson = canvas.toJSON();
                    const designData: DesignData = {
                      canvas_json: JSON.stringify(canvasJson),
                      width: canvas.width,
                      height: canvas.height,
                      background_color: canvas.backgroundColor as string,
                      version: '1.0'
                    };
                    onDesignUpdated(designData);
                  }
                } catch (error) {
                  console.error("Error processing image:", error);
                  toast.error("Failed to process design image");
                  addPlaceholderText();
                }
              }, { crossOrigin: 'anonymous' });
            } catch (error) {
              console.error("Error loading image:", error);
              toast.error("Failed to load design image");
              addPlaceholderText();
            }
          }
        } else {
          addPlaceholderText();
        }
      };
      
      // Load t-shirt mockup as background image
      try {
        fabric.Image.fromURL('/images/tshirt/mockup-1.png', (tshirtImg) => {
          try {
            // Apply initial color filter if not white
            if (tshirtColor !== "#ffffff") {
              const filter = new fabric.Image.filters.BlendColor({
                color: tshirtColor,
                mode: 'tint',
                alpha: 1
              });
              tshirtImg.filters = [filter];
              tshirtImg.applyFilters();
            }
            
            tshirtImg.scaleToWidth(500);
            tshirtImg.set({
              left: 300,
              top: 300,
              originX: 'center',
              originY: 'center',
              selectable: false,
              evented: false,
            });
            
            // Store reference to tshirt image for color changes
            tshirtImageRef.current = tshirtImg;
            
            canvas.add(tshirtImg);
            canvas.sendToBack(tshirtImg);
            
            // Create a visible design area/boundary
            const designArea = new fabric.Rect({
              width: 250,
              height: 200,
              left: 300,
              top: 225,
              fill: 'transparent',
              stroke: '#dddddd',
              strokeDashArray: [5, 5],
              strokeWidth: 1,
              originX: 'center',
              originY: 'center',
              selectable: false,
              evented: false,
            });
            
            canvas.add(designArea);
            
            // Load the design image after t-shirt mockup is loaded
            loadDesignImage(initialImageUrl);
          } catch (error) {
            console.error("Error setting up t-shirt image:", error);
            toast.error("Failed to set up t-shirt mockup");
            
            // Still try to load the design image
            loadDesignImage(initialImageUrl);
          }
        }, { crossOrigin: 'anonymous' });
      } catch (error) {
        console.error("Error loading t-shirt mockup:", error);
        toast.error("Failed to load t-shirt mockup");
        
        // Still try to load the design image even if t-shirt fails
        loadDesignImage(initialImageUrl);
      }
      
      // Setup canvas event listeners
      canvas.on('object:modified', () => {
        if (onDesignUpdated) {
          try {
            // Convert fabric.js JSON to our DesignData type
            const canvasJson = canvas.toJSON();
            const designData: DesignData = {
              canvas_json: JSON.stringify(canvasJson),
              width: canvas.width,
              height: canvas.height,
              background_color: canvas.backgroundColor as string,
              version: '1.0'
            };
            onDesignUpdated(designData);
          } catch (error) {
            console.error("Error updating design data:", error);
          }
        }
      });
      
      // Return cleanup function
      return () => {
        try {
          canvas.dispose();
        } catch (error) {
          console.error("Error disposing canvas:", error);
        }
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
      setIsLoaded(true);
      setIsInitialized(false);
    }
  }, [initialImageUrl, onDesignUpdated, isInitialized, canvasRef, tshirtColor]);
  
  // Update tshirt color when it changes
  useEffect(() => {
    if (fabricCanvasRef.current && tshirtImageRef.current && isInitialized) {
      try {
        // Update t-shirt color
        if (tshirtColor === "#ffffff") {
          // For white, remove all filters
          tshirtImageRef.current.filters = [];
        } else {
          const filter = new fabric.Image.filters.BlendColor({
            color: tshirtColor,
            mode: 'tint',
            alpha: 1
          });
          tshirtImageRef.current.filters = [filter];
        }
        
        tshirtImageRef.current.applyFilters();
        fabricCanvasRef.current.renderAll();
        
        // Update design data if callback exists
        if (onDesignUpdated && fabricCanvasRef.current) {
          const canvasJson = fabricCanvasRef.current.toJSON();
          const designData: DesignData = {
            canvas_json: JSON.stringify(canvasJson),
            width: fabricCanvasRef.current.width,
            height: fabricCanvasRef.current.height,
            background_color: fabricCanvasRef.current.backgroundColor as string,
            version: '1.0'
          };
          onDesignUpdated(designData);
        }
      } catch (error) {
        console.error("Error updating t-shirt color:", error);
      }
    }
  }, [tshirtColor, onDesignUpdated, isInitialized]);
  
  return {
    fabricCanvas: fabricCanvasRef.current,
    isLoaded,
    isInitialized,
    tshirtImageObject: tshirtImageRef.current
  };
}
