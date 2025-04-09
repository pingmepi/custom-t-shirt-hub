# Tech Stack Details

This document provides a comprehensive overview of the technology stack used in our custom t-shirt design application.

## Frontend Framework
- **React**: ^18.2.0
- **TypeScript**: ^5.0.2
- **Vite**: ^5.4.10 (Build tool and development server)

## UI Components and Styling
- **Tailwind CSS**: ^3.3.3 (Utility-first CSS framework)
- **Shadcn UI**: Custom component library built on top of Tailwind and Radix UI
- **Radix UI**: Various components including Dialog, Popover, etc.
- **Lucide React**: ^0.284.0 (Icon library)
- **Class Variance Authority**: ^0.7.0 (For component variants)
- **Tailwind Merge**: ^1.14.0 (For merging Tailwind classes)
- **Clsx**: ^2.0.0 (Utility for conditionally joining class names)

## State Management
- **React Query**: ^4.35.3 (For server state management)
- **React Context API**: For global state management (Auth, Theme, etc.)
- **React Hooks**: Custom hooks for various functionalities

## Routing
- **React Router DOM**: ^6.15.0 (For client-side routing)

## Authentication
- **Supabase Auth**: For authentication and user management
- **JWT**: For token-based authentication

## Backend and Database
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Row-Level Security (RLS) policies
  - Supabase Storage for assets
  - Supabase Functions for serverless functions

## API Communication
- **Supabase JS Client**: ^2.33.2
- **Fetch API**: For HTTP requests

## Form Handling
- **React Hook Form**: ^7.46.1
- **Zod**: ^3.22.2 (For schema validation)

## UI/UX Enhancements
- **Sonner**: ^1.0.3 (Toast notifications)
- **Tailwind Animations**: For UI animations
- **Framer Motion**: For advanced animations (if used)

## Design Tools
- **Canvas API**: For the t-shirt design editor
- **HTML5 Canvas**: For rendering designs

## Development Tools
- **ESLint**: ^8.45.0 (Linting)
- **Prettier**: ^3.0.3 (Code formatting)
- **TypeScript ESLint**: ^6.0.0
- **Vite Plugin React**: ^4.0.4

## Testing (if implemented)
- **Vitest**: For unit testing
- **React Testing Library**: For component testing

## Deployment
- **Vercel/Netlify**: For frontend hosting (likely)
- **Supabase**: For backend services

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ compatible browsers

## Project Structure
- Feature-based organization
- Component-driven architecture
- Custom hooks for reusable logic
- Service layer for API communication

## Key Features
- Authentication with Supabase
- Theme-based design selection
- Custom t-shirt design editor
- User dashboard for saved designs
- Order management system

## Development Practices
- Component-driven development
- Responsive design principles
- Accessibility considerations
- Performance optimization
- Type safety with TypeScript

## Security Measures
- Row-Level Security (RLS) in Supabase
- JWT token validation
- Secure authentication flows
- Input validation with Zod

## Future Considerations
- Potential migration to Next.js for SSR/SSG capabilities
- Integration with payment processors
- Enhanced analytics
- A/B testing capabilities
- Performance monitoring

This tech stack provides a modern, scalable foundation for our custom t-shirt design application, with a focus on performance, developer experience, and user experience.
