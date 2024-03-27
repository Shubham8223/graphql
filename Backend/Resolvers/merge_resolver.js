import { mergeResolvers } from "@graphql-tools/merge";

import user_resolver from "./user_resolver.js";
import transaction_resolver from "./transaction_resolver.js";

const merged_resolvers = mergeResolvers([user_resolver, transaction_resolver]);

export default merged_resolvers;