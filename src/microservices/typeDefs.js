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
}
type Lunchroom{
    _id: String!
    name: String!
    numlunch: Int!
    openTime: String!
    closeTime: String!
    building: String!
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
}`;


export const microservicesQueries = `
    allStatistics: Statistic_GET!
    statisticByRestaurant(id_restaurant: String!): Statistic_GET!

    allLunchrooms: [Lunchroom]!
    lunchroomById(id_lunchroom: String!): Lunchroom!

    allMenus: [Menus]!
    menuByRestaurant(id_restaurant: String!): [Menus]! 

    allPosts: [Posts]!
    postByRestaurant(id_restaurant: String!): [Posts]!
`;


export const microservicesMutations = `
    createStatistic(statistic: StatisticInput!): Statistic_POST
    deleteStatistic(id_statistic: String!): Statistic_DEL

    updateLunchroom(id_lunchroom: String!, lunchroom: LunchroomInput!): Lunchroom
    createLunchroom(lunchroom: LunchroomInput!): String
    deleteLunchroom(id_lunchroom: String!): String

    updateMenu(id_menu: String!, menu: MenuInput_PUT!): MenuResponse_PUT
    createMenu(menu: MenuInput_POST!): String 

    createPost(post: PostInput!): Posts
`; 


