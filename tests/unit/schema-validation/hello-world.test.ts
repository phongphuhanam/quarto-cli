import { ensureAjv, YAMLSchema } from "../../../src/core/schema/yaml-schema.ts";
import { readAnnotatedYamlFromString } from "../../../src/core/schema/annotated-yaml.ts";
import { asMappedString } from "../../../src/core/mapped-text.ts";

import { initTreeSitter } from "../../../src/core/lib/yaml-validation/deno-init-tree-sitter.ts";
import { initPrecompiledModules } from "../../../src/core/lib/yaml-validation/deno-init-precompiled-modules.ts";
import {
  initState,
  makeInitializer,
  setInitializer,
} from "../../../src/core/lib/yaml-validation/state.ts";
import { setSchemaDefinition } from "../../../src/core/lib/yaml-validation/schema.ts";
import { yamlValidationUnitTest } from "./utils.ts";

yamlValidationUnitTest("schema-validation-hello-world", async () => {
  const src = `
lets:
  - 1
  - 2
  - 3
  - 4
go:
  - there
  - and
  - elsewhere
what:
  about:
    nested: "things like this"
`;
  const schema = {
    "type": "object",
    "properties": {
      "lets": { "type": "number", "maximum": 2 },
      "annotate": { "type": "string" },
    },
    "$id": "test-schema",
  };
  setSchemaDefinition(schema);
  const yamlSchema = new YAMLSchema(schema);
  // deno-lint-ignore no-explicit-any
  const fromPlainString = (schema: any, src: string) =>
    schema.validateParse(asMappedString(src), readAnnotatedYamlFromString(src));
  await fromPlainString(yamlSchema, src);
});
