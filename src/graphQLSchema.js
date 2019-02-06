import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	microservicesMutations,
	microservicesQueries,
	microservicesTypeDef
} from './microservices/typeDefs';

import microservicesResolvers from './microservices/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		microservicesTypeDef
	],
	[
		microservicesQueries
	],
	[
		microservicesMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		microservicesResolvers().then(result => {return result}))
});
	console.log(resultado);
