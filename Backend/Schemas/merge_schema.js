import { mergeTypeDefs } from "@graphql-tools/merge";

import user_schema from "./user_schema.js";
import transaction_schema from "./transaction_schema.js";

const merged_schema = mergeTypeDefs([user_schema, transaction_schema]);

export default merged_schema;
