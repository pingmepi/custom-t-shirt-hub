import { useEffect, useRef, useState } from "react";
import { Canvas, loadSVGFromURL } from "fabric";
import { toast } from "sonner";

interface DesignCanvasProps {
  initialImageUrl?: string;
  onDesignUpdated?: (designData: any) => void;
}

const DesignCanvas = ({ initialImageUrl, onDesignUpdated }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: "#f9f9f9",
    });

    fabricCanvasRef.current = canvas;

    // Add mock t-shirt placeholder
    const tshirtRect = canvas.addRect({
      width: 300,
      height: 400,
      fill: "#ffffff",
      left: 150,
      top: 100,
      rx: 10,
      ry: 10,
      stroke: "#dddddd",
      strokeWidth: 2,
    });

    tshirtRect.set({
      selectable: false,
      evented: false,
    });

    // Add t-shirt mockup guide lines
    const mockupLine = canvas.addLine([150, 100, 450, 100], {
      stroke: '#dddddd',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });

    // Load initial image if provided
    if (initialImageUrl) {
      loadSVGFromURL(initialImageUrl, (objects, options) => {
        const loadedObject = canvas.add({ 
          type: 'group', 
          objects,
          ...options,
          left: 300,
          top: 300,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        
        canvas.requestRenderAll();
        setIsLoaded(true);
        saveState();
      });
    } else {
      // Add a placeholder text if no image is provided
      canvas.addText('Your Design Here', {
        fontSize: 24,
        fontFamily: 'Arial',
        left: 300,
        top: 300,
        fill: '#888888',
        originX: 'center',
        originY: 'center',
      });
      setIsLoaded(true);
      saveState();
    }

    // Setup canvas event listeners
    canvas.on('object:modified', () => {
      if (onDesignUpdated) {
        onDesignUpdated(canvas.toJSON());
      }
      saveState();
    });

    return () => {
      canvas.dispose();
    };
  }, [initialImageUrl, onDesignUpdated]);

  const saveState = () => {
    if (!fabricCanvasRef.current) return;
    setHistory((prev) => [...prev, fabricCanvasRef.current.toJSON()]);
    setRedoStack([]); // Clear redo stack on new action
  };

  const undo = () => {
    if (history.length <= 1) {
      toast.error("No more actions to undo");
      return;
    }

    const newHistory = [...history];
    const lastState = newHistory.pop();
    setRedoStack((prev) => [lastState, ...prev]);
    setHistory(newHistory);

    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.loadFromJSON(newHistory[newHistory.length - 1], () => {
        fabricCanvasRef.current?.requestRenderAll();
        if (onDesignUpdated) {
          onDesignUpdated(fabricCanvasRef.current.toJSON());
        }
      });
    }
  };

  const redo = () => {
    if (redoStack.length === 0) {
      toast.error("No more actions to redo");
      return;
    }

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.shift();
    setRedoStack(newRedoStack);
    setHistory((prev) => [...prev, nextState]);

    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.loadFromJSON(nextState, () => {
        fabricCanvasRef.current?.requestRenderAll();
        if (onDesignUpdated) {
          onDesignUpdated(fabricCanvasRef.current.toJSON());
        }
      });
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = fabricCanvasRef.current.addText('New Text', {
      left: 300,
      top: 300,
      fontSize: 20,
      fontFamily: 'Arial',
      fill: '#000000',
      originX: 'center',
      originY: 'center',
    });

    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.requestRenderAll();

    if (onDesignUpdated) {
      onDesignUpdated(fabricCanvasRef.current.toJSON());
    }

    saveState();
    toast.success('Text added successfully');
  };

  const addShape = (shape: 'circle' | 'rect') => {
    if (!fabricCanvasRef.current) return;
    
    if (shape === 'circle') {
      const circle = fabricCanvasRef.current.addCircle({
        left: 300,
        top: 300,
        radius: 50,
        fill: '#ff5555',
        originX: 'center',
        originY: 'center',
      });
      
      fabricCanvasRef.current.setActiveObject(circle);
    } else {
      const rect = fabricCanvasRef.current.addRect({
        left: 300,
        top: 300,
        width: 100,
        height: 100,
        fill: '#5555ff',
        originX: 'center',
        originY: 'center',
      });
      
      fabricCanvasRef.current.setActiveObject(rect);
    }
    
    fabricCanvasRef.current.requestRenderAll();
    
    if (onDesignUpdated) {
      onDesignUpdated(fabricCanvasRef.current.toJSON());
    }
    
    saveState();
    toast.success(`${shape === 'circle' ? 'Circle' : 'Rectangle'} added successfully`);
  };

  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();

    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.requestRenderAll();

      if (onDesignUpdated) {
        onDesignUpdated(fabricCanvasRef.current.toJSON());
      }

      saveState();
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
      fabricCanvasRef.current.requestRenderAll();
      
      if (onDesignUpdated) {
        onDesignUpdated(fabricCanvasRef.current.toJSON());
      }
      
      saveState();
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
        <button 
          onClick={undo}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Undo
        </button>
        <button 
          onClick={redo}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Redo
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
