'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url, parameters);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

async function generalRequestHead(url, method, token) {
	const parameters = {
		method,
		uri: encodeURI(url),
		family: 4,
		headers: {'x-auth-token':token},
		json: true,
		
	};
	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}${path}`, parameters);
	console.log(url);
	
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const microservicesTypeDef = `
input StatisticInput {
    id_restaurant: String!
    date: String!
    sold_lunches: Int!
    canceled_shifts: Int!
    av_time: Float!
    av_punctuation: Float!
    bonus_sold: Int!
    student_sold: Int!
    external_sold: Int!
}
type Statistic {
    id: String!
    id_restaurant: String!
    date: String!
    sold_lunches: Int!
    canceled_shifts: Int!
    av_time: Float!
    av_punctuation: Float!
    bonus_sold: Int!
    student_sold: Int!
    external_sold: Int!
}
type Statistic_GET {
    t : [Statistic]
    err: String
}
type Statistic_POST {
    t : Statistic
    err: String
}
type Statistic_DEL {
    err: String
}



input LunchroomInput{
    name: String!
    numlunch: Int!
    openTime: String!
    closeTime: String!
    building: String!
    code: String!
    principalCount: Int!
}
type Lunchroom{
    _id: String!
    name: String!
    numlunch: Int!
    openTime: String!
    closeTime: String!
    building: String!
    code: String!
    principalCount: Int!
}



input MenuInput_PUT{
    soup: String
    appetizer: String
    main_course: String
    protein: String
    juice: String
    dessert: String
    salad: String
}
input MenuInput_POST{
    id_lunchroom: String!
    soup: String!
    appetizer: String!
    main_course: String!
    protein: String!
    juice: String!
    dessert: String!
    salad: String!
}
type Menus{
    id_menu: Int!
    id_lunchroom: String!
    date: String!
    soup: String!
    appetizer: String!
    main_course: String!
    protein: String!
    juice: String!
    dessert: String!
    salad: String!
}
type MenuResponse_PUT{
    msg: String
}



input PostInput{
    id: Int!
    text: String!
    author_name: String! 
    author_email: String!
    restaurant_id: String!
    score: Int!
}
type Posts{
    id: Int!
    created_on: String!
    text: String!
    author_name: String!
    author_email: String!
    restaurant_id: String!
    score: Int!
}



input TicketInput{
    lunchroomId: String!
    userId: Int!
    price: Int!
    name: String!
}
input Ticket_PATCH{
    status: String!
}
type Tickets{
    id: Int!
    lunchroomId: String!
    userid: Int
    status: String!
    price: Int!
    date: String!
    name: String!
}



input UserInput{
    cedula: String!
    name: String!
    lunchroom_id: String!
    active_ticket: String!
    password: String
}
input UserPUT {
    active_ticket: String!
}
type Users{
    _id: String!
    cedula: String!
    name: String!
    lunchroom_id: String!
    active_ticket: String!
}
input Login{
    name: String!
    password: String!
}`;


const microservicesQueries = `
    allStatistics: Statistic_GET!
    statisticByRestaurant(id_restaurant: String!): Statistic_GET!

    allLunchrooms: [Lunchroom]!
    lunchroomById(id_lunchroom: String!): Lunchroom!

    allMenus: [Menus]!
    menusByRestaurant(id_restaurant: String!): [Menus]! 

    allPosts: [Posts]!
    postsByRestaurant(id_restaurant: String!): [Posts]!

    allTickets: [Tickets]!
    ticketsByUser(id_user: String!): [Tickets]!
    ticketsByRestaurant(id_restaurant: String!): [Tickets]!
    ticketByID(id_ticket: String!): Tickets!
    nextTicket(id_restaurant: String!): Tickets!
    ticketsBefore(id_ticket: String!): [Tickets]!

    userById(cedula_user: String!): Users!
    verifyToken(token: String!): String!



    nextTicketToken(id_restaurant: String!, token:String!): Tickets!
    statisticByRestaurantToken(id_restaurant: String!, token:String!): Statistic_GET!
    ticketsByRestaurantToken(id_restaurant: String!, token:String!): [Tickets]!
    userByIdToken(cedula_user: String!, token: String!): Users!
`;


const microservicesMutations = `
    createStatistic(statistic: StatisticInput!): Statistic_POST
    deleteStatistic(id_statistic: String!): Statistic_DEL

    updateLunchroom(id_lunchroom: String!, lunchroom: LunchroomInput!): Lunchroom
    createLunchroom(lunchroom: LunchroomInput!): String
    deleteLunchroom(id_lunchroom: String!): String

    updateMenu(id_restaurant: String!, menu: MenuInput_PUT!): MenuResponse_PUT
    createMenu(menu: MenuInput_POST!): String 

    createPost(post: PostInput!): Posts 

    createTicket(ticket: TicketInput!): Tickets
    deleteTicket(id_ticket: String!): String
    updateTicket(id_ticket: String!, ticket: Ticket_PATCH!): Tickets

    createUser(user: UserInput!): Users
    deleteUser(id_user: String!): String
    updateUser(id_user: String!, user: UserPUT): String
    login(login: Login!): String



    updateTicketToken(id_ticket: String!, ticket: Ticket_PATCH!, token: String!): Tickets
    updateUserToken(id_user: String!, user: UserPUT, token: String!): String
`;

const url_S = process.env.STATISTICS_URL;
const port_S = process.env.STATISTICS_PORT;
const entryPoint_S = process.env.STATISTICS_ENTRY;
const url_L = process.env.LUNCHROOM_URL;
const port_L = process.env.LUNCHROOM_PORT;
const entryPoint_L = process.env.LUNCHROOM_ENTRY;
const url_M = process.env.MENU_URL;
const port_M = process.env.MENU_PORT;
const entryPoint_M = process.env.MENU_ENTRY;
const url_P = process.env.POST_URL;
const port_P = process.env.POST_PORT;
const entryPoint_P = process.env.POST_ENTRY;
const url_T = process.env.TICKETS_URL;
const port_T = process.env.TICKETS_PORT;
const entryPoint_T = process.env.TICKETS_ENTRY;
const url_U = process.env.USERS_URL;
const port_U = process.env.USERS_PORT;
const entryPoint_U = process.env.USERS_ENTRY;

const URL_L = `http://${url_L}:${port_L}/${entryPoint_L}`;
const URL_S = `http://${url_S}:${port_S}/${entryPoint_S}`;
const URL_M = `http://${url_M}:${port_M}/${entryPoint_M}`;
const URL_P = `http://${url_P}:${port_P}/${entryPoint_P}`;
const URL_T = `http://${url_T}:${port_T}/${entryPoint_T}`;
const URL_U = `http://${url_U}:${port_U}/${entryPoint_U}`;


const resolvers = {

	Query: {
		// Statistics
		allStatistics: (_) =>
			getRequest(URL_S, '/'),
		statisticByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL_S}/${id_restaurant}`, 'GET'),
		// Lunchrooms
		allLunchrooms: () =>
			getRequest(URL_L, ''),
		lunchroomById: (_, { id_lunchroom }) => 
			generalRequest(`${URL_L}/${id_lunchroom}`, 'GET'),
		// Menus
		allMenus: (_) =>
			getRequest(URL_M, '/'),
		menusByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL_M}/?id_lunchroom=${id_restaurant}`, 'GET'),		
		// Ratings-reviews
		allPosts: (_) =>
			getRequest(URL_P, '/'),
		postsByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL_P}/${id_restaurant}`, 'GET'),
		// Tickets
		allTickets: (_) =>
			getRequest(`${URL_T}`, '/'),
		ticketsByUser: (_, { id_user }) =>
			generalRequest(`${URL_T}/user/${id_user}`, 'GET'),
		ticketsByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL_T}/lunchroom/${id_restaurant}`, 'GET'),
		ticketByID: (_, { id_ticket }) =>
			generalRequest(`${URL_T}/${id_ticket}`, 'GET'),
		nextTicket: (_, { id_restaurant }) =>
			generalRequest(`http://${url_T}:${port_T}/nextticket/${id_restaurant}`, 'GET'),
		ticketsBefore: (_, { id_ticket }) =>
			generalRequest(`${URL_T}/before/${id_ticket}`, 'GET'),
		// Users
		userById: (_, { cedula_user }) =>
			generalRequest(`${URL_U}/${cedula_user}`, 'GET'),
		verifyToken: (_, { token }) =>
			generalRequestHead(`${URL_U}/${cedula_user}`, 'GET', token),


//----------------TOKENS---------------------------------


		async nextTicketToken (_, { id_restaurant, token }) {
			const available = await generalRequestHead(`${URL_U}/auth/verifyToken`, 'GET', token);
			//const available = await generalRequestHead(`http://35.227.86.231:3000/users/auth/verifyToken`, 'GET', token);			
			if(available == true) {
				return generalRequest(`http://${url_T}:${port_T}/nextticket/${id_restaurant}`, 'GET')
				//return generalRequest(`http://35.243.169.156:4200/nextticket/${id_restaurant}`, 'GET')
			}
		},

		async statisticByRestaurantToken (_, { id_restaurant, token }) {
			const available = await generalRequestHead(`${URL_U}/auth/verifyToken`, 'GET', token);
			//const available = await generalRequestHead(`http://35.227.86.231:3000/users/auth/verifyToken`, 'GET', token);			
			if(available == true) {
				return generalRequest(`${URL_S}/${id_restaurant}`, 'GET')
				//return generalRequest(`http://35.233.203.49:8800/statistics/${id_restaurant}`, 'GET')
			}
		},

		async ticketsByRestaurantToken (_, { id_restaurant, token }) {
			const available = await generalRequestHead(`${URL_U}/auth/verifyToken`, 'GET', token);
			//const available = await generalRequestHead(`http://35.227.86.231:3000/users/auth/verifyToken`, 'GET', token);			
			if(available == true) {
				return generalRequest(`${URL_T}/lunchroom/${id_restaurant}`, 'GET')
				//return generalRequest(`http://35.243.169.156:4200/tickets/lunchroom/${id_restaurant}`, 'GET')
			}
		},

		async userByIdToken (_, { cedula_user, token }) {
			const available = await generalRequestHead(`${URL_U}/auth/verifyToken`, 'GET', token);
			//const available = await generalRequestHead(`http://35.227.86.231:3000/users/auth/verifyToken`, 'GET', token);			
			if(available == true) {
				return generalRequest(`${URL_U}/${cedula_user}`, 'GET')
				//return generalRequest(`http://35.227.86.231:3000/users/${cedula_user}`, 'GET')
			}
		},

	}, 



	Mutation: {
		// Statistics
		createStatistic: (_, { statistic }) =>
			generalRequest(`${URL_S}/`, 'POST', statistic),
		deleteStatistic: (_, { id_statistic }) =>
			generalRequest(`${URL_S}/${id_statistic}`, 'DELETE'),
		// Lunchrooms
		updateLunchroom: (_, { id_lunchroom, lunchroom }) =>
			generalRequest(`${URL_L}/${id_lunchroom}`, 'PATCH', lunchroom),
		createLunchroom: (_, { lunchroom }) =>
			generalRequest(`${URL_L}`, 'POST', lunchroom),
		deleteLunchroom: (_, { id_lunchroom }) =>
			generalRequest(`${URL_L}/${id_lunchroom}`, 'DELETE'),
		// Menus
		updateMenu: (_, { id_restaurant, menu }) =>
			generalRequest(`${URL_M}/?id_lunchroom=${id_restaurant}`, 'PUT', menu),
		createMenu: (_, { menu }) =>
			generalRequest(`${URL_M}/`, 'POST', menu),
		// Ratings-reviews
		createPost: (_, { post }) =>
			generalRequest(`${URL_P}/`, 'POST', post),
		// Tickets
		updateTicket: (_, {id_ticket, ticket }) =>
			generalRequest(`${URL_T}/${id_ticket}`, 'PUT', ticket),
		createTicket: (_, { ticket }) =>
			generalRequest(`${URL_T}`, 'POST', ticket),
		deleteTicket: (_, { id_ticket }) =>
			generalRequest(`${URL_T}/${id_ticket}`, 'DELETE'),
		// USers
		updateUser: (_, {id_user, user }) =>
			generalRequest(`${URL_U}/${id_user}`, 'PUT', user),
		createUser: (_, { user }) =>
			generalRequest(`${URL_U}`, 'POST', user),
		deleteUser: (_, { id_user }) =>
			generalRequest(`${URL_U}/${id_user}`, 'DELETE'),
		login: (_, { login }) =>
			generalRequest(`${URL_U}/auth`, 'POST', login),


//----------------TOKENS---------------------------------


		async updateTicketToken (_, {id_ticket, ticket, token }) {
			const available = await generalRequestHead(`${URL_U}/auth/verifyToken`, 'GET', token);
			//const available = await generalRequestHead(`http://35.227.86.231:3000/users/auth/verifyToken`, 'GET', token);			
			if(available == true) {
				return generalRequest(`${URL_T}/${id_ticket}`, 'PUT', ticket)
				//return generalRequest(`http://35.243.169.156:4200/tickets/${id_ticket}`, 'PUT', ticket)
			}
		},

		async updateUserToken (_, {id_user, user, token }) {
			const available = await generalRequestHead(`${URL_U}/auth/verifyToken`, 'GET', token);
			//const available = await generalRequestHead(`http://35.227.86.231:3000/users/auth/verifyToken`, 'GET', token);			
			if(available == true) {
				return generalRequest(`${URL_U}/${id_user}`, 'PUT', user)
				//return generalRequest(`http://35.227.86.231:3000/users/${id_user}`, 'PUT', user)
			}
		},
		
	}
};

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
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
