
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { DesignData } from "@/lib/types";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { designImages } from "@/assets";
import {
  addTextToCanvas,
  addShapeToCanvas,
  addImageToCanvas,
  deleteSelectedObject,
  changeObjectColor,
  canvasToDesignData,
  loadImageFromFile
} from "@/utils/canvasOperations";
import CanvasToolbar from "./CanvasToolbar";

interface DesignCanvasProps {
  initialImageUrl?: string;
  initialDesignData?: DesignData | null;
  onDesignUpdated?: (designData: DesignData) => void;
}

const DesignCanvas = ({ initialImageUrl, initialDesignData, onDesignUpdated }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTshirtColor, setCurrentTshirtColor] = useState("#ffffff");
  const [error, setError] = useState<string | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);

  // Only log on first render using a ref
  const hasLoggedInitialRender = useRef(false);
  if (!hasLoggedInitialRender.current) {
    console.log("DesignCanvas initial render with initialImageUrl:", initialImageUrl);
    hasLoggedInitialRender.current = true;
  }

  // Use the custom hook for canvas initialization
  const { fabricCanvas, isLoaded, isInitialized, tshirtImageObject } = useCanvasInitialization({
    canvasRef,
    initialImageUrl: initialImageUrl || designImages.designFlow,
    initialDesignData,
    onDesignUpdated,
    tshirtColor: currentTshirtColor
  });

  // Function to delete the selected object
  const handleDeleteSelectedObject = () => {
    if (!fabricCanvas) {
      console.error("Cannot delete object: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      console.log("Attempting to delete selected object");
      const success = deleteSelectedObject(fabricCanvas);

      if (success) {
        console.log("Object deleted successfully");
        if (onDesignUpdated) {
          const designData = canvasToDesignData(fabricCanvas);
          console.log("Design updated after deleting object:", designData);
          onDesignUpdated(designData);
        }
        toast.success('Object deleted');
      } else {
        console.log("No object selected for deletion");
        toast.error('No object selected');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error deleting object:", err);
      toast.error("Failed to delete object");
      setError(`Error deleting object: ${errorMessage}`);
    }
  };

  // Add keyboard event listener for Delete key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Delete or Backspace key is pressed
      if ((event.key === 'Delete' || event.key === 'Backspace') && fabricCanvas) {
        console.log('Delete key pressed, attempting to delete selected object');
        handleDeleteSelectedObject();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvas]); // Re-add listener when fabricCanvas changes

  // Add effect to handle canvas initialization retry if necessary
  // Use a ref to track if we've logged the initialization state
  const hasLoggedInitState = useRef(false);

  useEffect(() => {
    // Only log the initialization state once or when it changes significantly
    const shouldLog = !hasLoggedInitState.current ||
                     (isInitialized && !hasLoggedInitState.current) ||
                     initAttempts > 0;

    if (shouldLog) {
      console.log("Canvas initialization state:", {
        isInitialized,
        isLoaded,
        fabricCanvasExists: !!fabricCanvas,
        tshirtImageExists: !!tshirtImageObject,
        canvasRefExists: !!canvasRef.current,
        initialImageUrl: initialImageUrl ? `${initialImageUrl.substring(0, 30)}...` : null,
        initAttempts
      });
      hasLoggedInitState.current = true;
    }

    if (!isInitialized && canvasRef.current && initAttempts < 3) {
      console.log("Canvas element exists but not initialized, attempt:", initAttempts + 1);

      // Wait a bit and trigger re-initialization by incrementing attempts
      const timer = setTimeout(() => {
        setInitAttempts(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoaded, fabricCanvas, tshirtImageObject, initialImageUrl, initAttempts]);

  // Handle canvas operations with improved error logging
  const handleAddText = () => {
    if (!fabricCanvas) {
      console.error("Cannot add text: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      console.log("Adding text to canvas");
      addTextToCanvas(fabricCanvas);

      if (onDesignUpdated) {
        const designData = canvasToDesignData(fabricCanvas);
        console.log("Design updated after adding text:", designData);
        onDesignUpdated(designData);
      }

      toast.success('Text added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error adding text:", err);
      toast.error("Failed to add text");
      setError(`Error adding text: ${errorMessage}`);
    }
  };

  const handleAddShape = (shape: 'circle' | 'rect') => {
    if (!fabricCanvas) {
      console.error("Cannot add shape: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      console.log(`Adding ${shape} to canvas`);
      addShapeToCanvas(fabricCanvas, shape);

      if (onDesignUpdated) {
        const designData = canvasToDesignData(fabricCanvas);
        console.log("Design updated after adding shape:", designData);
        onDesignUpdated(designData);
      }

      toast.success(`${shape === 'circle' ? 'Circle' : 'Rectangle'} added successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error adding ${shape}:`, err);
      toast.error(`Failed to add ${shape}`);
      setError(`Error adding ${shape}: ${errorMessage}`);
    }
  };

  const handleAddImage = async (file: File) => {
    if (!fabricCanvas) {
      console.error("Cannot add image: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      console.log("Loading image from file:", file.name);
      const img = await loadImageFromFile(file);

      console.log("Image loaded, adding to canvas");
      await addImageToCanvas(fabricCanvas, img);

      if (onDesignUpdated) {
        const designData = canvasToDesignData(fabricCanvas);
        console.log("Design updated after adding image:", designData);
        onDesignUpdated(designData);
      }

      toast.success('Image added successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error adding image:', error);
      toast.error('Failed to add image. Please try again.');
      setError(`Error adding image: ${errorMessage}`);
    }
  };



  const handleChangeColor = (color: string) => {
    if (!fabricCanvas) {
      console.error("Cannot change color: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      console.log(`Changing object color to: ${color}`);
      const success = changeObjectColor(fabricCanvas, color);

      if (success) {
        console.log("Color changed successfully");
        if (onDesignUpdated) {
          const designData = canvasToDesignData(fabricCanvas);
          console.log("Design updated after changing color:", designData);
          onDesignUpdated(designData);
        }
      } else {
        console.log("No object selected for color change");
        toast.error('No object selected');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error changing color:", err);
      toast.error("Failed to change color");
      setError(`Error changing color: ${errorMessage}`);
    }
  };

  // Use a ref to track if we're changing the color to avoid redundant updates
  const isChangingColorRef = useRef(false);

  const handleChangeTshirtColor = (color: string) => {
    // Prevent redundant color changes
    if (color === currentTshirtColor || isChangingColorRef.current) {
      return;
    }

    if (!fabricCanvas || !tshirtImageObject) {
      console.error("Cannot change t-shirt color: Canvas or t-shirt image not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      console.log(`Changing t-shirt color to: ${color}`);
      isChangingColorRef.current = true;

      // Just update the state - the hook will handle the actual color change
      setCurrentTshirtColor(color);

      // Show success message
      toast.success(`T-shirt color updated`);

      // Reset the changing flag after a short delay
      setTimeout(() => {
        isChangingColorRef.current = false;
      }, 100);
    } catch (err) {
      isChangingColorRef.current = false;
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error changing t-shirt color:", err);
      toast.error("Failed to change t-shirt color");
      setError(`Error changing t-shirt color: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 bg-white rounded-lg shadow-lg p-2 relative">
        <canvas ref={canvasRef} className="border border-gray-200 rounded" width="400" height="400" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md overflow-auto">
              <p className="font-bold">Error loading canvas</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Use the enhanced CanvasToolbar component */}
      <CanvasToolbar
        onAddText={handleAddText}
        onAddCircle={() => handleAddShape('circle')}
        onAddRectangle={() => handleAddShape('rect')}
        onAddImage={handleAddImage}
        onDeleteSelected={handleDeleteSelectedObject}
        onChangeColor={handleChangeColor}
        onChangeTshirtColor={handleChangeTshirtColor}
        currentTshirtColor={currentTshirtColor}
      />
    </div>
  );
};

export default DesignCanvas;
