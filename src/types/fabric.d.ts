declare module 'fabric' {
  export namespace fabric {
    interface ITextOptions {
      left?: number;
      top?: number;
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      originX?: string;
      originY?: string;
      textBaseline?: string; // Allow any string for textBaseline
    }

    class Canvas {
      constructor(element: HTMLCanvasElement | string, options?: any);
      add(...objects: Object[]): Canvas;
      remove(object: Object): Canvas;
      clear(): Canvas;
      renderAll(): Canvas;
      setWidth(width: number): Canvas;
      setHeight(height: number): Canvas;
      setBackgroundColor(color: string, callback?: Function): Canvas;
      toJSON(propertiesToInclude?: string[]): any;
      loadFromJSON(json: string | object, callback?: Function, reviver?: Function): Canvas;
      getActiveObject(): Object | null;
      setActiveObject(object: Object): Canvas;
      discardActiveObject(): Canvas;
      getContext(): CanvasRenderingContext2D;
      getObjects(): Object[];
      forEachObject(callback: (obj: Object, index: number, array: Object[]) => any): Canvas;
      getElement(): HTMLCanvasElement;
      getWidth(): number;
      getHeight(): number;
      setZoom(value: number): Canvas;
      getZoom(): number;
      dispose(): void;
      sendToBack(object: Object): Canvas;
      selection: boolean;
      interactive?: boolean;
      backgroundColor?: string;
      width?: number;
      height?: number;
    }

    class Object {
      set(key: string | object, value?: any): Object;
      get(key: string): any;
      setOptions(options: object): Object;
      scale(value: number): Object;
      setCoords(): Object;
      clone(callback?: Function, propertiesToInclude?: string[]): Object;
      toObject(propertiesToInclude?: string[]): object;
      getSvgStyles(): string;
      rotate(angle: number): Object;
      moveTo(index: number): Object;
      remove(): Object;
      getLeft(): number;
      getTop(): number;
      setLeft(value: number): Object;
      setTop(value: number): Object;
      center(): Object;
      centerH(): Object;
      centerV(): Object;
      getScaledWidth(): number;
      getScaledHeight(): number;
      opacity: number;
      visible: boolean;
      selectable: boolean;
      evented: boolean;
      left: number;
      top: number;
      width: number;
      height: number;
      scaleX: number;
      scaleY: number;
      flipX: boolean;
      flipY: boolean;
      angle: number;
      originX: string;
      originY: string;
      stroke: string | null;
      strokeWidth: number;
      fill: string | null;
    }

    class Text extends Object {
      constructor(text: string, options?: ITextOptions);
      setText(text: string): Text;
      getText(): string;
      setFontSize(value: number): Text;
      getFontSize(): number;
      setFontFamily(value: string): Text;
      getFontFamily(): string;
      text: string;
      fontSize: number;
      fontFamily: string;
      textAlign: string;
      fontWeight: string | number;
      fontStyle: string;
      underline: boolean;
      overline: boolean;
      linethrough: boolean;
      textBackgroundColor: string;
      charSpacing: number;
      styles: object;
      direction: string;
      path: any;
      pathStartOffset: number;
      pathSide: string;
      pathAlign: string;
      lineHeight: number;
      filters: any[];
      applyFilters(): void;
    }

    class Image extends Object {
      constructor(element?: HTMLImageElement | string, options?: any);
      setSrc(src: string, callback?: Function, options?: any): Image;
      filters: any[];
      applyFilters(): void;
      scaleToWidth(width: number): Image;
      scaleToHeight(height: number): Image;
      getScaledWidth(): number;
      getScaledHeight(): number;
      static fromURL(url: string, callback: (image: Image) => void, options?: any): void;

      static filters: {
        BaseFilter: any;
        BlendColor: any;
        Brightness: any;
        Convolute: any;
        GradientTransparency: any;
        Grayscale: any;
        Invert: any;
        Mask: any;
        Multiply: any;
        Noise: any;
        Pixelate: any;
        RemoveColor: any;
        Resize: any;
        Saturation: any;
        Sepia: any;
        Tint: any;
      };
    }

    class Circle extends Object {
      constructor(options?: any);
      radius: number;
    }

    class Rect extends Object {
      constructor(options?: any);
    }

    class Group extends Object {
      constructor(objects?: Object[], options?: any);
      addWithUpdate(object: Object): Group;
      removeWithUpdate(object: Object): Group;
      add(...objects: Object[]): Group;
      remove(...objects: Object[]): Group;
      getObjects(): Object[];
      item(index: number): Object;
      size(): number;
      contains(object: Object): boolean;
      toActiveSelection(): void;
    }

    class ActiveSelection extends Group {
      constructor(objects?: Object[], options?: any);
      toGroup(): Group;
    }

    class Path extends Object {
      constructor(path: string | object, options?: any);
      path: string | any[];
      segmentsInfo?: any[];
      pathOffset?: { x: number; y: number };
    }

    namespace util {
      function cos(angle: number): number;
      function sin(angle: number): number;
      function createCanvasElement(): HTMLCanvasElement;
      function getPointOnPath(path: any, offset: number, segmentsInfo: any): { x: number; y: number; angle: number };
      function getPathSegmentsInfo(path: any): any[];
      function hasStyleChanged(prevStyle: any, newStyle: any, forTextLines?: boolean): boolean;
      function object: {
        extend(destination: object, source: object): object;
      };
    }
  }
}
