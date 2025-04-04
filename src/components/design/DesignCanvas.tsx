
import { useRef, useState } from "react";
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

  // Use the custom hook for canvas initialization
  const { fabricCanvas, isLoaded, isInitialized, tshirtImageObject } = useCanvasInitialization({
    canvasRef,
    initialImageUrl,
    onDesignUpdated,
    tshirtColor: currentTshirtColor
  });

  // Handle canvas operations
  const handleAddText = () => {
    if (!fabricCanvas) return;

    addTextToCanvas(fabricCanvas);

    if (onDesignUpdated) {
      onDesignUpdated(canvasToDesignData(fabricCanvas));
    }

    toast.success('Text added successfully');
  };

  const handleAddShape = (shape: 'circle' | 'rect') => {
    if (!fabricCanvas) return;

    addShapeToCanvas(fabricCanvas, shape);

    if (onDesignUpdated) {
      onDesignUpdated(canvasToDesignData(fabricCanvas));
    }

    toast.success(`${shape === 'circle' ? 'Circle' : 'Rectangle'} added successfully`);
  };

  const handleAddImage = async (file: File) => {
    if (!fabricCanvas) return;
    
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
    }
  };

  const handleDeleteSelectedObject = () => {
    if (!fabricCanvas) return;

    const success = deleteSelectedObject(fabricCanvas);

    if (success) {
      if (onDesignUpdated) {
        onDesignUpdated(canvasToDesignData(fabricCanvas));
      }
      toast.success('Object deleted');
    } else {
      toast.error('No object selected');
    }
  };

  const handleChangeColor = (color: string) => {
    if (!fabricCanvas) return;

    const success = changeObjectColor(fabricCanvas, color);

    if (success) {
      if (onDesignUpdated) {
        onDesignUpdated(canvasToDesignData(fabricCanvas));
      }
    } else {
      toast.error('No object selected');
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
