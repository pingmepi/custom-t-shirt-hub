import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { DesignData } from "@/lib/types";
import { tshirtImages } from "@/assets";

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

  // Initialize the canvas once on mount
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Ensure the canvas element is ready before initialization
    const initCanvas = () => {
      try {
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 600,
          height: 600,
          backgroundColor: "#f9f9f9",
          enableRetinaScaling: true,
          renderOnAddRemove: false,
          stateful: false
        });

        // Ensure the canvas was created successfully
        if (!canvas.getContext()) {
          throw new Error("Failed to get canvas context");
        }

        fabricCanvasRef.current = canvas;
        setIsInitialized(true);

        // Return cleanup function
        return () => {
          canvas.dispose();
          fabricCanvasRef.current = null;
          setIsInitialized(false);
        };
      } catch (error) {
        console.error("Error initializing canvas:", error);
        setIsInitialized(false);
        return undefined;
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initCanvas, 100);
    return () => clearTimeout(timeoutId);
  }, [canvasRef]);

  // Handle loading images after canvas is initialized
  // Using refs to track if images have been loaded
  const imagesLoadedRef = useRef(false);

  useEffect(() => {
    // Only load images once when canvas is initialized
    if (!fabricCanvasRef.current || !isInitialized || imagesLoadedRef.current) return;

    const canvas = fabricCanvasRef.current;
    imagesLoadedRef.current = true;

    // Load t-shirt mockup first
    fabric.Image.fromURL(tshirtImages.mockup1, (tshirtImg: fabric.Image) => {
      if (!canvas) return;

      try {
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

        tshirtImageRef.current = tshirtImg;
        canvas.add(tshirtImg);
        canvas.sendToBack(tshirtImg);
        canvas.renderAll();

        // Function to add placeholder text
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
              textBaseline: 'middle'
            });

            canvas.add(text);
            canvas.renderAll();
          } catch (error) {
            console.error("Error adding placeholder text:", error);
          }
        };

        // Now load the design image or add placeholder
        if (initialImageUrl) {
          try {
            fabric.Image.fromURL(initialImageUrl, (designImg: fabric.Image) => {
              try {
                // Scale and position the design image
                const maxWidth = 300;
                const maxHeight = 300;

                if (designImg.width && designImg.width > maxWidth) {
                  designImg.scaleToWidth(maxWidth);
                }

                if (designImg.height && designImg.getScaledHeight() > maxHeight) {
                  designImg.scaleToHeight(maxHeight);
                }

                designImg.set({
                  left: 300,
                  top: 225,
                  originX: 'center',
                  originY: 'center',
                });

                designImageRef.current = designImg;
                canvas.add(designImg);
                canvas.renderAll();
              } catch (error) {
                console.error("Error processing image:", error);
                addPlaceholderText();
              }
            }, { crossOrigin: 'anonymous' });
          } catch (error) {
            console.error("Error loading design image:", error);
            addPlaceholderText();
          }
        } else {
          // Add placeholder text if no image URL provided
          addPlaceholderText();
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Error setting up canvas:", error);
        setIsLoaded(true);
      }
    }, { crossOrigin: 'anonymous' });

  }, [isInitialized, initialImageUrl, tshirtColor]);

  // Update tshirt color when it changes - using a ref to track previous color
  const prevTshirtColorRef = useRef<string>(tshirtColor);

  useEffect(() => {
    // Only run if the color has actually changed
    if (tshirtColor !== prevTshirtColorRef.current &&
        fabricCanvasRef.current &&
        tshirtImageRef.current &&
        isInitialized) {

      try {
        console.log("Updating t-shirt color in hook from", prevTshirtColorRef.current, "to", tshirtColor);
        prevTshirtColorRef.current = tshirtColor;

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

        // Make sure the canvas is still interactive
        fabricCanvasRef.current.selection = true;
        if ('interactive' in fabricCanvasRef.current) {
          (fabricCanvasRef.current as any).interactive = true;
        }

        // Ensure all objects remain selectable
        fabricCanvasRef.current.forEachObject((obj: fabric.Object) => {
          if (obj !== tshirtImageRef.current) {
            obj.selectable = true;
            obj.evented = true;
          }
        });

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
