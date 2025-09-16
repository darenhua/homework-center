import fs from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";

const BLOB = ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier("Blob")
); // `Blob`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

/**
 * Generate types from the OpenAPI schema, while also also allowing us to override types
 * to support more than the defaults.
 */
const generateTypeSchema = async () => {
    const ast = await openapiTS("http://localhost:8000/openapi.json", {
        transform(schemaObject) {
            if (schemaObject.format === "binary") {
                return schemaObject.nullable
                    ? ts.factory.createUnionTypeNode([BLOB, NULL])
                    : BLOB;
            }
        },
    });
    const schema = astToString(ast);
    fs.writeFileSync("./src/types/schema.gen.ts", schema);
};

generateTypeSchema()
    .then(() => {
        console.log("done");
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
