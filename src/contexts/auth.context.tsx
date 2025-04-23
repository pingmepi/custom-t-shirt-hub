// This file is a compatibility layer to avoid breaking imports
// It re-exports the main Auth context from the context directory

import { AuthProvider, useAuth } from '@/context/AuthContext';

// Re-export the auth context components
export { AuthProvider, useAuth };

// Log a warning about using the deprecated import path
console.warn(
  '[Deprecated] Importing auth context from "@/contexts/auth.context" is deprecated. ' +
  'Please update your imports to use "@/context/AuthContext" instead.'
);
