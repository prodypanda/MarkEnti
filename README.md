# markenti-backend

Welcome to the backend repository of the **markenti** project, a comprehensive solution for entrepreneurs looking to launch their own eCommerce platform. This Node.js application serves as the backbone of the "markenti" website, handling user authentication, product management, order processing, and much more.

This repository serves as a valuable resource for developers and entrepreneurs who are interested in learning more about the backend architecture of an e-commerce platform.

## Overview

markenti is an e-commerce platform back-end REST API that facilitates online storefront management for businesses.

The API supports operations such as product listing, order processing, customer relationship management, and secure payment transactions. The technology stack includes Node.js, Express, MongoDB, Mongoose, axios, jsonwebtoken, and other libraries to create a robust and secure service.

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
- Comprehensive customer management features

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
- **Nodemailer:** for email sending capabilities
- **Passport:** For authentication and authorization.
- **Jsonwebtoken:** For creating JWTs.
- **Helmet:** For securing the application against common web vulnerabilities.
- **Cors:** For enabling cross-origin resource sharing.
- **Morgan:** For logging HTTP requests and responses.
- **Mongoose:** For modeling and interacting with the MongoDB database.
- **Jest:** For testing the application.

## Project Architecture

The project follows a modular architecture, with separate components for configuration, controllers, models, routes, helpers, and middleware. This structure allows for easy organization and maintenance of the code.

## Deployment

The project can be deployed to a cloud platform such as Heroku, AWS EC2, or Google Cloud Platform (GCP). The deployment process will vary depending on the platform chosen.

## Contact

If you have any questions or suggestions, please feel free to reach out to us at admin@prodypanda.com

## Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/en/4x/api.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Documentation](https://jwt.io/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Nodemon Documentation](https://nodemon.io/)
- [Helmet Documentation](https://helmetjs.github.io/)
- [Cors Documentation](https://www.npmjs.com/package/cors)
- [Morgan Documentation](https://www.npmjs.com/package/morgan)
- [Jest Documentation](https://jestjs.io/)

## Future Enhancements

- Add support for multiple languages.
- Implement a search engine for products.
- Add a customer loyalty program.
- Integrate with social media platforms.
- Add a mobile app.
- Improve performance and scalability.
- Add additional security features.
- Implement a content management system.
- Add a blog.
- Add a forum.
- Add a chat feature.
- Add a video tutorial series.
- Add a documentation portal.
- Add a knowledge base.
- Add a help center.
- Add a support forum.
- Add a live chat support.
- Add a payment gateway integration.
- Add a shipping carrier integration.
- Add a referral program.
- Add a social media integration.

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

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

Distributed under the MIT License. See [`LICENSE`](/LICENSE) for more information.

## Acknowledgments

- Node.js community
- MongoDB documentation
- Stripe and PayPal APIs documentation
- [Nodemailer](https://nodemailer.com/about/)
- [Cloudinary](https://cloudinary.com/)
- [Express-validator](https://express-validator.github.io/docs/)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Nodemon](https://nodemon.io/)
- [Helmet](https://helmetjs.github.io/)
- [Cors](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Mongoose](https://mongoosejs.com/)
- [Jest](https://jestjs.io/)

---

Feel free to customize this template further to match your project's specific requirements and personal style.

Happy coding!
