
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");




function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
}

module.exports = swaggerDocs;