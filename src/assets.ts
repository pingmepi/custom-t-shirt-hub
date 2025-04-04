// Re-export assets from the assets folder
import mockup1 from '../assets/images/tshirt/mockup-1.png';
import mockup2 from '../assets/images/tshirt/mockup-2.png';
import mockup3 from '../assets/images/tshirt/mockup-3.png';
import mockup4 from '../assets/images/tshirt/mockup-4.png';
import mockup5 from '../assets/images/tshirt/mockup-5.png';
import mockup6 from '../assets/images/tshirt/mockup-6.png';

// Design images
import designFlow from '../assets/images/design/design-flow.png';
import placeholder from '../assets/images/design/placeholder.svg';

// Export all assets for easy access
export const tshirtImages = {
  mockup1,
  mockup2,
  mockup3,
  mockup4,
  mockup5,
  mockup6
};

export const designImages = {
  designFlow,
  placeholder
};

// Quick reference guide for asset paths
export const assetPaths = {
  images: {
    tshirt: 'assets/images/tshirt/',
    design: 'assets/images/design/'
  },
  logos: 'assets/logos/',
  videos: 'assets/videos/',
  gifs: 'assets/gifs/'
};
