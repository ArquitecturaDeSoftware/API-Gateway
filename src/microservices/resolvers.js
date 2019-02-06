const dns = require('dns');
const dns_sync = require('dns-sync');
import { generalRequest, getRequest, generalRequestHead } from '../utilities';
import { url_S, port_S, entryPoint_S,
	 url_L, port_L, entryPoint_L, 
	 url_M, port_M, entryPoint_M,
	 url_P, port_P, entryPoint_P,
	 url_T, port_T, entryPoint_T,
	 url_U, port_U, entryPoint_U } from './server'; 

const options = {
	family: 4
};

var UL = '';
var UM = '';
var UP = '';
var UT = '';
var UU = '';
var US = '';

var resolvers;

console.log(url_L, dns_sync.resolve(`${url_L}`));


export default async function res(){

	var t = await dns.lookup(`${url_L}`, options, function(err, address, family){
		console.log('address: %j family: IPv%s', address, family)
		UL = address;
	});
	
	var e = await dns.lookup(`${url_M}`, options, function(err, address2, family){
		console.log('address2: %j family: IPv%s', address2, family)
		UM = address2;
	});	
	var f = await dns.lookup(`${url_P}`, options, function(err, address3, family){
		console.log('address3: %j family: IPv%s', address3, family)
		UP = address3;
	});
	var k = await dns.lookup(`${url_T}`, options, function(err, address4, family){
		console.log('address4: %j family: IPv%s', address4, family)
		UT = address4;
	});
	var l = await dns.lookup(`${url_U}`, options, function(err, address5, family){
		console.log('address5: %j family: IPv%s', address5, family)
		UU = address5;
	});
	var u = await dns.lookup(`${url_S}`, options, function(err, address6, family){
		console.log('address6: %j family: IPv%s', address6, family)
		US = address6;
	});
	
	

	const URL_S = `http://${US}:${port_S}/${entryPoint_S}`;
	const URL_L = `http://${UL}:${port_L}/${entryPoint_L}`;
	const URL_M = `http://${UM}:${port_M}/${entryPoint_M}`;
	const URL_P = `http://${UP}:${port_P}/${entryPoint_P}`;
	const URL_T = `http://${UT}:${port_T}/${entryPoint_T}`;
	const URL_U = `http://${UU}:${port_U}/${entryPoint_U}`;
	
	console.log(UL);
	

	resolvers = {
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
	
	return resolvers;
}




