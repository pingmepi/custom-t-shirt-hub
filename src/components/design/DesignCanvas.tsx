
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { toast } from "sonner";

interface DesignCanvasProps {
  initialImageUrl?: string;
  onDesignUpdated?: (designData: any) => void;
}

const DesignCanvas = ({ initialImageUrl, onDesignUpdated }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
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
    fabric.Image.fromURL('/tshirt-mockup-1.png', (tshirtImg) => {
      tshirtImg.scaleToWidth(500);
      tshirtImg.set({
        left: 300,
        top: 300,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      
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
      
      // Once the t-shirt is loaded, conditionally add the initial design or placeholder
      if (initialImageUrl && initialImageUrl.endsWith('.svg')) {
        // Handle SVG loading
        fabric.loadSVGFromURL(initialImageUrl, (objects, options) => {
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
          canvas.renderAll();
          setIsLoaded(true);
        });
      } else if (initialImageUrl) {
        // Handle other image formats
        fabric.Image.fromURL(initialImageUrl, (img) => {
          img.scaleToWidth(200);
          img.set({
            left: 300,
            top: 225,
            originX: 'center',
            originY: 'center',
          });
          
          canvas.add(img);
          canvas.renderAll();
          setIsLoaded(true);
        });
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
      
      canvas.renderAll();
    });

    // Setup canvas event listeners
    canvas.on('object:modified', () => {
      if (onDesignUpdated) {
        onDesignUpdated(canvas.toJSON());
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [initialImageUrl, onDesignUpdated, isInitialized]);

  const addText = () => {
    if (!fabricCanvasRef.current) return;
    
    const text = new fabric.Text('New Text', {
      left: 300,
      top: 225,
      fontSize: 20,
      fontFamily: 'Arial',
      fill: '#000000',
      originX: 'center',
      originY: 'center',
    });
    
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    
    if (onDesignUpdated) {
      onDesignUpdated(fabricCanvasRef.current.toJSON());
    }
    
    toast.success('Text added successfully');
  };

  const addShape = (shape: 'circle' | 'rect') => {
    if (!fabricCanvasRef.current) return;
    
    if (shape === 'circle') {
      const circle = new fabric.Circle({
        left: 300,
        top: 225,
        radius: 30,
        fill: '#ff5555',
        originX: 'center',
        originY: 'center',
      });
      
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.setActiveObject(circle);
    } else {
      const rect = new fabric.Rect({
        left: 300,
        top: 225,
        width: 60,
        height: 60,
        fill: '#5555ff',
        originX: 'center',
        originY: 'center',
      });
      
      fabricCanvasRef.current.add(rect);
      fabricCanvasRef.current.setActiveObject(rect);
    }
    
    fabricCanvasRef.current.renderAll();
    
    if (onDesignUpdated) {
      onDesignUpdated(fabricCanvasRef.current.toJSON());
    }
    
    toast.success(`${shape === 'circle' ? 'Circle' : 'Rectangle'} added successfully`);
  };

  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
      
      if (onDesignUpdated) {
        onDesignUpdated(fabricCanvasRef.current.toJSON());
      }
      
      toast.success('Object deleted');
    } else {
      toast.error('No object selected');
    }
  };

  const changeColor = (color: string) => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    
    if (activeObject) {
      activeObject.set('fill', color);
      fabricCanvasRef.current.renderAll();
      
      if (onDesignUpdated) {
        onDesignUpdated(fabricCanvasRef.current.toJSON());
      }
    } else {
      toast.error('No object selected');
    }
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
      <div className="flex flex-wrap gap-2 justify-center">
        <button 
          onClick={addText}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors"
        >
          Add Text
        </button>
        <button 
          onClick={() => addShape('circle')}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors"
        >
          Add Circle
        </button>
        <button 
          onClick={() => addShape('rect')}
          className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-darkGreen transition-colors"
        >
          Add Rectangle
        </button>
        <button 
          onClick={deleteSelectedObject}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete Selected
        </button>
        <div className="flex items-center gap-2">
          <span>Color:</span>
          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'].map((color) => (
            <button
              key={color}
              onClick={() => changeColor(color)}
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;
