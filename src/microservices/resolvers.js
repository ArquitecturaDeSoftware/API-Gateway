import { generalRequest, getRequest } from '../utilities';
import { url_S, port_S, entryPoint_S, url_L, port_L, entryPoint_L, url_M, port_M, entryPoint_M, url_P, port_P, entryPoint_P} from './server';

const URL_S = `http://${url_S}:${port_S}/${entryPoint_S}`;
const URL_L = `http://${url_L}:${port_L}/${entryPoint_L}`;
const URL_M = `http://${url_M}:${port_M}/${entryPoint_M}`;
const URL_P = `http://${url_P}:${port_P}/${entryPoint_P}`;

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
		menuByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL_M}/?id_lunchroom=${id_restaurant}`, 'GET'),		
		// Ratings-reviews
		allPosts: (_) =>
			getRequest(URL_P, '/'),
		postByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL_P}/${id_restaurant}`, 'GET'),
		// Tickets
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
	}
};

export default resolvers;
