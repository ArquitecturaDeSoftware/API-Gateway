import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	statisticsMutations,
	statisticsQueries,
	statisticsTypeDef
} from './statistics/typeDefs';

import statisticsResolvers from './statistics/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		statisticsTypeDef
	],
	[
		statisticsQueries
	],
	[
		statisticsMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		statisticsResolvers
	)
});
