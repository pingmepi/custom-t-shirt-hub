
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
    
    // Load t-shirt mockup as background image
    fabric.Image.fromURL('/images/tshirt/mockup-1.png', (tshirtImg) => {
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
      
      loadDesignImage(canvas, initialImageUrl);
    });

    // Setup canvas event listeners
    canvas.on('object:modified', () => {
      if (onDesignUpdated) {
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
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [initialImageUrl, onDesignUpdated, isInitialized, canvasRef, tshirtColor]);

  // Helper function to load design image
  const loadDesignImage = (canvas: fabric.Canvas, imageUrl?: string) => {
    // Remove existing design image if it exists
    if (designImageRef.current) {
      canvas.remove(designImageRef.current);
    }
    
    // Handle when an initial image URL is provided
    if (imageUrl) {
      setIsLoaded(false);
      
      if (imageUrl.endsWith('.svg')) {
        // Handle SVG loading
        fabric.loadSVGFromURL(imageUrl, (objects, options) => {
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
        });
      } else {
        // Handle other image formats
        fabric.Image.fromURL(imageUrl, (img) => {
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
        }, (err) => {
          console.error("Error loading image:", err);
          toast.error("Failed to load design image");
          
          // Add a placeholder text if image fails to load
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
          setIsLoaded(true);
        });
      }
    } else {
      // Add a placeholder text if no image is provided
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
      setIsLoaded(true);
    }
  };

  // Update tshirt color when it changes
  useEffect(() => {
    if (fabricCanvasRef.current && tshirtImageRef.current && isInitialized) {
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
    }
  }, [tshirtColor, onDesignUpdated, isInitialized]);

  // Update design image when initialImageUrl changes
  useEffect(() => {
    if (fabricCanvasRef.current && isInitialized && initialImageUrl) {
      loadDesignImage(fabricCanvasRef.current, initialImageUrl);
    }
  }, [initialImageUrl, isInitialized]);

  return {
    fabricCanvas: fabricCanvasRef.current,
    isLoaded,
    isInitialized,
    tshirtImageObject: tshirtImageRef.current
  };
}
