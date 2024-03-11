const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
// const validateRegisterInput = require('../validation/register');
const {
  validateUserRegister,
  validateUserLogin
} = require('../validation/inputValidator')

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 *  /api/auth/register:
 *    post:
 *      summary: Registers a new user
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - username
 *                - email
 *                - password
 *              properties:
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *              example:
 *                username: johndoe
 *                email: johndoe@example.com
 *                password: Password123
 *      responses:
 *        "201":
 *          description: User registered successfully
 *        "500":
 *          description: Server error
 */

router.post('/register', validateUserRegister, authController.register)

/**
 * @swagger
 *  /api/auth/login:
 *    post:
 *      summary: Login an existing user
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - username
 *                - password
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *                  format: password
 *              example:
 *                username: johndoe
 *                password: Password123
 *      responses:
 *        "200":
 *          description: User loged in successfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              format: ObjectId
 *                          username:
 *                              type: string
 *                          role:
 *                              type: string
 *                          token:
 *                              type: string
 *                      example:
 *                          _id: "65ac68bef7e5c9e12534b71e"
 *                          username: "admin"
 *                          role: "admin"
 *                          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWM2OGJlZjdlNWM5ZTEyNTM0YjcxZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNjMzODQwMSwiZXhwIjoxNzA2MzQyMDAxfQ.R2sPLKMNHoGRVQ2yVf61krPx5hyOK-226nq3-IoH09c"
 *        "400":
 *          description: Incorrect email or password
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                  examples:
 *                      res0:
 *                          summary: Example of a missing credentials
 *                          value:
 *                              message: "Missing credentials"
 *                      res1:
 *                          summary: Example of an incorrect email
 *                          value:
 *                              message: "Incorrect email."
 *                      res2:
 *                          summary: Example of an incorrect password
 *                          value:
 *                              message: "Incorrect password."
 *        "500":
 *          description: Server error
 */
router.post('/login', validateUserLogin, authController.login)

module.exports = router
