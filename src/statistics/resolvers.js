import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allStatistics: (_) =>
			getRequest(URL, ''),
		statisticByRestaurant: (_, { id_restaurant }) =>
			generalRequest(`${URL}/${id_restaurant}`, 'GET'),
	},
	Mutation: {
		createStatistic: (_, { statistic }) =>
			generalRequest(`${URL}/`, 'POST', statistic),
//		updateStatistic: (_, { code, statistic }) =>
//			generalRequest(`${URL}/${code}`, 'PUT', statistic),
		deleteStatistic: (_, { id_statistic }) =>
			generalRequest(`${URL}/${id_statistic}`, 'DELETE')
	}
};

export default resolvers;
