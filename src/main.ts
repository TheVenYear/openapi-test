import "reflect-metadata";
import path from "path";
import { Express } from "express";
import swaggerUiExpress from "swagger-ui-express";
import {
  createExpressServer,
  getMetadataArgsStorage,
  useContainer,
} from "routing-controllers";
import { Container } from "typedi";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

const { defaultMetadataStorage } = require("class-transformer/cjs/storage");

useContainer(Container);

const routingControllersOptions = {
  controllers: [path.join(__dirname, "/modules/*/*.controller.*")],
};

const server = createExpressServer(routingControllersOptions);

const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: "#/components/schemas/",
});

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: "basic",
        type: "http",
      },
    },
  },
  info: {
    description: "Generated with `routing-controllers-openapi`",
    title: "A sample API",
    version: "1.0.0",
  },
});

server.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

// Render spec on root:
server.get("/", (_req, res) => {
  res.json(spec);
});

server.listen(8000);
