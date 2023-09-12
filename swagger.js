const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for user registration, login, and authentication.',
    },
  },
  apis: ['./app.js'], // Укажите путь к вашему файлу app.js
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
