import { designImages } from "@/assets";

/**
 * Utility to handle image loading errors with multiple fallbacks
 * @param event The error event from the img element
 * @param fallbacks Array of fallback URLs to try
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbacks: (string | null | undefined)[]
): void => {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  // Find the next fallback that's different from the current source
  const nextFallback = fallbacks.find(url => url && url !== currentSrc);
  
  if (nextFallback) {
    console.log(`[ImageUtils] Image failed to load: ${currentSrc}, trying fallback: ${nextFallback}`);
    img.src = nextFallback;
  } else {
    // If all fallbacks fail, use the default placeholder
    if (currentSrc !== designImages.placeholder) {
      console.log(`[ImageUtils] All fallbacks failed, using default placeholder`);
      img.src = designImages.placeholder;
    } else {
      // If even the placeholder fails, hide the image and show an error icon
      console.log(`[ImageUtils] Default placeholder failed, showing error icon`);
      img.style.display = 'none';
      const parent = img.parentElement;
      if (parent) {
        parent.innerHTML = `
          <div class="flex items-center justify-center w-full h-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
              class="text-gray-400">
              <line x1="2" x2="22" y1="2" y2="22"></line>
              <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path>
              <line x1="13.5" x2="6.5" y1="13.5" y2="20.5"></line>
              <path d="M13.5 13.5 21 21"></path>
              <path d="M15 7.5 16.5 6"></path>
              <path d="M17 3.34a10 10 0 1 1-14.32 14.32"></path>
            </svg>
          </div>
        `;
      }
    }
  }
};
