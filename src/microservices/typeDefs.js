export const microservicesTypeDef = `
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


export const microservicesQueries = `
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
`;


export const microservicesMutations = `
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
`; 