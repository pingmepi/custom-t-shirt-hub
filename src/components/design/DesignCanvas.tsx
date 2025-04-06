
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { DesignData } from "@/lib/types";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
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
  onDesignUpdated?: (designData: DesignData) => void;
}

const DesignCanvas = ({ initialImageUrl, onDesignUpdated }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTshirtColor, setCurrentTshirtColor] = useState("#ffffff");
  const [error, setError] = useState<string | null>(null);

  console.log("DesignCanvas rendering with initialImageUrl:", initialImageUrl);

  // Use the custom hook for canvas initialization
  const { fabricCanvas, isLoaded, isInitialized, tshirtImageObject } = useCanvasInitialization({
    canvasRef,
    initialImageUrl,
    onDesignUpdated,
    tshirtColor: currentTshirtColor
  });

  // Add effect to log canvas initialization state
  useEffect(() => {
    console.log("Canvas initialization state:", {
      isInitialized,
      isLoaded,
      fabricCanvasExists: !!fabricCanvas,
      tshirtImageExists: !!tshirtImageObject,
      canvasRefExists: !!canvasRef.current
    });
    
    if (!isInitialized && canvasRef.current) {
      console.log("Canvas element exists but not initialized");
    }
    
    if (initialImageUrl) {
      console.log("Attempting to load image:", initialImageUrl);
    }
  }, [isInitialized, isLoaded, fabricCanvas, tshirtImageObject, initialImageUrl]);

  // Handle canvas operations
  const handleAddText = () => {
    if (!fabricCanvas) {
      console.error("Cannot add text: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      addTextToCanvas(fabricCanvas);

      if (onDesignUpdated) {
        onDesignUpdated(canvasToDesignData(fabricCanvas));
      }

      toast.success('Text added successfully');
    } catch (err) {
      console.error("Error adding text:", err);
      toast.error("Failed to add text");
      setError(`Error adding text: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleAddShape = (shape: 'circle' | 'rect') => {
    if (!fabricCanvas) {
      console.error("Cannot add shape: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      addShapeToCanvas(fabricCanvas, shape);

      if (onDesignUpdated) {
        onDesignUpdated(canvasToDesignData(fabricCanvas));
      }

      toast.success(`${shape === 'circle' ? 'Circle' : 'Rectangle'} added successfully`);
    } catch (err) {
      console.error(`Error adding ${shape}:`, err);
      toast.error(`Failed to add ${shape}`);
      setError(`Error adding ${shape}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleAddImage = async (file: File) => {
    if (!fabricCanvas) {
      console.error("Cannot add image: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }
    
    try {
      const img = await loadImageFromFile(file);
      await addImageToCanvas(fabricCanvas, img);
      
      if (onDesignUpdated) {
        onDesignUpdated(canvasToDesignData(fabricCanvas));
      }
      
      toast.success('Image added successfully');
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image. Please try again.');
      setError(`Error adding image: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDeleteSelectedObject = () => {
    if (!fabricCanvas) {
      console.error("Cannot delete object: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      const success = deleteSelectedObject(fabricCanvas);

      if (success) {
        if (onDesignUpdated) {
          onDesignUpdated(canvasToDesignData(fabricCanvas));
        }
        toast.success('Object deleted');
      } else {
        toast.error('No object selected');
      }
    } catch (err) {
      console.error("Error deleting object:", err);
      toast.error("Failed to delete object");
      setError(`Error deleting object: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleChangeColor = (color: string) => {
    if (!fabricCanvas) {
      console.error("Cannot change color: Canvas not initialized");
      setError("Canvas not initialized");
      return;
    }

    try {
      const success = changeObjectColor(fabricCanvas, color);

      if (success) {
        if (onDesignUpdated) {
          onDesignUpdated(canvasToDesignData(fabricCanvas));
        }
      } else {
        toast.error('No object selected');
      }
    } catch (err) {
      console.error("Error changing color:", err);
      toast.error("Failed to change color");
      setError(`Error changing color: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  const handleChangeTshirtColor = (color: string) => {
    setCurrentTshirtColor(color);
    toast.success(`T-shirt color updated`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 bg-white rounded-lg shadow-lg p-2 relative">
        <canvas ref={canvasRef} className="border border-gray-200 rounded" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
