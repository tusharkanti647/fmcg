//const swaggerJsdoc = require('swagger-jsdoc')
//const swaggerUi = require('swagger-ui-express');
//const YAML=require('yamljs');

//const swaggerJsdoc = YAML.load('./api.yaml');
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");


// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Hero API',
//       description: 'Example of CRUD API ',
//       version: '1.0.0',
//     },
//     servers: [{
//       url: 'http://localhost:8000',
//     }]
//   },
//   // looks for configuration in specified directories
//   apis: ['./routes/*.js'],
// }

//const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app, port) {
  // Swagger Page
  //app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
}

module.exports = swaggerDocs;