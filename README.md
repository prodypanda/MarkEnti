# markenti-backend

Welcome to the backend repository of the **markenti** project, a comprehensive solution for entrepreneurs looking to launch their own eCommerce platform. This Node.js application serves as the backbone of the "markenti" website, handling user authentication, product management, order processing, and much more.

## Overview
markenti is an e-commerce platform back-end REST API that facilitates online storefront management for businesses. The API supports operations such as product listing, order processing, customer relationship management, and secure payment transactions. The technology stack includes Node.js, Express, MongoDB, Mongoose, axios, jsonwebtoken, and other libraries to create a robust and secure service.

## Features

- **User Authentication & Authorization:** Secure signup/login, password encryption, JWT-based session management, and role-based access control.
- **Dashboard Management:** Personalized user dashboards for profile updates, site customization, and analytics.
- **Product & Category Management:** Full CRUD operations for managing products and categories, including image uploads and stock management.
- **Order Management:** A streamlined process for placing, tracking, and managing orders.
- **Shipping Management:** Integration with shipping carriers for tracking and cost management.
- **Staff Management:** Admin functionality to manage staff user roles and permissions.
- **E-commerce Pack Purchase:** Integration with payment gateways for handling subscriptions and purchases.
- **Payment Processing:** Secure and flexible checkout options for customers.
- **Analytics:** Insightful reports on sales, product popularity, and traffic for strategic planning.
- Role-based JWT authentication for admins, customers, and guests.
- Catalog system with categories and product variations (size, color).
- Order management system with status tracking and admin functionalities.
- Checkout processes for guest and registered users.
- Email and in-app notifications for order confirmations.
- Shipping carrier and cost management system.
- Payment gateway integration (PayPal, Stripe) supporting multiple currencies.
- Comprehensive customer management features.
- Compliance with security standards (PCI DSS, OWASP).
- Rate limiting to prevent system abuse.

## User Stories
- Secure login for store admins and owner operations
- Dynamic product and inventory management by store owners
- Secure checkout for customers
- Flexible and secure checkout options for customers
- Comprehensive order management for store admins
- Role-based access control for store admins and customers
- Personalized dashboards for store admins and customers
- Configurable site customization for store admins
- Role-based access control for store admins and customers
- Personalized dashboards for store admins and customers
- Configurable site customization for store admins
- Configurable order management for store admins
- Configurable staff management for store admins
- Configurable product management for store admins
- Configurable category management for store admins
- Configurable product image management for store admins
- Configurable product stock management for store admins
- Configurable product variation management for store admins
- Configurable product variant image management for store admins
- Configurable product variant stock management for store admins
- Configurable product variant price management for store admins
- Configurable product variant size management for store admins
- Configurable product variant color management for store admins
- Configurable product variant quantity management for store admins
- Configurable product variant status management for store admins
- Configurable shipping management for store admins
- Comprehensive customer management for store admins
- Configurable payment processing for store admins
- Comprehensive analytics for store admins
- Integrated payment processing adaptable to multiple payment systems
- Robust customer account management with insights and store customization tools
- Secure and flexible checkout options for customers
- Role-based access control for store admins and customers
- System integrity through compliance with security standards and rate limiting features


## Technology Stack

- **Node.js & Express.js:** For creating a robust and scalable server-side application.
- **MongoDB & Mongoose:** NoSQL database and ODM for flexible data modeling.
- **JWT & Bcrypt:** For secure authentication and data encryption.
- **Express-validator:** For validating user input.
- **Dotenv:** For managing environment variables.
- **Axios:** For making HTTP requests to external APIs.
- **Cloudinary:** For image hosting and management.
- **Nodemailer:** for email sending capabilities
- **Stripe/PayPal APIs:** For handling payments and subscriptions.

Additional libraries and middlewares are used to ensure performance, security, and functionality which are detailed in the project's `package.json` file.

## Project Structure
```
/project_root
    /src
        /config
        /controllers
        /models
        /routes
        /helpers
        /middleware
    package.json
    .env
    ...additional files and directories
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (v4.4 or later)
- npm (v6.14 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/prodypanda/markenti.git
   ```
2. Navigate to the project directory:
   ```
   cd markenti
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Rename the `.env.exemple` file to `.env` in the root directory and fill in your environment variables:
   ```
   DB_URI=mongodb://your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_KEY=your_stripe_api_key
   ```
5. Start the server:
   ```
   npm start
   ```

## API Documentation

Refer to the [API Documentation](/docs/api.md) for detailed information on endpoint usage and examples.

## Contributing

We welcome contributions to the **markenti** project! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Node.js community
- MongoDB documentation
- Stripe and PayPal APIs

---

Feel free to customize this template further to match your project's specific requirements and personal style.
