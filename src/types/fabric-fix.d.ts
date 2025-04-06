// This file extends the CanvasTextBaseline type to include 'alphabetical'
// which is used by fabric.js but is not a standard value

declare global {
  // Extend the CanvasTextBaseline type to include 'alphabetical'
  type CanvasTextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom' | 'alphabetical';
}

export {};
