
import { fabric } from "fabric";
import { DesignData } from "@/lib/types";

/**
 * Converts a fabric.js canvas to our DesignData type
 */
export const canvasToDesignData = (canvas: fabric.Canvas): DesignData => {
  const canvasJson = canvas.toJSON();
  return {
    canvas_json: JSON.stringify(canvasJson),
    width: canvas.width,
    height: canvas.height,
    background_color: canvas.backgroundColor as string,
    version: '1.0'
  };
};

/**
 * Adds text to the canvas
 */
export const addTextToCanvas = (
  canvas: fabric.Canvas,
  text: string = 'New Text',
  options: Partial<fabric.ITextOptions> = {}
): fabric.Text => {
  const textObject = new fabric.Text(text, {
    left: 300,
    top: 225,
    fontSize: 20,
    fontFamily: 'Arial',
    fill: '#000000',
    originX: 'center',
    originY: 'center',
    ...options
  });

  canvas.add(textObject);
  canvas.setActiveObject(textObject);
  canvas.renderAll();

  return textObject;
};

/**
 * Adds a shape to the canvas
 */
export const addShapeToCanvas = (
  canvas: fabric.Canvas,
  shape: 'circle' | 'rect',
  options: Partial<fabric.ICircleOptions | fabric.IRectOptions> = {}
): fabric.Object => {
  let shapeObject: fabric.Object;

  if (shape === 'circle') {
    shapeObject = new fabric.Circle({
      left: 300,
      top: 225,
      radius: 30,
      fill: '#ff5555',
      originX: 'center',
      originY: 'center',
      ...options
    });
  } else {
    shapeObject = new fabric.Rect({
      left: 300,
      top: 225,
      width: 60,
      height: 60,
      fill: '#5555ff',
      originX: 'center',
      originY: 'center',
      ...options
    });
  }

  canvas.add(shapeObject);
  canvas.setActiveObject(shapeObject);
  canvas.renderAll();

  return shapeObject;
};

/**
 * Adds an image to the canvas
 */
export const addImageToCanvas = (
  canvas: fabric.Canvas,
  imgElement: HTMLImageElement,
  options: Partial<fabric.IImageOptions> = {}
): Promise<fabric.Image> => {
  return new Promise((resolve) => {
    // Create a new fabric.Image instance from the HTMLImageElement
    const imgObject = new fabric.Image(imgElement, {
      left: 300,
      top: 225,
      originX: 'center',
      originY: 'center',
      ...options
    });

    // Scale image to fit within design area while maintaining aspect ratio
    const maxWidth = 200;
    const maxHeight = 150;

    if (imgObject.width && imgObject.height) {
      if (imgObject.width > maxWidth || imgObject.height > maxHeight) {
        const scaleFactor = Math.min(
          maxWidth / imgObject.width,
          maxHeight / imgObject.height
        );
        imgObject.scale(scaleFactor);
      }
    }

    // Add the image to the canvas
    canvas.add(imgObject);
    canvas.setActiveObject(imgObject);
    canvas.renderAll();
    resolve(imgObject);
  });
};

/**
 * Changes the t-shirt base color
 */
export const changeTshirtColor = (
  canvas: fabric.Canvas,
  tshirtImageObject: fabric.Image | undefined,
  color: string
): void => {
  if (tshirtImageObject) {
    const filter = new fabric.Image.filters.BlendColor({
      color: color,
      mode: 'tint',
      alpha: 1
    });

    tshirtImageObject.filters = [filter];
    tshirtImageObject.applyFilters();
    canvas.renderAll();
  }
};

/**
 * Deletes the currently selected object from the canvas
 */
export const deleteSelectedObject = (canvas: fabric.Canvas): boolean => {
  const activeObject = canvas.getActiveObject();

  if (activeObject) {
    canvas.remove(activeObject);
    canvas.renderAll();
    return true;
  }

  return false;
};

/**
 * Changes the color of the currently selected object
 */
export const changeObjectColor = (canvas: fabric.Canvas, color: string): boolean => {
  const activeObject = canvas.getActiveObject();

  if (activeObject) {
    activeObject.set('fill', color);
    canvas.renderAll();
    return true;
  }

  return false;
};

/**
 * Load image from file and return as HTMLImageElement
 */
export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.match('image.*')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        return reject(new Error('Failed to read file'));
      }

      const img = new Image();

      img.onload = () => {
        // Check if image loaded successfully
        if (img.width === 0 || img.height === 0) {
          return reject(new Error('Invalid image dimensions'));
        }
        resolve(img);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
