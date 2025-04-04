# T-Shirt Design & Ordering Platform - Product Requirements Document

**Date**: 2025-04-01\
**Author**: [Your Name]\
**Status**: Draft

## Overview

A personalized t-shirt design and ordering platform that enables users to create custom apparel through a dynamic, AI-assisted design flow with editable previews. Built for manual fulfillment today, the system is modular to enable automated printing and shipping tomorrow. The architecture will follow a modular design approach, allowing key components such as the design engine, fulfillment service, or payment gateway to be swapped or upgraded independently. The landing page will act as an entry point showcasing pre-designed templates. Users can preview these on various t-shirt colors before entering the design flow.

## Problem Statement

Users lack an intuitive platform to easily design, personalize, and order printed t-shirts with a smooth design experience and reliable fulfillment.

## Success Metrics

- % users who complete a design
- % design -> order conversions
- Manual fulfillment turnaround time
- Order feedback (CSAT)

## User Stories

```
As a customer
I want to answer a few simple design questions
So that I can create a personalized t-shirt that reflects my style

As a customer
I want a dashboard that shows a draft of a design (only give one draft option) to edit the generated design through a visual editor
So that I can personalize the output to match my preferences

As an admin
I want to manage, fulfill, and track orders
So that I can ensure smooth delivery and customer satisfaction
```

## Functional Requirements

### Must Have
 Landing page showcasing pre-designed t-shirts to inspire users

 T-shirt color selector to preview templates on different colors (e.g., black, white, grey)

 User authentication with email/password
 as V1, keep the signup/signin flow simpla:
 - user enters email and password
 - if the details already exist in the database, the user has successfully logged in
 - if details do not exist, throw error "incorrect username/password"
 - highlight "signup instead" button
 - if the user clicks on signup, reload the page and take user details to create a new user. 
 - details required in the signup form are name, email, and password 
 - once the user completes the signup flow, redirect them to login again

 Role-based access control (Customer, Admin)

 Theme selection view with ~15 predefined themes shown as cards/toggles

 API integration to fetch 5 context-relevant questions based on selected themes

 Step-by-step question flow with one question shown at a time and a progress bar

 If the user is not logged in now, then a sign-up pop-up should be shown.

 Once the user logs in, the design created from the previous step should be available on the user's landing page. 

 Capture and store all user responses to questions

 Generate a preview design based on question inputs (via model/API)

 Allow users to edit the generated design using a visual editor (fabric.js)

 Store the original model-generated image and the final user-edited image

 Maintain metadata: themes, user responses, editor actions, timestamps

 Enable design reordering from saved history

 Collect shipping details including phone, address, and pin code. This can also be edited from the user profile in user dashboard. 

 Integrate payments using Razorpay or Stripe

 Create orders with status tracking (pending, printing, shipped, delivered)

 User dashboard to view saved designs and past orders

 Admin dashboard to manage and update order statuses

 Basic support section with contact number

 Track question usage statistics for analytics and improvement

 Store comprehensive user style preferences from responses

 Color input type support in the question flow

 Proper validation for all user inputs in the design flow

 Error handling for all API calls and form submissions

 Responsive layout for all design flow screens


Additional Requirements:
- Remember me functionality for login
- Password visibility toggle in login/signup forms
- Forgot password functionality
- Form validation with proper error messages
- Redirect handling after login (return to previous page)
- Test credentials support for development (refer to test_file)
- User session management and persistence
- Background process handling for long-running operations
- Proper error handling for all API operations
- Loading states for async operations

### Nice to Have

 Toggle in user profile to enable/disable style-based design suggestions

 Track user design preferences for personalized suggestions

 Click-to-customize a prebuilt design from the landing page

 Dark mode support throughout the application

 Social media sharing of completed designs

 Bulk order discounts for team/group orders

 Design template marketplace where users can sell their designs

 Advanced color customization options with color harmony suggestions


Additional Nice to Have:
- Multi-factor authentication
- OAuth provider expansion (GitHub, Twitter)
- Session management across devices
- User activity logging
- Advanced password policies
- Account deletion functionality
- Export design history
- Batch operations for admin panel

## Technical Requirements

> **Note**: For a comprehensive list of all APIs (implemented, documented, and planned), including endpoints, payloads, and usage details, refer to [API Documentation](./api_details.md).

### APIs Required

#### `GET /prebuilt-designs`
Fetches a list of pre-made design templates to display on the landing page.

**Response:**
```json
{
  "designs": [
    {
      "id": "demo-101",
      "title": "Travel Explorer",
      "preview_images": {
        "white": "https://cdn.example.com/designs/demo101-white.png",
        "black": "https://cdn.example.com/designs/demo101-black.png",
        "grey": "https://cdn.example.com/designs/demo101-grey.png"
      }
    }
  ]
}
```

**Mandatory Fields:**
- `id`, `title`, and at least one color variant in `preview_images`

Below are the APIs along with their expected request and response JSON formats:

---

#### `GET /themes`

Fetch all available themes to be shown on the theme selection screen.

**Mandatory Fields in Response:**

- `id`: (string) unique identifier for each theme
- `name`: (string) name of the theme shown on UI

**Response:**

```json
{
  "themes": [
    {"id": "theme-1", "name": "Travel"},
    {"id": "theme-2", "name": "Music"},
    {"id": "theme-3", "name": "Sports"},
    {"id": "theme-4", "name": "Art"},
    {"id": "theme-5", "name": "Gaming"}
  ]
}
```

\--- along with their expected request and response JSON formats:

---

#### `POST /generate-questions`

**Mandatory Fields in Request:**

- `themes`: (array of strings) list of selected theme IDs
  **Request:**

```json
{
  "themes": ["sports", "travel", "music"]
}
```

**Response:**

```json
{
  "questions": [
    {"id": 1, "text": "What is your favorite destination?"},
    {"id": 2, "text": "What type of clothing do you prefer?"},
    {"id": 3, "text": "What is your go-to color palette?"},
    {"id": 4, "text": "Any specific message or slogan?"},
    {"id": 5, "text": "Do you want an image included?"}
  ]
}
```

---

#### `POST /submit-responses`

**Mandatory Fields in Request:**

- `user_id`: (string) unique identifier for the user
- `responses`: (object) mapping of question IDs to user responses
  **Request:**

```json
{
  "user_id": "user-123",
  "responses": {
    "q1": "Paris",
    "q2": "Oversized T-shirt",
    "q3": "Muted pastels",
    "q4": "Wander often",
    "q5": "Yes"
  }
}
```

**Response:**

```json
{
  "design_intent": {
    "theme": "travel",
    "style": "oversized",
    "colors": "pastel",
    "text": "Wander often",
    "include_image": true
  }
}
```

---

#### `POST /generate-design-preview`

**Mandatory Fields in Request:**

- `design_intent.text`: (string)
- `design_intent.colors`: (string)

**Optional Fields:**

- `design_intent.layout`
- `design_intent.image`
  **Request:**

```json
{
  "design_intent": {
    "text": "Wander often",
    "colors": "pastel",
    "layout": "center",
    "image": "default-travel-icon.png"
  }
}
```

**Response:**

```json
{
  "preview_url": "https://cdn.yourapp.com/previews/design123.png"
}
```

---

#### `POST /save-final-design`

**Mandatory Fields in Request:**

- `user_id`: (string)
- `final_design_data.text`, `final_design_data.colors`: (strings)

**Optional Fields:**

- `final_design_data.font`
- `final_design_data.image`
- `final_design_data.layout`
- `editor_actions`: (array of strings)
  **Request:**

```json
{
  "user_id": "user-123",
  "final_design_data": {
    "text": "Wander often",
    "colors": "pastel",
    "font": "Sans Serif",
    "image": "user-upload-abc.png",
    "layout": "center"
  },
  "editor_actions": ["text-changed", "image-replaced", "alignment-updated"]
}
```

**Response:**

```json
{
  "design_id": "design-789",
  "preview_url": "https://cdn.yourapp.com/final/design789.png",
  "metadata": {
    "timestamp": "2025-04-01T10:00:00Z",
    "themes": ["travel"],
    "question_responses": {"q1": "Paris", "q2": "Oversized T-shirt", ...},
    "configuration": {"text": "Wander often", "colors": "pastel"},
    "editor_actions": ["text-changed", "image-replaced"]
  }
}
```

---

#### `POST /create-order`

**Mandatory Fields in Request:**

- `user_id`: (string)
- `design_id`: (string)
- `shipping_info.name`, `address`, `city`, `state`, `postal_code`, `phone`: (strings)
- `payment_id`: (string)
  **Request:**

```json
{
  "user_id": "user-123",
  "design_id": "design-789",
  "shipping_info": {
    "name": "Jane Doe",
    "address": "123 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "postal_code": "560001",
    "phone": "+91-9876543210"
  },
  "payment_id": "pay_abc123"
}
```

**Response:**

```json
{
  "order_id": "order-456",
  "status": "pending"
}
```

---

#### `GET /user-orders`

**Mandatory Fields in Request:**

- `user_id`: (string)
  **Request:**

```json
{
  "user_id": "user-123"
}
```

**Response:**

```json
{
  "orders": [
    {
      "order_id": "order-456",
      "design_preview": "https://cdn.yourapp.com/final/design789.png",
      "status": "delivered",
      "placed_on": "2025-04-01T10:05:00Z"
    }
  ]
}
```

---

#### `GET /admin-orders`

**Optional Fields in Request:**

- `filter.status`: (string) filter by order status
  **Request:**

```json
{
  "filter": {"status": "pending"}
}
```

**Response:**

```json
{
  "orders": [
    {
      "order_id": "order-456",
      "user_name": "Jane Doe",
      "design_id": "design-789",
      "shipping_city": "Bangalore",
      "status": "pending"
    }
  ]
}
```

---

#### `POST /update-order-status`

**Mandatory Fields in Request:**

- `order_id`: (string)
- `new_status`: (string)
  **Request:**

```json
{
  "order_id": "order-456",
  "new_status": "shipped"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order status updated to shipped"
}
```

---

#### `GET /design/:id`

**Mandatory Fields in URL Path:**

- `id`: (string) design ID
  **Response:**

```json
{
  "design_id": "design-789",
  "user_id": "user-123",
  "initial_image": "https://cdn.yourapp.com/previews/design123.png",
  "final_image": "https://cdn.yourapp.com/final/design789.png",
  "metadata": {
    "themes": ["travel"],
    "question_responses": {"q1": "Paris", ...},
    "configuration": {"text": "Wander often", "font": "Sans Serif"},
    "editor_actions": ["text-changed"]
  }
}
```


#### `GET /question-stats`

**Response:**

```json
{
  "most_used_questions": [
    {"id": "q1", "text": "What's your favorite color?", "usage_count": 156},
    {"id": "q3", "text": "What style are you looking for?", "usage_count": 142}
  ],
  "most_common_responses": {
    "q1": {"Blue": 45, "Black": 32, "Red": 29},
    "q3": {"Minimal": 67, "Bold": 42, "Vintage": 33}
  }
}
```

#### `GET /user-preferences/:userId`

**Response:**

```json
{
  "color_preferences": ["blue", "pastel", "muted"],
  "style_preferences": ["minimal", "elegant"],
  "most_recent_design_id": "design-789",
  "total_designs": 4,
  "total_orders": 2
}
```


### Authentication Flow
- Email/Password authentication
- OAuth providers (Google, Facebook)
- Session management
- Remember me functionality 
- Password reset flow
- Email verification
- Test credentials handling

### State Management
- User session persistence
- Design state management
- Form state handling
- Loading states
- Error states
- Background process management

### Error Handling
- Form validation errors
- API error handling
- Network error handling
- Session timeout handling
- Graceful degradation
- Error logging and monitoring

- Modular component structure allowing services such as vendor APIs, payment processors, or the design editor to be replaced without affecting other parts of the system

- Supabase for authentication, database, and storage

- Custom API to return theme-based questions

- Razorpay/Stripe for payments

- Modular backend to enable future vendor integrations

## UI/UX Requirements
- Clean, Flowing UX/UI
- Landing page with a carousel or grid of already-made designs to inspire users
- Option for users to preview each design on different t-shirt colors (e.g., white, black, grey)
- Theme selection view with \~15 predefined interest themes displayed as cards or toggles
- Progress bar for 5-question design flow
- One-question-at-a-time design UI
- A DesignCanvas where there is a preloaded shirt image, with options to change the color
- The DesignCanvas also should give the option to add text, logo, and image on the already selected color tee
- Users should have an option to move and delete the added elements
- Clean dashboard for user profile, saved designs, orders, and the current design that is being edited
- Only one draft can be saved per profile
- Support page with email and phone
- If the user has logged in with 'Remember Me' then they should not be asked to login again (till cookies expire)
- Color picker input with support for both visual selection and text input
- Clear error messages for failed operations
- Loading states for all asynchronous operations
- Responsive layouts for all screen sizes
- Accessible form controls with proper labels


## Dependencies

- Supabase (Auth, DB, Storage)
- Razorpay/Stripe
- fabric.js / Konva.js for design engine
- Vercel (Hosting)

## Timeline

- Phase 1: Core auth, theme-based design flow, preview & editor setup
- Phase 2: Checkout, payment integration, and order management
- Phase 3: Admin panel, design history, fulfillment hooks

## Open Questions

- How can the modularity of each system component be maintained for long-term flexibility and scalability?

- How are designs versioned for edits post-order?
  → All orders are saved in a table with a reference to the specific version of the design used. When the user returns to reorder, designs from their order history are displayed, ensuring consistency and traceability.

- What criteria define 'user style' for personalization? 

- How will automated vendor APIs be integrated later?


## Security Considerations

- Row-Level Security (RLS) policies ensure users can only access their own designs and orders
- Admin roles have controlled access to manage questions and view order statistics
- Authentication tokens are properly managed with appropriate expiration and refresh
- User style metadata is stored securely and used only for enhancing personalization

## Performance Optimization

- Questions are cached to reduce database load
- Question usage statistics are updated asynchronously
- Design previews are optimized for fast loading
- Proper error handling prevents system failures during peak loads

## Accessibility Requirements

- All form inputs include proper aria labels
- Color inputs support both visual selection and text entry
- Progress indicators use both color and text to show completion status
- Error messages are clear and provide actionable information


