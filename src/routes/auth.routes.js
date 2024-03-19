const express = require('express')
const router = express.Router()

// [Error Prone] Require statement not part of import statement.Codacy [ESLint]ESLint8_@typescript-eslint_no-var-requires)
const authController = require('../controllers/auth.controller')
// const validateRegisterInput = require('../validation/register');

/**
 * Validators for user input on register and login.
 */
const {
  validateUserRegister,
  validateUserLogin
} = require('../validation/inputValidator')

router.post('/register', validateUserRegister, authController.register)

router.post('/login', validateUserLogin, authController.login)

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint is used for registering a new user. It requires valid user details.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Username already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *     security: []
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60730a4c7158713683f9fa29
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     role:
 *                       type: string
 *                       example: customer
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA3MzBhNGM3MTU4NzEzNjgzZjlmYTI5In0sImlhdCI6MTYxODE3NzcwMCwiZXhwIjoxNjE4MjY0MTAwfQ.S5Pzl8ONojyR9QJ-NH3XEW8hXb6kx9UoC570pTAG338
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *                       res0:
 *                           summary: Example of a missing credentials
 *                           value:
 *                               message: "Missing credentials"
 *                       res1:
 *                           summary: Example of an incorrect email
 *                           value:
 *                               message: "Incorrect email."
 *                       res2:
 *                           summary: Example of an incorrect password
 *                           value:
 *                               message: "Incorrect password."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *     security: []
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60730a4c7158713683f9fa29
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router
