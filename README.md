# Custom T-Shirt Hub

## Project Overview

The Custom T-Shirt Hub is a web application that allows users to design custom t-shirts through a guided, theme-based design flow. Users can select themes, answer questions to customize their design, and use a visual editor to make final adjustments before ordering.

![T-Shirt Design Platform](assets/images/design/placeholder.png)

## Features

- **Theme-Based Design**: Select from various design themes to start your t-shirt creation
- **Guided Question Flow**: Answer questions to customize your design based on your preferences
- **Visual Editor**: Fine-tune your design with a powerful canvas-based editor
- **User Authentication**: Secure login and registration with email/password or magic links
- **Design Storage**: Save your designs and return to them later

## Current Status

The project has implemented core authentication and design functionality but requires security improvements and feature completion before it can be considered production-ready. See the [Project Status](./docs/project_status.md) document for detailed information.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Tailwind CSS, Shadcn UI, Radix UI
- **State Management**: React Context API, React Query
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Design Tools**: Fabric.js (Canvas API)

For a detailed breakdown of the technology stack, see the [Tech Stack Documentation](./docs/tech_stack.md).

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/custom-t-shirt-hub.git

# Navigate to the project directory
cd custom-t-shirt-hub

# Install dependencies
npm install

# Set up environment variables
# Copy the example .env file and fill in your Supabase credentials
cp .env.example .env

# Start the development server
npm run dev
```

## Documentation

Comprehensive documentation is available in the [docs](./docs) directory:

- [Project Status](./docs/project_status.md) - Current state of the project
- [Feature Tracker](./docs/feature_tracker.md) - Implementation status of features
- [Security Checklist](./docs/security_checklist_updated.md) - Security audit and recommendations
- [API Documentation](./docs/api_details.md) - API endpoints and usage
- [Tech Stack Details](./docs/tech_stack.md) - Detailed technology overview

## Security Status

Several critical security issues have been identified and need to be addressed, particularly:

1. Authentication tokens stored in localStorage (XSS vulnerability)
2. Unscoped API queries
3. Lack of input sanitization
4. Missing security headers
5. No rate limiting on sensitive endpoints

See the [Security Checklist](./docs/security_checklist_updated.md) for a detailed breakdown of security concerns and recommendations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
